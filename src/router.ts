import * as observe from './observe'
import * as url from "./url";
import { Request } from './request'
import { Response } from './response'
import { handlerFunc } from './types'
import { Group } from "./group";

export interface Router {
    middleware: handlerFunc[]
    routes: Record<string, handlerFunc[]>
    state: Record<string, any>
    history: string[]
    isLoading: boolean
    path: (path: string, ...handlers: handlerFunc[]) => void
    use: (target: handlerFunc | Group) => void
    navigate: (path: string) => Promise<void>
    reload: () => Promise<void>
    back: () => Promise<void>
    load: () => Promise<void>
    destroy: () => void
}

export const create = (): Router => {
    if (!(window as any).crayon) {
        ;(window as any).crayon = {
            events: observe.createSubject()
        }
    }

    const state = {
        middleware: <handlerFunc[]>[],
        routes: <Record<string, handlerFunc[]>>{},
        state: <Record<string, any>>{},
        history: <string[]>[''],
        isLoading: true
    }

    const path = (path: string, ...handlers: handlerFunc[]) =>
        state.routes[path] = handlers

    const use = (target: handlerFunc | Group) => {
        if (target instanceof Group) {
            useGroup(target)
        } else {
            useHandler(target)
        }
    }

    const useGroup = (group: Group) => {
        const routes: Record<string, handlerFunc[]> = {}
        for (const route in group.routes) {
            const path = group.base + route
            routes[path] = [
                ...group.middleware,
                ...group.routes[route]
            ]
        }
        state.routes = {
            ...routes,
            ...state.routes
        }
    }

    const useHandler = (handler: handlerFunc) =>
        state.middleware.push(handler)

    const navigate = async (path: string) => {
        if (state.isLoading) {
            return
        }
        path = url.normalise(path)
        window.history.pushState(null, document.title, path)
        await load()
    }

    const reload = async () => {
        if (state.isLoading) {
            return
        }
        return load()
    }

    const back = async () => {
        if (state.isLoading) {
            return
        }
        window.history.back()
    }

    const emit = (value: any) => {
        const state = (window as any).crayon
        if (!state) {
            return
        }
        state.events.next(value)
    }

    const load = async () => {
        state.isLoading = true
        const req = new Request()
        const res = new Response()
        emit({ name: 'ROUTING_START', ctx: { ...req} })

        const path = url.normalise(req.pathname)
        if (path !== req.pathname) {
            window.history.replaceState(null, document.title, path)
        }

        res.redirect = (path: string) => {
            path = url.normalise(path)
            window.history.pushState(null, document.title, path)
            state.isLoading = false
            load()
        }

        // Match and populate handlers
        let handlers: handlerFunc[] = []
        for (const key in state.routes) {
            const params = url.matchPath(key, req.pathname)
            if (!params) {
                continue
            }
            state.history.push(key)
            handlers = state.routes[key]
            req.params = { ...params }
            req.routePattern = url.normalise(key)
            break;
        }
        // Cast query string to object
        req.query = { ...url.deserializeQuery(window.location.search) }

        // Run middleware
        for (const middleware of state.middleware) {
            if (res.hasCompleted) {
                return
            }
            await middleware(req, res, state.state, (state as any))
        }
        // Run handlers
        for (const handler of handlers) {
            if (res.hasCompleted) {
                return
            }
            await handler(req, res, state.state, (state as any))
        }
        state.isLoading = false
        emit({ name: 'ROUTING_COMPLETE', ctx: { ...req} })
    }

    window.addEventListener('popstate', load)

    const destroy = () => window.removeEventListener('popstate', load)

    return {
        ...state,
        path,
        use,
        navigate,
        reload,
        back,
        load,
        destroy
    }
}

