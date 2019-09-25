import { MockWindow } from '../__tests__/mocks'
import routerMockData from '../__tests__/data/router.data'
import { eventStream } from 'crayon-kit'
import { 
  create, 
  RouterEventType, 
  handlerFunc, 
  SharedState, 
} from './index'

declare const global: any

// Mute output
global.console.log = () => { }

it('Should navigate to route', (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)

  app.path('/', (req, res) => {
    expect(req.pathname).toBe('')
  })

  app.path('/test', (req, res) => {
    expect(req.pathname).toBe('/test')
    done()
  })

  app.load()

  setTimeout(() => app.navigate('/test'))
})

it('Should unmount on router destroy', (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)

  app.path('/', (req, res) => {
    res.unmount = () => {
      done()
    }
  })

  app.load()

  setTimeout(() => app.destroy(), 5)
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

it('Should redirect to correct route', (done) => {
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

  app.load()
})

it('Should route with params', (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)

  app.path('/:id', (req, res) => {
    expect(req.params.id).toBe('test-value')
    done()
  })

  app.load()

  app.navigate('/test-value')
})

it('Should not rerender route with params', (done) => {
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

  app.load()

  setTimeout(() => app.navigate('/test-value'))
  setTimeout(() => app.navigate('/test-value-2'), 5)
  setTimeout(() => app.navigate('/test-value-3'), 10)
})

it('Should route to wildcard route', (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)

  app.path('/**', (req, res) => {
    expect(req.pathname).toBe('')
    done()
  })

  app.load()
})

it('Should route to wildcard route if nothing more specific', (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)

  app.path('/test', (req, res) => {
    expect(req.pathname).toBe('/test')
    done()
  })

  app.path('/test/**', (req, res) => {
    console.error()
  })

  app.load()

  app.navigate('/test')
})

it('Should skip wildcard route in favour of more specific params route', (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)

  app.path('/test/:id', (req, res) => {
    expect(req.pathname).toBe('/test/hi')
    done()
  })

  app.path('/test/**', (req, res) => {
    console.error()
  })

  app.load()

  app.navigate('/test/hi')
})

it('Should route to wildcard route when route with params has nested route', (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)

  app.path('/test/:id', (req, res) => {
    done.fail('Should not have run this callback')
  })

  app.path('/test/**', (req, res) => {
    expect(req.pathname).toBe('/test/hi/hello')
    done()
  })

  app.load()

  app.navigate('/test/hi/hello')
})

it('Should route to more specific route when overlaped with params', (done) => {
  const window = new MockWindow() as any
  const app = create('test-router', window)

  app.path('/home', (req, res) => {
    expect(req.pathname).toBe('/home')
    done()
  })

  app.path('/:id', (req, res) => {
    console.error()
  })

  app.load()

  app.navigate('/home')
})

it('Should run callback in correct router', (done) => {
  const window = new MockWindow() as any

  // Router 1
  const app = create('test-router', window)
  app.path('/home', (req, res) => {
    done.fail('Should not run this callback')
  })
  app.load()

  // Router 2
  const app2 = create('test-router-2', window)
  app2.path('/not-home', (req, res) => {
    expect(req.pathname).toBe('/not-home')
    done()
  })
  app2.load()

  // Navigate
  app2.navigate('/not-home')
})

it('Should run callback in correct router', (done) => {
  const window = new MockWindow() as any

  const app = create('a', window)
  const events: string[] = []

  const complete = (v: string) => {
    events.push(v)
    if (events.length !== 5) {
      return
    }
    expect(events).toEqual([
      'a1', 'b1', 'a2', 'a1', 'b1'
    ])
    done()
  }

  app.path('/:a/**', (req, res) => {
    const app2 = create('b', window)

    app2.path('/test/:b', (req, res) => {
      complete('b1')
    })


    res.onLeave(() => {
      app2.destroy()
    })

    complete('a1')

    app2.load()
  })

  app.path('/test/page-on-root', (req, res) => {
    complete('a2')
  })

  app.load()

  // Navigate
  setTimeout(() => app.navigate('/test/page-on-nested'))
  setTimeout(() => app.navigate('/test/page-on-root'), 10)
  setTimeout(() => app.navigate('/test/page-on-nested'), 20)
})

it('Should destroy nested routers', (done) => {
  const window = new MockWindow() as any
  const app = create('a', window)
  const events: string[] = []

  const complete = (str: string) => {
    events.push(str)
    if (events.length !== 7) {
      return
    }
    expect(events).toEqual([
      'a1', 'b1', 'c1', 'a2', 'a1', 'b1', 'c1'
    ])
    done()
  }

  app.path('/:a/**', (req1, res1) => {
    const app2 = create('b', window)

    app2.path('/a/b/**', (req2, res2) => {
      const app3 = create('b', window)

      app3.path('/a/b/c', (req3, res3) => {
        complete('c1')
      })


      res2.onLeave(() => {
        app3.destroy()
      })
      complete('b1')
      app3.load()
    })

    res1.onLeave(() => {
      app2.destroy()
    })

    complete('a1')
    app2.load()
  })

  app.path('/a/root', (req, res) => {
    complete('a2')
  })

  app.load()

  // Navigate
  setTimeout(() => app.navigate('/a/b/c'))
  setTimeout(() => app.navigate('/a/root'), 10)
  setTimeout(() => app.navigate('/a/b/c'), 20)
})

// Potentially brittle
xit('Should create events in this order with two layers of nested routers', (done) => {
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