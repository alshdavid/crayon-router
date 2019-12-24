import { url, eventStream } from 'crayon-kit'
import { History, HistoryEvent } from '../history'
import { RouteMap } from '../route-map';
import { Location } from '../locator'
import { handlerFunc, RouterEventType, RouterEvent } from './types'
import { Context } from './context'
import { Group } from "./group"

export class Router {
  public currentContext: Context | undefined
  private isLoading = true
  private state: Record<string, any> = {}
  private $history: eventStream.Subscription
  private $reqs: eventStream.Subscription[] = []
  public loads = 0
  
  constructor(
    public id: string,
    public location: Location,
    public routeMap: RouteMap,
    public history: History,
    public events: eventStream.Beacon<RouterEvent>,
  ) { 
    this.$history = this.history.onEvent.subscribe(this.onHistoryEvent)
  }

  public destroy() {
    this.$history.unsubscribe()
    this.$reqs.forEach(req => req.unsubscribe())
    if (this.currentContext) {
      this.currentContext.runOnLeave()
      this.currentContext.unmount()
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

  public async navigate(path: string): Promise<void> {
    if (this.isLoading) {
      return
    }
    const waitFor = this.events.first(
      event => event.type === RouterEventType.ProgressEnd
    )
    this.history.push(path)
    await waitFor
  }

  public async back() {
    if (this.isLoading) {
      return
    }
    const waitFor = this.events.first(
      event => event.type === RouterEventType.ProgressEnd
    )
    this.history.pop()
    await waitFor
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
      data = this.location.getLocation().pathname
    }
    this.events.next({
      id: this.id, 
      type, 
      data
    })
  }

  private async runHandlers(handlers: handlerFunc[], ctx: Context) {
    for (const handler of handlers) {
      if (ctx.hasCompleted) {
        break
      }
      await handler(ctx, this.state, (this as any))
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
    const location = this.location.getLocation()
    const ctx = new Context()
    ctx.redirect = (path: string) => {
      ctx.hasCompleted = true
      this.onRedirect(path)
    }
    const result = this.routeMap.findWithPathname(location.pathname)
    if (!result) {
      this.emitEvent(RouterEventType.NoHanlders)
      this.emitEvent(RouterEventType.ProgressEnd)
      this.isLoading = false
      return
    }
    const { handlers, pattern, params } = result 
    this.location.mergeContext(ctx, pattern, params)

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
    this.$reqs.push(this.onRequestUpdate(ctx, pattern))

    // Run handlers and middleware. They will skip
    // if a the res object has run 'end()'
    this.emitEvent(RouterEventType.RunningHanlders)
    await this.runHandlers(handlers, ctx)
    this.loads++
    this.isLoading = false
    this.currentContext = ctx
    this.emitEvent(RouterEventType.ProgressEnd)
  }

  private onRequestUpdate(
    ctx: Context, 
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
        ctx.runOnLeave()
        return
      }
      const location = this.location.getLocation()
      const params = url.matchPath(key, location.pathname)
      this.location.mergeContext(ctx, key, params!)
      this.emitEvent(RouterEventType.ProgressEnd, {
        path: ctx.pathname,
        note: 'Router ended after same-route update',
        route: key
      })
      this.isLoading = false
    }
    return this.history.onEvent.subscribe(onEvent)
  }
}
