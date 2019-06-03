import { create } from './router'
import { MockWindow, MockDocument } from './tests/mocks'

it('Should navigate to route', (done) => {
    const window = new MockWindow()
    const document = new MockDocument()
    const app = create(
        'test-router',
        window as Window,
        document as Document
    )

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

it('Should redirect to correct route', (done) => {
    const window = new MockWindow()
    const document = new MockDocument()
    const app = create(
        'test-router',
        window as Window,
        document as Document
    )

    app.path('/', (req,res) => {
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
    const window = new MockWindow()
    const document = new MockDocument()
    const app = create(
        'test-router',
        window as Window,
        document as Document
    )

    app.path('/:id', (req,res) => {
        expect(req.params.id).toBe('test-value')
        done()
    })

    app.load()

    app.navigate('/test-value')
})

it('Should route to wildcard route', (done) => {
    const window = new MockWindow()
    const document = new MockDocument()
    const app = create(
        'test-router',
        window as Window,
        document as Document
    )

    app.path('/**', (req,res) => {
        expect(req.pathname).toBe('')
        done()
    })

    app.load()
})

it('Should route to wildcard route if nothing more specific', (done) => {
    const window = new MockWindow()
    const document = new MockDocument()
    const app = create(
        'test-router',
        window as Window,
        document as Document
    )

    app.path('/test', (req,res) => {
        expect(req.pathname).toBe('/test')
        done()
    })

    app.path('/test/**', (req,res) => {
        console.error()
    })

    app.load()

    app.navigate('/test')
})

it('Should skip wildcard route in favour of more specific params route', (done) => {
    const window = new MockWindow()
    const document = new MockDocument()
    const app = create(
        'test-router',
        window as Window,
        document as Document
    )

    app.path('/test/:id', (req,res) => {
        expect(req.pathname).toBe('/test/hi')
        done()
    })

    app.path('/test/**', (req,res) => {
        console.error()
    })

    app.load()

    app.navigate('/test/hi')
})

it('Should route to wildcard route when route with params has nested route', (done) => {
    const window = new MockWindow()
    const document = new MockDocument()
    const app = create(
        'test-router',
        window as Window,
        document as Document
    )

    app.path('/test/:id', (req,res) => {
        console.error()
    })

    app.path('/test/**', (req,res) => {
        expect(req.pathname).toBe('/test/hi/hello')
        done()
    })

    app.load()

    app.navigate('/test/hi/hello')
})

it('Should route to more specific route when overlaped with params', (done) => {
    const window = new MockWindow()
    const document = new MockDocument()
    const app = create(
        'test-router',
        window as Window,
        document as Document
    )

    app.path('/home', (req,res) => {
        expect(req.pathname).toBe('/home')
        done()
    })

    app.path('/:id', (req,res) => {
        console.error()
    })

    app.load()

    app.navigate('/home')
})

it('Should run callback in correct router', (done) => {
    const window = new MockWindow()
    const document = new MockDocument()

    // Router 1
    const app = create(
        'test-router',
        window as Window,
        document as Document
    )
    app.path('/home', (req,res) => {
        console.error()
    })
    app.load()

    // Router 2
    const app2 = create(
        'test-router-2',
        window as Window,
        document as Document
    )
    app2.path('/not-home', (req,res) => {
        expect(req.pathname).toBe('/not-home')
        done()
    })
    app2.load()

    // Navigate
    app2.navigate('/not-home')
})

