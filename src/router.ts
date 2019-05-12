import * as url from "./url";
import { Request } from './request'
import { Response } from './response'
import { handlerFunc } from './types'
import { Group } from "./group";
import { Subject } from "rxjs";

export class Router {
    middleware: handlerFunc[] = []
    routes: Record<string, handlerFunc[]> = {}
    state: Record<string, any> = {}
    history: string[] = ['']
    req: Request | undefined
    res: Response | undefined
    isLoading = true
    
    get events(): Subject<any> {
        const state = (window as any).crayon
        return state.events 
    }

    onPopState = () => this.load()

    constructor() {
        window.addEventListener('popstate', this.onPopState)
    }

    destroy() {
        window.removeEventListener('popstate', this.onPopState)
    }

    path(path: string, ...handlers: handlerFunc[]) {
        this.routes[path] = handlers
        // this.load()
    }

    use(target: handlerFunc | Group) {
        if (target instanceof Group) {
            this.useGroup(target)
        } else {
            this.useHandler(target)
        }
        // this.load()
    }

    useGroup(group: Group) {
        const routes: Record<string, handlerFunc[]> = {}
        for (const route in group.routes) {
            const path = group.base + route
            routes[path] = [ 
                ...group.middleware, 
                ...group.routes[route] 
            ]
        }
        this.routes = {
            ...routes,
            ...this.routes
        }
    }

    useHandler(handler: handlerFunc) {
        this.middleware.push(handler)
    }

    // TODO block navigation if already on destination
    async navigate(path: string) {
        if (this.isLoading) {
            return
        }
        path = url.normalise(path)
        window.history.pushState(null, document.title, path)
        await this.load()
    }

    reload() {
        if (this.req) {
            return
        }
        return this.load()
    }

    // TODO figure out how to not kill the router
    // is back is press while inside a transition
    back() {
        if (this.isLoading) {
            return
        }
        window.history.back()
    }

    emit(value: any) {
        const state = (window as any).crayon
        if (!state) {
            return
        }
        state.events.next(value)
    }

    async load() {
        this.isLoading = true
        this.req = new Request()
        this.res = new Response()
        this.emit({ name: 'ROUTING_START', ctx: { ...this.req} })

        const path = url.normalise(this.req.pathname)
        if (path !== this.req.pathname) {
            window.history.replaceState(null, document.title, path)
        }

        this.res.redirect = (path: string) => {
            path = url.normalise(path)
            window.history.pushState(null, document.title, path)
            this.isLoading = false
            this.load()
        }     
    
        // TODO match "/**" and "/something/**" routes

        // Match and populate handlers
        let handlers: handlerFunc[] = []
        for (const key in this.routes) {
            const params = url.matchPath(key, this.req.pathname)
            if (!params) {
                continue
            }
            this.history.push(key)
            handlers = this.routes[key]
            this.req.params = { ...params }
            this.req.routePattern = url.normalise(key)
            break;
        }
        // Cast query string to object
        this.req.query = { ...url.deserializeQuery(window.location.search) }

        // Run middleware
        for (const middleware of this.middleware) {
            if (this.res.hasCompleted) {
                return
            }
            await middleware(this.req, this.res, this.state, (this as any))
        }
        // Run handlers
        for (const handler of handlers) {
            if (this.res.hasCompleted) {
                return
            }
            await handler(this.req, this.res, this.state, (this as any))
        }
        this.isLoading = false
        this.emit({ name: 'ROUTING_COMPLETE', ctx: { ...this.req} })
    }
}

export const create = () => {
    if (!(window as any).crayon) {
        ;(window as any).crayon = {
            events: new Subject()
        }
    }
    return new Router()
}

