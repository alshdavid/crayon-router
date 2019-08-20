import { MockDocument } from "./document";

export class MockWindow {
    eventListeners: Record<string, any[]> = {}
    paths: string[] = []
    lastPath = ''
    document = new MockDocument()

    location = {
        pathname: ''
    }

    history = {
        pushState: (a: any, title: string, path: string) => {
            this.lastPath = this.location.pathname
            this.location.pathname = path
            this.paths.push(path)
        },
        back: () => {
            this.lastPath = this.location.pathname
            this.paths.pop()
            this.location.pathname = this.paths[this.paths.length - 1]
            this.eventListeners['popstate'].forEach(f => f())
        },
        forward: () => {
            this.paths.push(this.lastPath)
            this.location.pathname = this.lastPath
            this.eventListeners['popstate'].forEach(f => f())
        }
    }

    addEventListener(event: string, callback: () => void) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = []
        }
        this.eventListeners[event].push(callback)
    }

    removeEventListener(event: string, callback: () => void) {

    }

    constructor(
        path: string = ''
    ) {
        this.location.pathname = path
        this.paths.push(path)
    }
}
