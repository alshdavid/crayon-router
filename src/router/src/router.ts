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
    loads = 0
    window: Window
    onLeave = () => {}
    currentRes: Response | undefined
    currentReq: Request | undefined


    get events() {
        return this.sharedState.events
    } 

    constructor(
        public sharedState: SharedState,
        public id: string,
        browserWindow: Window = window
    ) {
        this.window = browserWindow
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
        this.events.next({ type: RouterEventType.Destroyed, id: this.id, data: this.window.location.pathname })
    }

    path(path: string, ...handlers: handlerFunc[]) {
        this.routes[url.normalise(path)] = handlers
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

    runOnLeave() {
        if (!this.currentRes) {
            return
        }
        this.currentRes.runOnLeave()
        this.currentRes = undefined
    }

    load() {
        this.events.next({ type: RouterEventType.LoadTriggered, id: this.id, data: this.window.location.pathname })
        return this.digest()
    }

    // digest() matches a path with patterns in the current router's routing 
    // table and executes the middleware/handlers for that route
    async digest() {
        this.events.next({ type: RouterEventType.ProgressStart, id: this.id, data: this.window.location.pathname })
        this.isLoading = true
        const req = new Request(this.window)
        const res = new Response()

        // Define redirect action
        res.redirect = (path: string) => {
            this.isLoading = false
            this.events.next({ 
                type: RouterEventType.ProgressEnd, 
                id: this.id,
                data: {
                    path: this.window.location.pathname,
                    note: 'redirected page'
                }
            })
            this.history.push(path)
        }

        const result = this.getPattern(url.normalise(req.pathname))
        if (!result) {
            this.events.next({ type: RouterEventType.NoHanlders, id: this.id, data: this.window.location.pathname })
            this.events.next({ 
                type: RouterEventType.ProgressEnd, 
                id: this.id, 
                data: {
                    path: this.window.location.pathname,
                    note: 'No handlers found for current path',
                }
            })
            this.isLoading = false
            return
        }
        const { pattern, params } = result

        // Don't run this route if you're already on it. Consumers should 
        // rely on the history event stream to render changes        
        if (this.history.currentEvent && this.loads !== 0) {
            // The pattern for the previous route
            const previousPattern = this.getPattern(this.history.currentEvent.from)
            if (pattern === (previousPattern && previousPattern.pattern)) {
                this.events.next({ 
                    type: RouterEventType.SameRouteAbort, 
                    id: this.id, 
                    data: this.window.location.pathname 
                })
                return
            }
        }
        const handlers = this.routes[pattern]
        req.routePattern = pattern
        req.params = { ...params }
        req.query = { ...url.deserializeQuery(this.window.location.search) }
        // Watch for update and mutate the request untill you navigate
        // elsewhere. This adds a new subscirption and removes the previous
        this.$reqs.push(this.onRequestUpdate(req, res, pattern))

        // Run handlers and middleware. They will skip
        // if a the res object has run 'end()'
        this.events.next({ 
            type: RouterEventType.RunningHanlders, 
            id: this.id, 
            data: this.window.location.pathname 
        })
        await this.runHandlers(this.middleware, req, res)
        await this.runHandlers(handlers, req, res)
        this.loads++
        this.isLoading = false

        this.currentRes = res
        this.events.next({ 
            type: RouterEventType.ProgressEnd, 
            id: this.id, 
            data: {
                path: this.window.location.pathname,
                note: 'handlers have completed running',
                route: pattern
            }
        })
    }

    // getPattern takes a pathname and find the corresponding key in the
    // routing object based on some matching criteria. Competitive scenarios 
    // eg: "/items/:id" vs "/items/add" vs "/**", the more specific option will be chosen
    getPattern(pathname: string) {
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

        const wildcard = patterns.filter(p => p.key.includes('**'))
        const noWildcardPatterns = patterns.filter(p => !p.key.includes('**'))

        let pattern: string | undefined
        let params: Record<string, string> | undefined
        for (let item of noWildcardPatterns) {
            pattern = item.key
            params = item.params
            if (item.key === pathname) {
                break
            }
        }
        if (!pattern || !params && wildcard.length) {
            return {
                params: wildcard[0].params,
                pattern: wildcard[0].key,
                patterns
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
            const currentPattern = this.getPattern(event.to)
            const previousPattern = this.getPattern(event.from)
            if (
                (currentPattern && currentPattern.pattern) !== 
                (previousPattern && previousPattern.pattern)
            ) {
                this.$reqs[0].unsubscribe()
                this.$reqs.shift()
                res.runOnLeave()
                return
            }
            Object.assign(req, new Request(this.window))
            const params = url.matchPath(key, req.pathname)
            req.routePattern = key
            req.params = { ...params }
            req.query = { ...url.deserializeQuery(this.window.location.search) }
            this.events.next({ 
                type: RouterEventType.ProgressEnd, 
                id: this.id,
                data: {
                    path: this.window.location.pathname,
                    note: 'Router ended after same-route update',
                    route: key
                }
            })
            this.isLoading = false
        })
    }
}

export const create = (
    id = genString.ofLength(10),
    win: Window = window,
    doc: Document = document
) => {
    const sharedState = getSharedState(win, doc)
    return new Router(
        sharedState,
        id,
        win
    )
}
