import { Beacon } from '../../kit/beacon'
import * as url from '../../kit/url'

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

// History is a wrapper on top of window.history
// exposing a stream and extended API including
// forward detection 
export class History {
    entries: string[] = []
    events: HistoryEvent[] = []
    onEvent = new Beacon<HistoryEvent>()
    document: Document

    onPop = () => {
        const path = this.window.location.pathname
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

    constructor(
        private window: Window = window,
    ) {
        this.document = this.window.document
        this.entries.push(this.window.location.pathname)
        this.window.addEventListener('popstate', this.onPop)
    }

    destroy() {
        this.window.removeEventListener('popstate', this.onPop)
    }

    push(path: string) {
        path = url.normalise(path)
        this.window.history.pushState(null, this.document.title, path)
        const event = { type: HistoryType.push, from: this.currentRoute, to: path }
        this.entries.push(path)
        this.events.push(event)
        this.onEvent.next(event)
    }

    pop() {
        this.window.history.back()
    }

    replace(path: string) {
        path = url.normalise(path)
        this.window.history.replaceState(null, this.document.title, path)
        this.entries[this.entries.length - 1] = path
        this.onEvent.next({ type: HistoryType.replace, from: this.currentRoute, to: path })
    }
}
