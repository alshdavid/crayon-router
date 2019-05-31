import * as observe from './platform/observe'
import * as url from "./platform/url"
import * as genString from "./platform/gen-string" 
import { handlerFunc, RouterEventType } from './types'
import { Request } from './request'
import { Response } from './response'
import { Group } from "./group"
import { History } from './history'
import { getSharedState, SharedState } from './shared-state';

export class Router {
    middleware: handlerFunc[] = []
    routes: Record<string, handlerFunc[]> = {}
    state: Record<string, any> = {}
    isLoading = true
    history: History
    $history: observe.Subscription
    $reqs: observe.Subscription[] = []

    get events() {
        return this.sharedState.events
    } 

    constructor(
        public sharedState: SharedState,
        public id: string,
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
        this.events.next({ type: RouterEventType.Destroyed, id: this.id })
    }

    path(path: string, ...handlers: handlerFunc[]) {
        this.routes[path] = handlers
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
            this.routes[path] = [
                ...group.middleware,
                ...group.routes[route]
            ]
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

    load() {
        this.events.next({ type: RouterEventType.LoadTriggered, id: this.id })
        return this.digest()
    }

    // digest() matches a path with patterns in the current router's routing 
    // table and executes the middleware/handlers for that route
    async digest() {
        this.events.next({ type: RouterEventType.ProgressStart, id: this.id })
        this.isLoading = true
        const req = new Request()
        const res = new Response()

        // Define redirect action
        res.redirect = (path: string) => {
            this.isLoading = false
            this.events.next({ type: RouterEventType.ProgressEnd, id: this.id })
            this.history.push(path)
        }

        const result = this.getPattern(req.pathname)
        if (!result) {
            this.events.next({ type: RouterEventType.NoHanlders, id: this.id })
            this.isLoading = false
            return
        }
        const { pattern, params } = result

        // Don't run this route if you're already on it. Consumers should 
        // rely on the history event stream to render changes        
        if (this.history.currentEvent) {
            // The pattern for the previous route
            const previousPattern = this.getPattern(this.history.currentEvent.from)
            if (pattern === (previousPattern && previousPattern.pattern)) {
                this.events.next({ type: RouterEventType.SameRouteAbort, id: this.id })
                this.events.next({ type: RouterEventType.ProgressEnd, id: this.id })
                this.isLoading = false
                return
            }
        }
        const handlers = this.routes[pattern]
        req.routePattern = pattern
        req.params = { ...params }
        req.query = { ...url.deserializeQuery(window.location.search) }

        // Watch for update and mutate the request untill you navigate
        // elsewhere. This adds a new subscirption and removes the previous
        this.$reqs.push(this.onRequestUpdate(req, res, pattern))

        // Run handlers and middleware. They will skip
        // if a the res object has run 'end()'
        this.events.next({ type: RouterEventType.RunningHanlders, id: this.id })
        await this.runHandlers(this.middleware, req, res)
        await this.runHandlers(handlers, req, res)
        this.isLoading = false
        this.events.next({ type: RouterEventType.ProgressEnd, id: this.id })
    }

    // getPattern takes a pathname and find the corresponding key in the
    // routing object based on some matching criteria. Competitive scenarios 
    // eg: "/items/:id" vs "/items/add", the more specific option will be chosen
    getPattern(pathname: string) {
        //
        let patterns: { key: string, params: Record<string, string>}[] = []
        for (let key in this.routes) {
            const params = url.matchPath(key, pathname)
            if (params !== undefined) {
                patterns.push({ key, params })
            }
        }
        if (patterns.length === 0) {
            return
        }

        let pattern: string | undefined
        let params: Record<string, string> | undefined
        for (let item of patterns) {
            pattern = item.key
            params = item.params
            if (item.key === pathname) {
                break
            }
        }
        if (!pattern || !params) {
            return
        }

        return {
            params,
            pattern,
            patterns
        }
    }

    private async runHandlers(handlers: handlerFunc[], req: Request, res: Response) {
        for (const handler of handlers) {
            if (res.hasCompleted) {
                break
            }
            await handler(req, res, this.state, (this as any))
        }
    }

    private onRequestUpdate(req: Request, res: Response, key: string) {
        return this.history.onEvent.subscribe(event => {
            if (url.matchPath(key, event.to) === undefined) {
                this.$reqs[0].unsubscribe()
                this.$reqs.shift()
                res.leaveAction && res.leaveAction()
                return
            }
            Object.assign(req, new Request())
            const params = url.matchPath(key, req.pathname)
            req.routePattern = key
            req.params = { ...params }
            req.query = { ...url.deserializeQuery(window.location.search) }
        })
    }
}

export const create = (
    id = genString.ofLength(10)
) => {
    const sharedState = getSharedState()
    return new Router(
        sharedState,
        id
    )
}
