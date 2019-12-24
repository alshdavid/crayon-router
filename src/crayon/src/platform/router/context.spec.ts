import { Context } from './context'

it('Should store onLeave value', () => {
    const ctx = new Context()
    const action = () => console.log('Hello World')
    ctx.onLeave(action)
    expect(ctx.leaveActions.includes(action)).toEqual(true)
})

it('Should store leave value', () => {
    const ctx = new Context()
    ctx.end()

    expect(ctx.hasCompleted).toEqual(true)
})
