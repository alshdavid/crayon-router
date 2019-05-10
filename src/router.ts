import { matchPath, deserializeQuery } from "./url";
import { Request } from './request'
import { Response } from './response'
import { handlerFunc } from './types'

export class Router {
    middleware: handlerFunc[] = []
    routes: Record<string, handlerFunc[]> = {}
    state: Record<string, any> = {}
    history: string[] = ['']
    req: Request | undefined
    res: Response | undefined
    isLoading = false

    constructor() {
        window.addEventListener('popstate', () => {
            this.load()
        })
    }

    path(path: string, ...handlers: handlerFunc[]) {
        this.routes[path] = handlers
    }

    use(handler: handlerFunc) {
        this.middleware.push(handler)
    }

    async navigate(path: string) {
        if (this.isLoading) {
            return
        }
        this.isLoading = true
        window.history.pushState(null, document.title, path)
        await this.load()
        this.isLoading = false
    }

    reload() {
        if (this.req) {
            return
        }
        return this.load()
    }

    back() {
        window.history.back()
    }

    async load() {
        this.req = new Request()
        this.res = new Response()

        this.res.redirect = (path: string) => {
            window.history.pushState(null, document.title, path)
            this.load()
        }     

        // Match and populate handlers
        let handlers: handlerFunc[] = []
        for (const key in this.routes) {
            const params = matchPath(key, this.req.pathname)
            if (!params) {
                continue
            }
            this.history.push(key)
            handlers = this.routes[key]
            this.req.params = { ...params }
            this.req.routePattern = key
            break;
        }
        if (handlers.length === 0) {
            console.error(`No handlers found for route: ${this.req.pathname}`)
        }
        // Cast query string to object
        this.req.query = { ...deserializeQuery(window.location.search) }

        // Run middleware
        for (const middleware of this.middleware) {
            if (this.res.hasCompleted) {
                return
            }
            await middleware(this.req, this.res, this.state, this.history)
        }
        // Run handlers
        for (const handler of handlers) {
            if (this.res.hasCompleted) {
                return
            }
            await handler(this.req, this.res, this.state, this.history)
        }
    }
}

export const create = () => new Router()

