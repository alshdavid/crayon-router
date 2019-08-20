import * as url from "~/platform/url"
import { handlerFunc, RouterEventType } from '~/types'
import { Request } from '~/request'
import { Response } from '~/response'
import { Locator } from '~/locator'
import { Group } from "~/group"
import { History } from '~/history'
import { SharedState } from '~/shared-state';
import { RouteMap } from './route-map';
import { Beacon, Subscription } from '~/platform/beacon';

export class Router {
  middleware: handlerFunc[] = []
  state: Record<string, any> = {}
  isLoading = true
  history: History
  $history: Subscription
  $reqs: Subscription[] = []
  loads = 0
  onLeave = () => { }
  currentRes: Response | undefined
  currentReq: Request | undefined


  get events() {
    return this.sharedState.events
  }

  constructor(
    public id: string,
    public locator: Locator,
    public routeMap: RouteMap,
    public sharedState: SharedState,
  ) {
    sharedState.addRouter(this)
    this.history = sharedState.history
    this.$history = this.history.onEvent
      .subscribe(event => {
        this.events.next({
          type: RouterEventType.History,
          id: this.id,
          data: { ...event }
        })
        this.digest()
      })
  }

  destroy() {
    this.sharedState.removeRouter(this)
    this.$history.unsubscribe()
    this.$reqs.forEach(req => req.unsubscribe())
    if (this.currentRes) {
      this.currentRes.runOnLeave()
      this.currentRes.unmount()
    }

    // this.runOnLeave()
    this.events.next({ type: RouterEventType.Destroyed, id: this.id, data: this.locator.getLocation().pathname })
  }

  path(path: string, ...handlers: handlerFunc[]): void {
    this.routeMap.add(path, ...handlers)
  }

  use(target: handlerFunc | Group) {
    if (target instanceof Group) {
      this.useGroup(target)
    } else {
      this.useHandler(target)
    }
  }

  useGroup(group: Group) {
    for (const route in group.routes) {
      const path = url.normalise(group.base + route)
      const handlers = [
        ...group.middleware,
        ...group.routes[route]
      ]
      this.routeMap.add(path, ...handlers)
    }
  }

  useHandler(handler: handlerFunc) {
    this.middleware.push(handler)
  }

  async navigate(path: string) {
    if (this.isLoading) {
      return
    }
    this.history.push(path)
  }

  async back() {
    if (this.isLoading) {
      return
    }
    this.history.pop()
  }

  runOnLeave() {
    if (!this.currentRes) {
      return
    }
    this.currentRes.runOnLeave()
    this.currentRes = undefined
  }

  load() {
    this.events.next({ type: RouterEventType.LoadTriggered, id: this.id, data: this.locator.getLocation().pathname })
    return this.digest()
  }

  emitEvent(type: RouterEventType, data?: any) {
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

  // digest() matches a path with patterns in the current router's routing 
  // table and executes the middleware/handlers for that route
  async digest() {
    this.emitEvent(RouterEventType.ProgressStart)
    this.isLoading = true
    const location = this.locator.getLocation()
    const res = new Response()

    // Define redirect action
    res.redirect = (path: string) => {
      this.isLoading = false
      this.emitEvent(RouterEventType.ProgressEnd, {
        path: location.pathname,
        note: 'redirected page'
      })
      this.history.push(path)
    }

    const result = this.routeMap.findWithPathname(location.pathname)
    if (!result) {
      this.emitEvent(RouterEventType.NoHanlders)
      this.emitEvent(RouterEventType.ProgressEnd, {
        path: location.pathname,
        note: 'No handlers found for current path',
      })
      this.isLoading = false
      return
    }
    const { handlers, pattern, params } = result 
    const req = this.locator.generateRequest(pattern, params)

    // Don't run this route if you're already on it. Consumers should 
    // rely on the history event stream to render changes        
    if (this.history.currentEvent && this.loads !== 0) {
      // The pattern for the previous route
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

    await this.runHandlers(this.middleware, req, res)
    await this.runHandlers(handlers, req, res)
    this.loads++
    this.isLoading = false

    this.currentRes = res
    this.emitEvent(RouterEventType.ProgressEnd, {
      path: location.pathname,
      note: 'handlers have completed running',
      route: pattern
    })
  }



  private onRequestUpdate(req: Request, res: Response, key: string): Subscription {
    return this.history.onEvent.subscribe(event => {
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
      this.events.next({
        type: RouterEventType.ProgressEnd,
        id: this.id,
        data: {
          path: newRequest.pathname,
          note: 'Router ended after same-route update',
          route: key
        }
      })
      this.isLoading = false
    })
  }
}


