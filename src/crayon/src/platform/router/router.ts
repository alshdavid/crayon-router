import { url, eventStream } from 'crayon-kit'
import { History, HistoryEvent } from '../history'
import { RouteMap } from '../route-map';
import { Locator } from '../locator'
import { handlerFunc, RouterEventType, RouterEvent } from './types'
import { Request } from './request'
import { Response } from './response'
import { Group } from "./group"

export class Router {
  public currentRes: Response | undefined
  public currentReq: Request | undefined
  private isLoading = true
  private state: Record<string, any> = {}
  private $history: eventStream.Subscription
  private $reqs: eventStream.Subscription[] = []
  public loads = 0
  
  constructor(
    public id: string,
    public locator: Locator,
    public routeMap: RouteMap,
    public history: History,
    public events: eventStream.Beacon<RouterEvent>,
  ) { 
    this.$history = this.history.onEvent.subscribe(this.onHistoryEvent)
  }

  public destroy() {
    this.$history.unsubscribe()
    this.$reqs.forEach(req => req.unsubscribe())
    if (this.currentRes) {
      this.currentRes.runOnLeave()
      this.currentRes.unmount()
    }
    this.emitEvent(RouterEventType.Destroyed)
  }

  public path(path: string, ...handlers: handlerFunc[]): void {
    this.routeMap.add(path, ...handlers)
  }

  public use(target: handlerFunc | Group) {
    if (target instanceof Group) {
      this.useGroup(target)
    } else {
      this.routeMap.addMiddleware(target)
    }
  }

  public async navigate(path: string) {
    if (this.isLoading) {
      return
    }
    this.history.push(path)
  }

  public async back() {
    if (this.isLoading) {
      return
    }
    this.history.pop()
  }

  public load() {
    this.emitEvent(RouterEventType.LoadTriggered)
    return this.digest()
  }

  private onHistoryEvent = (event: HistoryEvent) => {
    this.emitEvent(RouterEventType.History, { ...event })
    this.digest()
  }

  private useGroup(group: Group) {
    for (const route in group.routes) {
      const path = url.normalise(group.base + route)
      const handlers = [
        ...group.middleware,
        ...group.routes[route]
      ]
      this.routeMap.add(path, ...handlers)
    }
  }

  private emitEvent(type: RouterEventType, data?: any) {
    if (!data) {
      data = this.locator.getLocation().pathname
    }
    this.events.next({
      id: this.id, 
      type, 
      data
    })
  }

  private async runHandlers(handlers: handlerFunc[], req: Request, res: Response) {
    for (const handler of handlers) {
      if (res.hasCompleted) {
        break
      }
      await handler(req, res, this.state, (this as any))
    }
  }

  private onRedirect = (path: string) => {
    this.isLoading = false
    this.emitEvent(RouterEventType.Redirected)
    this.emitEvent(RouterEventType.ProgressEnd)
    this.history.push(path)
  }

  // digest() matches a path with patterns in the current router's routing 
  // table and executes the middleware/handlers for that route
  private async digest() {
    this.emitEvent(RouterEventType.ProgressStart)
    this.isLoading = true
    const location = this.locator.getLocation()
    const res = new Response()
    res.redirect = this.onRedirect

    const result = this.routeMap.findWithPathname(location.pathname)
    if (!result) {
      this.emitEvent(RouterEventType.NoHanlders)
      this.emitEvent(RouterEventType.ProgressEnd)
      this.isLoading = false
      return
    }
    const { handlers, pattern, params } = result 
    const req = this.locator.generateRequest(pattern, params)

    // Don't run this route if you're already on it.        
    if (
      this.history.currentEvent && 
      this.loads !== 0
    ) {
      const previousPattern = this.routeMap.findWithPathname(this.history.currentEvent.from)
      if (pattern === (previousPattern && previousPattern.pattern)) {
        this.emitEvent(RouterEventType.SameRouteAbort)
        return
      }
    }
    // Watch for update and mutate the request untill you navigate
    // elsewhere. This adds a new subscirption and removes the previous
    this.$reqs.push(this.onRequestUpdate(req, res, pattern))

    // Run handlers and middleware. They will skip
    // if a the res object has run 'end()'
    this.emitEvent(RouterEventType.RunningHanlders)
    await this.runHandlers(handlers, req, res)
    this.loads++
    this.isLoading = false
    this.currentRes = res
    this.emitEvent(RouterEventType.ProgressEnd)
  }

  private onRequestUpdate(
    req: Request, 
    res: Response, 
    key: string
  ): eventStream.Subscription {
    const onEvent = (event: HistoryEvent) => {
      const currentPattern = this.routeMap.findWithPathname(event.to)
      const previousPattern = this.routeMap.findWithPathname(event.from)
      if (
        (currentPattern && currentPattern.pattern) !==
        (previousPattern && previousPattern.pattern)
      ) {
        this.$reqs[0].unsubscribe()
        this.$reqs.shift()
        res.runOnLeave()
        return
      }
      const params = url.matchPath(key, req.pathname)
      const newRequest = this.locator.generateRequest(key, params!)
      Object.assign(req, newRequest)
      this.emitEvent(RouterEventType.ProgressEnd, {
        path: newRequest.pathname,
        note: 'Router ended after same-route update',
        route: key
      })
      this.isLoading = false
    }
    return this.history.onEvent.subscribe(onEvent)
  }
}


