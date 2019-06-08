import { routes } from './routes'
import { Response } from 'crayon'
import { MockRouter, MockRequest } from './mocks/mocks';

it('Should give the right animation name and duration', () => {
    const middleware = routes([
        { from: '/a', to: '/b', name: 'test-animation', duration: 5000 },
    ])
    const router = new MockRouter('/a', '/b') as any
    const req = new MockRequest() as any
    const res = new Response()
    middleware(req, res, router.state, router)

    expect(res.ctx.animation.name).toBe('test-animation')
})

it('Should give the right animation name and duration', () => {
    const middleware = routes([
        { from: '/**', to: '/**', name: 'test-animation', duration: 5000 },
    ])
    const router = new MockRouter('/a', '/b') as any
    const req = new MockRequest() as any
    const res = new Response()
    middleware(req, res, router.state, router)

    expect(res.ctx.animation.name).toBe('test-animation')
})

it('Should give the right animation name and duration', () => {
    const middleware = routes([
        { from: '/**', to: '/**', name: 'test-animation', duration: 5000 },
    ])
    const router = new MockRouter('/a/test', '/b') as any
    const req = new MockRequest() as any
    const res = new Response()
    middleware(req, res, router.state, router)

    expect(res.ctx.animation.name).toBe('test-animation')
})

it('Should give the right animation name and duration', () => {
    const middleware = routes([
        { from: '/**', to: '/**', name: 'test-animation', duration: 5000 },
    ])
    const router = new MockRouter('/a', '/b/c') as any
    const req = new MockRequest() as any
    const res = new Response()
    middleware(req, res, router.state, router)

    expect(res.ctx.animation.name).toBe('test-animation')
})