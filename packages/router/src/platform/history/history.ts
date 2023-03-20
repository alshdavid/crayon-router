import { normalise } from "../url/normalise"

export type HistoryType = typeof HistoryType[keyof typeof HistoryType]
export const HistoryType = {
  push: "PUSH",
  back: "BACK",
  forward: "FORWARD",
  replace: "REPLACE",
}

export interface HistoryEventDetail {
  type: string
  from: string
  to: string
}

export class HistoryEvent extends CustomEvent<any> {
  constructor(detail: HistoryEventDetail) {
    super("update", { detail })
  }
}

export class History extends EventTarget {
  entries: string[] = []
  events: HistoryEventDetail[] = []
  document: Document

  onPop = () => {
    const path = this.window.location.pathname
    let event: HistoryEventDetail
    if (path === this.lastRoute) {
      event = {
        type: HistoryType.back,
        from: this.currentRoute,
        to: this.lastRoute,
      }
      this.entries.pop()
    } else {
      event = { type: HistoryType.forward, from: this.currentRoute, to: path }
      this.entries.push(path)
    }
    this.events.push(event)
    this.dispatchEvent(new HistoryEvent(event))
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

  constructor(private window: Window = window) {
    super()
    this.document = this.window.document
    this.entries.push(this.window.location.pathname)
    this.window.addEventListener("popstate", this.onPop)
  }

  destroy() {
    this.window.removeEventListener("popstate", this.onPop)
  }

  push(path: string) {
    path = normalise(path, false)
    this.window.history.pushState(null, this.document.title, path)
    const event = { type: HistoryType.push, from: this.currentRoute, to: path }
    this.entries.push(path)
    this.events.push(event)
    this.dispatchEvent(new HistoryEvent(event))
  }

  pop() {
    this.window.history.back()
  }

  replace(path: string) {
    path = normalise(path, false)
    this.window.history.replaceState(null, this.document.title, path)
    this.entries[this.entries.length - 1] = path
    const event: HistoryEventDetail = {
      type: HistoryType.replace,
      from: this.currentRoute,
      to: path,
    }
    this.dispatchEvent(new HistoryEvent(event))
  }
}
