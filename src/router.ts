import { matchPath, deserializeQuery } from "./url";

type Context = Record<string, any>

export interface Request<T = Context> extends Location {
    params: Record<any, any>
    query: Record<any, any>
    state: T
}

export interface Navigator {
    navigate: (path: string) => void
}

export interface Response<Y = Context> {
    mount: any
    redirect: (path: string) => void
    ctx?: Y
}

export type handlerFunc<T = any, Y = any> = (req: Request<T>, res: Response<Y>) => void

export class Router {
    middleware: handlerFunc[] = []
    routes: Record<string, handlerFunc[]> = {}
    state: Record<string, any> = {}
    isRouting = false

    path(path: string, ...handlers: handlerFunc[]) {
        this.routes[path] = handlers
    }

    use(handler: handlerFunc) {
        this.middleware.push(handler)
    }

    async navigate(path: string) {
        if (this.isRouting) {
            console.log('boucned')
            return
        }
        this.isRouting = true
        window.history.pushState(null, document.title, path)
        await this.load()
        this.isRouting = false
    }

    reload() {
        return this.load()
    }

    async load() {
        const req: Request = {
            ...window.location,
            params: {},
            query: {},
            state: this.state
        }
        const res: Response = {
            mount: console.log,
            redirect: (path: string) => this.navigate(path),
            ctx: {}
        }
        for (const middleware of this.middleware) {
            await middleware(req, res)
        }
        let handlers: handlerFunc[] = []
        for (const key in this.routes) {
            const params = matchPath(key, req.pathname)
            if (!params) {
                continue
            }
            handlers = this.routes[key]
            req.params = { ...params }
        }
        if (handlers.length === 0) {
            console.error(`No handler for route: ${req.pathname}`)
        }
        req.query = { ...deserializeQuery(window.location.search) }
        for (const handler of handlers) {
            await handler(req, res)
        }
    }
}

export const create = () => new Router()

