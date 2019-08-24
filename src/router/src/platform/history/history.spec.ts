import { History, HistoryType } from './history'
import { MockWindow } from '../../../__tests__/mocks';

it('Should emit events and stuff', () => {
    const window = new MockWindow() as any
    const history = new History(window)

    expect(history.lastRoute).toBe(undefined)
    expect(history.currentRoute).toBe('')

    history.push('/test')
    expect(history.lastRoute).toBe('')
    expect(history.currentRoute).toBe('/test')
    expect(history.currentEvent).toEqual(
        { type: HistoryType.push, from: '', to: '/test' }
    )

    history.pop()
    expect(history.lastRoute).toBe(undefined)
    expect(history.currentRoute).toBe('')
    expect(history.currentEvent).toEqual(
        { type: HistoryType.back, from: '/test', to: '' }
    )

    history.push('/test')
    window.history.back()
    expect(history.lastRoute).toBe(undefined)
    expect(history.currentRoute).toBe('')
    expect(history.currentEvent).toEqual(
        { type: HistoryType.back, from: '/test', to: '' }
    )

    window.history.forward()
    expect(history.lastRoute).toBe('')
    expect(history.currentRoute).toBe('/test')
    expect(history.currentEvent).toEqual(
        { type: HistoryType.forward, from: '', to: '/test' }
    )
})
