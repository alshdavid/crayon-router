import * as observe from '../platform/observe'
import * as url from "../platform/url"
import * as genString from "../platform/gen-string" 
import { handlerFunc } from './types'
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

    constructor(
        public sharedState: SharedState,
        public id: string,
    ) {
        sharedState.addRouter(this)
        this.history = sharedState.history
        // The load() method is only triggered based on history events
        this.$history = this.history.onEvent
            .subscribe(() => this.load())
    }

    destroy() {
        this.sharedState.removeRouter(this)
        this.$history.unsubscribe()
        this.$reqs.forEach(req => req.unsubscribe())
    }

    path(path: string, ...handlers: handlerFunc[]) {
        this.routes[path] = handlers
    }

    use(target: handlerFunc | Group) {
        if (target instanceof Group) {
            this.useGroup(target)
            this.load()
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

    // load() matches a path with patterns in the current router's routing 
    // table and executes the middleware/handlers for that route
    async load() {
        this.isLoading = true
        const req = new Request()
        const res = new Response()

        // Define redirect action
        res.redirect = (path: string) => {
            this.history.push(path)
            this.isLoading = false
            this.load()
        }

        // Find handlers for route
        let handlers: handlerFunc[] = []
        for (const key in this.routes) {
            const params = url.matchPath(key, req.pathname)
            if (!params) {
                continue
            }
            // Don't run this route if you're already on it. Consumers should 
            // rely on the history event stream to render changes
            if (url.matchPath(key, this.history.lastRoute)) {
                this.isLoading = false
                return
            }
            handlers = this.routes[key]
            req.routePattern = key
            req.params = { ...params }
            req.query = { ...url.deserializeQuery(window.location.search) }

            // Watch for update and mutate the request untill you navigate
            // elsewhere. This adds a new subscirption and removes the previous
            this.$reqs.push(this.onRequestUpdate(req, key))
            break;
        }

        // Run handlers and middleware. They will skip
        // if a the res object has run 'end()'
        await this.runHandlers(this.middleware, req, res)
        await this.runHandlers(handlers, req, res)
        this.isLoading = false
    }

    private async runHandlers(handlers: handlerFunc[], req: Request, res: Response) {
        for (const handler of handlers) {
            if (res.hasCompleted) {
                break
            }
            await handler(req, res, this.state, (this as any))
        }
    }

    private onRequestUpdate(req: Request, key: string) {
        return this.history.onEvent.subscribe(event => {
            if (url.matchPath(key, event.to) === undefined) {
                this.$reqs[0].unsubscribe()
                this.$reqs.shift()
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
