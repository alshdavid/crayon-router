import * as observe from '../platform/observe'
import * as url from '../platform/url'

export enum HistoryType {
    push = 'PUSH',
    back = 'BACK',
    forward = 'FORWARD',
    replace = 'REPLACE'
}

export interface HistoryEvent {
    type: string
    from: string
    to: string
}

export class History {
    entries: string[] = [ window.location.pathname ]
    events: HistoryEvent[] = []
    onEvent = observe.createSubject<HistoryEvent>()

    onPop = () => {
        const path = window.location.pathname
        if (path === this.lastRoute) {
            const event = { type: HistoryType.back, from: this.currentRoute, to: this.lastRoute }
            this.entries.pop()
            this.events.push(event)
            this.onEvent.next(event)
        } else {
            const event = { type: HistoryType.forward, from: this.currentRoute, to: path }
            this.entries.push(path)
            this.events.push(event)
            this.onEvent.next(event)
        }
    }

    get lastEvent() {
        return this.events[this.events.length - 2]
    }

    get currentEvent() {
        return this.events[this.events.length - 1]
    }

    get lastRoute() {
        return this.entries[this.entries.length - 2]
    }

    get currentRoute() {
        return this.entries[this.entries.length - 1]
    }

    constructor() {
        window.addEventListener('popstate', this.onPop)
    }

    destroy() {
        window.removeEventListener('popstate', this.onPop)
    }

    push(path: string) {
        path = url.normalise(path)
        window.history.pushState(null, document.title, path)
        const event = { type: HistoryType.push, from: this.currentRoute, to: path }
        this.entries.push(path)
        this.events.push(event)
        this.onEvent.next(event)
    }

    pop() {
        window.history.back()
    }

    replace(path: string) {
        path = url.normalise(path)
        window.history.replaceState(null, document.title, path)
        this.entries[this.entries.length - 1] = path
        this.onEvent.next({ type: HistoryType.replace, from: this.currentRoute, to: path })
    }
}
