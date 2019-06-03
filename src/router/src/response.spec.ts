import { Response } from './response'
declare const global: any

it('Should store onLeave value', () => {
    const res = new Response()
    const action = () => console.log('Hello World')
    res.onLeave(action)
    expect(res.leaveAction).toEqual(action)
})

it('Should store leave value', () => {
    const res = new Response()
    res.end()

    expect(res.hasCompleted).toEqual(true)
})

it('Should run mount functions', () => {
    let events: any[] = []
    global.console = {
        log: (...args: any) => events.push(args)
    }

    const res = new Response()
    res.unmount('unmount')
    res.mount('mount')
    res.redirect('redirect')
    
    expect(events).toEqual([
        ['Unmount action is not set'],
        ['unmount'], 
        ['Mount action is not set'],
        ['mount'],
        ['Redirect action is not set'],
        ['redirect']
    ])
})
