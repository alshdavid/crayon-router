import { Group } from './group'
import { handlerFunc } from './types';

it('Should set path', () => {
    const g = new Group('/path')
    expect(g.base).toBe('/path')
})

it('Should add route on path', () => {
    const g = new Group('/path')
    const handler: handlerFunc = (req, res) => console.log('Hello World')
    g.path('/hi', handler)
    expect(g.routes['/hi'].includes(handler)).toEqual(true)
})

it('Should add global middleware', () => {
    const g = new Group('/path')
    const middleware: handlerFunc = (req, res) => console.log('Hello World')
    g.use(middleware)
    expect(g.middleware.includes(middleware)).toBe(true)
})

it('Should add route middleware on path', () => {
    const g = new Group('/path')
    const handler: handlerFunc = (req, res) => console.log('Hello World')
    const middleware: handlerFunc = (req, res) => console.log('Hello World')
    g.path('/hi', middleware, handler)
    expect(g.routes['/hi'].includes(handler)).toEqual(true)
    expect(g.routes['/hi'].includes(middleware)).toEqual(true)
})

