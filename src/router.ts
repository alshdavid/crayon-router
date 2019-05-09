import { matchPath, deserializeQuery } from "./url";
import { Request } from './request'
import { Response } from './response'
import { handlerFunc } from './types'

export class Router {
    middleware: handlerFunc[] = []
    routes: Record<string, handlerFunc[]> = {}
    state: Record<string, any> = {}
    req: Request | undefined
    res: Response | undefined

    path(path: string, ...handlers: handlerFunc[]) {
        this.routes[path] = handlers
    }

    use(handler: handlerFunc) {
        this.middleware.push(handler)
    }

    navigate(path: string) {
        window.history.pushState(null, document.title, path)
        return this.load()
    }

    reload() {
        return this.load()
    }

    async load() {
        if (this.req) {
            return
        }
        this.req = new Request()
        this.res = new Response()
        this.res.redirect = (path: string) => {
            this.req = undefined
            this.navigate(path)
        }
        const cleanup = () => {
            this.res && this.res.unmount()
            this.req = undefined
            this.res = undefined
        }

        // Run middleware
        for (const middleware of this.middleware) {
            if (this.res.hasCompleted) {
                cleanup()
                return
            }
            await middleware(this.req, this.res, this.state)
        }

        // Match and populate handlers
        let handlers: handlerFunc[] = []
        for (const key in this.routes) {
            const params = matchPath(key, this.req.pathname)
            if (!params) {
                continue
            }
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

        // Run handlers
        for (const handler of handlers) {
            if (this.res.hasCompleted) {
                cleanup()
                return
            }
            await handler(this.req, this.res, this.state)
        }

        cleanup()
    }
}

export const create = () => new Router()

