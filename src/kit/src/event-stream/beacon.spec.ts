import { Beacon } from './beacon'

it('Should get value when subscribed to', () => {
    const beacon = new Beacon<string>()
    let result: string | undefined

    const a = beacon.subscribe((value) =>
        result = value
    )

    beacon.next('marco')
    a.unsubscribe()

    expect(result).toBe('marco')
})


it('Should not get value when unsubscribed', () => {
    const beacon = new Beacon<string>()
    let result: string | undefined

    const a = beacon.subscribe((value) =>
        result = value
    )
    a.unsubscribe()
    beacon.next('marco')

    expect(result).toBe(undefined)

})