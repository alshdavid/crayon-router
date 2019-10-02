import { MockWindow } from '../__tests__/mocks'
import routerMockData from '../__tests__/data/router.data'
import { eventStream, sleep } from 'crayon-kit'
import { 
  group,
  create, 
  RouterEventType, 
  handlerFunc, 
  SharedState, 
  History,
} from './index'

declare const global: any

const ofType = (id: string, type: RouterEventType) => (event: RouterEvent) => event.id === id && event.type === type
const ofTypeAndData = (id: string, type: RouterEventType, data: any) => (event: RouterEvent) => ofType(id, type) && event.data === data
const loadComplete = (router: Router, id?: string) => router.events.first(ofType(id || router.id, RouterEventType.ProgressEnd))
const navigate = (router: Router, path: string) => {
  router.navigate(path)
  return loadComplete(router)
}

// Mute output
global.console.log = () => { }

it('Should cancel route if there is a middleware redirecting', async (done) => {
  const handlerSpy = jest.fn()
  const window = new MockWindow() as any
  const history = new History(window)
  const sharedState = new SharedState(history)
  const app = create('router-a', window, sharedState)
  let hasAuthenticated = false

  void async function() {
    await loadComplete(app)

    await navigate(app, '/secure')
    expect(handlerSpy).toHaveBeenNthCalledWith(1, 'middleware - skip')
    expect(handlerSpy).toHaveBeenNthCalledWith(2, '/public/login')

    hasAuthenticated = true

    await navigate(app, '/secure')
    expect(handlerSpy).toHaveBeenNthCalledWith(3, '/secure')


    done()
  }()

  const authMiddleware: handlerFunc = (req, res) => {
    if (hasAuthenticated === false) {
      handlerSpy('middleware - skip')
      return res.redirect('/public/login')
    }
  }
  
  app.path('/public/login', () => {
    handlerSpy('/public/login')
  })

  app.path('/secure', authMiddleware, () => {
    handlerSpy('/secure')
    if (hasAuthenticated === false) {
      done.fail()
    }
  })

  await app.load()
})

it('Should cancel route if there is a middleware redirecting group', async (done) => {
  const handlerSpy = jest.fn()
  const window = new MockWindow() as any
  const history = new History(window)
  const sharedState = new SharedState(history)
  const app = create('router-a', window, sharedState)
  let hasAuthenticated = false

  void async function() {
    await loadComplete(app)

    await navigate(app, '/secure')
    expect(handlerSpy).toHaveBeenNthCalledWith(1, 'middleware - skip')
    expect(handlerSpy).toHaveBeenNthCalledWith(2, '/public/login')

    hasAuthenticated = true

    await navigate(app, '/secure')
    expect(handlerSpy).toHaveBeenNthCalledWith(3, '/secure')

    done()
  }()

  const authMiddleware: handlerFunc = (req, res) => {
    if (hasAuthenticated === false) {
      handlerSpy('middleware - skip')
      return res.redirect('/public/login')
    }
  }

  const publicGroup = group('/public')
  const secureGroup = group('/secure')
  
  publicGroup.path('/login', () => {
    handlerSpy('/public/login')
  })

  secureGroup.path('/', authMiddleware, () => {
    handlerSpy('/secure')
    if (hasAuthenticated === false) {
      done.fail()
    }
  })

  app.use(publicGroup)
  app.use(secureGroup)
  await app.load()
})

it('Should allow navigation after initial navigation', async (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)
  let hasClicked = false

  app.path('/browse/:cname', (req, res) => {
    const sub = app.events.subscribe(async event => {
      if (event.type !== RouterEventType.ProgressEnd) {
        return
      }
      if (hasClicked == true) {
        done()
        return
      }
      hasClicked = true
      await app.navigate('/browse/b')
    })
    res.onLeave(() => sub.unsubscribe())
  })

  await app.load()
  await app.navigate('/browse/a')
})

it('Should navigate to route', async (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)

  app.path('/', (req, res) => {
    expect(req.pathname).toBe('')
  })

  app.path('/test', (req, res) => {
    expect(req.pathname).toBe('/test')
    done()
  })

  await app.load()

  await app.navigate('/test')
})

it('Should unmount on router destroy', async (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)

  app.path('/', (req, res) => {
    res.unmount = () => {
      done()
    }
  })

  await app.load()

  app.destroy()
})

it('Should cleanup shared state on router destroy', async () => {
  const routerName = 'test-router'
  const destroy = jest.fn()
  const window = new MockWindow() as any
  const history: any = {
    destroy,
    onEvent: new eventStream.Beacon()
  }
  const sharedState = new SharedState(history)
  const app = create(routerName, window, sharedState)

  const hasRouter = (): boolean => !!sharedState!.routers[routerName]

  void async function () {
    await sharedState.events.first(event =>
      event.type === RouterEventType.Unregistered
    )
    expect(hasRouter()).toBe(false)
    expect(destroy).toBeCalled()
  }()

  expect(hasRouter()).toBe(true)
  app.destroy()
})

it('Should redirect to correct route', async (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)

  app.path('/', (req, res) => {
    expect(req.pathname).toBe('')
    return res.redirect('/test')
  })

  app.path('/test', (req, res) => {
    expect(req.pathname).toBe('/test')
    done()
  })

  await app.load()
})

it('Should route with params', async (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)

  app.path('/:id', (req, res) => {
    expect(req.params.id).toBe('test-value')
    done()
  })

  await app.load()

  await app.navigate('/test-value')
})

it('Should not rerender route with params', async (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)
  let hits = 0
  let events = 0

  app.events.subscribe(event => {
    if (event.type !== RouterEventType.ProgressEnd) {
      return
    }
    events++
    if (events !== 4) {
      return
    }
    expect(hits).toBe(1)
    done()
  })

  app.path('/:id', (req, res) => {
    hits++
  })

  await app.load()

  await app.navigate('/test-value')
  await app.navigate('/test-value-2')
  await app.navigate('/test-value-3')
})

it('Should route to wildcard route', async (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)

  app.path('/**', (req, res) => {
    expect(req.pathname).toBe('')
    done()
  })

  await app.load()
})

it('Should route to wildcard route if nothing more specific', async (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)

  app.path('/test', (req, res) => {
    expect(req.pathname).toBe('/test')
    done()
  })

  app.path('/test/**', (req, res) => {
    console.error()
  })

  await app.load()

  await app.navigate('/test')
})

it('Should skip wildcard route in favour of more specific params route', async (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)

  app.path('/test/:id', (req, res) => {
    expect(req.pathname).toBe('/test/hi')
    done()
  })

  app.path('/test/**', (req, res) => {
    console.error()
  })

  await app.load()

  await app.navigate('/test/hi')
})

it('Should route to wildcard route when route with params has nested route', async (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)

  app.path('/test/:id', (req, res) => {
    done.fail('Should not have run this callback')
  })

  app.path('/test/**', (req, res) => {
    expect(req.pathname).toBe('/test/hi/hello')
    done()
  })

  await app.load()

  await app.navigate('/test/hi/hello')
})

it('Should route to more specific route when overlaped with params', async (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)

  app.path('/home', (req, res) => {
    expect(req.pathname).toBe('/home')
    done()
  })

  app.path('/:id', (req, res) => {
    console.error()
  })

  await app.load()

  await app.navigate('/home')
})

it('Should run callback in correct router', async (done) => {
  const window = new MockWindow() as any

  // Router 1
  const app = create('test-router', window)

  app.path('/home', (req, res) => {
    done.fail('Should not run this callback')
  })

  await app.load()

  // Router 2
  const app2 = create('test-router-2', window)

  app2.path('/not-home', (req, res) => {
    expect(req.pathname).toBe('/not-home')
    done()
  })

  await app2.load()

  // Navigate
  await app2.navigate('/not-home')
})

import { Subject } from 'rxjs'
import { RouterEvent, Router } from './platform/router'

it('Should run callbacks in correct router', async (done) => {
  const handlerSpy = jest.fn()
  const window = new MockWindow() as any
  const history = new History(window)
  const sharedState = new SharedState(history)
  
  const app = create('router-a', window, sharedState)
  
  void async function() {
    await loadComplete(app)

    await navigate(app, '/test/root')
    expect(handlerSpy).toHaveBeenNthCalledWith(1, '/test/root')
    
    await navigate(app, '/test/nested')
    expect(handlerSpy).toHaveBeenNthCalledWith(2, '/:a/**')
    expect(handlerSpy).toHaveBeenNthCalledWith(3, '/test/:b')

    await navigate(app, '/test/root')
    expect(handlerSpy).toHaveBeenNthCalledWith(4, '/test/root')

    app.destroy()
    done()
  }()

  app.path('/test/root', () => handlerSpy('/test/root'))

  app.path('/:a/**', async (req, res) => {  
    handlerSpy('/:a/**')
    const app2 = create('router-b', window, sharedState)
    res.onLeave(() => app2.destroy())

    app2.path('/test/:b', () => {
      handlerSpy('/test/:b')
    })

    app2.load()
  })


  await app.load()
})

it('Should destroy nested routers', async (done) => {
  const handlerSpy = jest.fn()
  const window = new MockWindow() as any
  const app = create('a', window)

  void async function test() {
    await loadComplete(app)
    
    await navigate(app, '/a/b/c')
    expect(handlerSpy).toHaveBeenNthCalledWith(1, '/:a/**')
    expect(handlerSpy).toHaveBeenNthCalledWith(2, '/a/b/**')
    expect(handlerSpy).toHaveBeenNthCalledWith(3, '/a/b/c')

    await navigate(app, '/a/root')
    expect(handlerSpy).toHaveBeenNthCalledWith(4, '/a/root')

    await navigate(app, '/a/b/c')
    expect(handlerSpy).toHaveBeenNthCalledWith(5, '/:a/**')
    expect(handlerSpy).toHaveBeenNthCalledWith(6, '/a/b/**')
    expect(handlerSpy).toHaveBeenNthCalledWith(7, '/a/b/c')

    app.destroy()
    done()
  }()

  app.path('/a/root', () => handlerSpy('/a/root'))

  app.path('/:a/**', async (req1, res1) => {
    handlerSpy('/:a/**')
    const app2 = create('b', window)
    res1.onLeave(() => app2.destroy())


    app2.path('/a/b/**', async (req2, res2) => {
      handlerSpy('/a/b/**')
      const app3 = create('c', window)
      res2.onLeave(() => app3.destroy())

      app3.path('/a/b/c', () => handlerSpy('/a/b/c'))
      await app3.load()
    })

    await app2.load()
  })

  await app.load()
})

// Potentially brittle
xit('Should create events in this order with two layers of nested routers', async (done) => {
  const window = new MockWindow('/a/a/a') as any
  const empty: handlerFunc = (req, res) => { }

  const pathA: handlerFunc = (req, res) => {
    const app = create('router-b', window)
    res.onLeave(() => app.destroy())
    app.path('/a/a/**', pathB)
    app.load()
  }

  const pathB: handlerFunc = (req, res) => {
    const app = create('router-c', window)
    res.onLeave(() => app.destroy())
    app.path('/a/a/a', empty)
    app.load()
  }

  const app = create('router-a', window)

  app.path('/a/**', pathA)
  app.path('/a/static', empty)

  const eventHistory: any[] = []
  app.events.subscribe(event => {
    eventHistory.push(event)
    if (eventHistory.length !== 30) {
      return
    }
    expect(eventHistory).toEqual(routerMockData["test-a"])
    done()
  })

  app.load()

  setTimeout(() => app.navigate('/a/static'), 10)
  setTimeout(() => app.navigate('/a/a/a'), 20)
})