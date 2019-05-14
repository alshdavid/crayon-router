import { createSubject } from './subject'

it('Should get value when subscribed to', () => {
    const subject = createSubject<string>()
    let result: string | undefined

    const a = subject.subscribe((value) =>
        result = value
    )

    subject.next('marco')
    a.unsubscribe()

    expect(result).toBe('marco')
})


it('Should not get value when unsubscribed', () => {
    const subject = createSubject<string>()
    let result: string | undefined

    const a = subject.subscribe((value) =>
        result = value
    )
    a.unsubscribe()
    subject.next('marco')

    expect(result).toBe(undefined)

})