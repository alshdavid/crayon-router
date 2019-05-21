import * as types from '../platform/check-types'
import * as url from '../platform/url'
import { handlerFunc } from '../router'

export class AnimationRoute {
    from?: string = ''
    to?: string = ''
    name?: string
    duration?: number
}

export class AnimationState {
    routes: AnimationRoute[] = []

    constructor(
        public name = 'no-animation',
        public duration = 0,
        public overrideDuration = false,
        public animationOnFirst = true
    ) {
        if (name === '') {
            throw new Error('Invalid animation name')
        }
    }
}

export interface AnimationOptions {
    name?: string
    duration?: number
    overrideDuration?: boolean
    animationOnFirst? : boolean,
    routes?: AnimationRoute[]
}

export const animate = (options: AnimationOptions | AnimationRoute[]): handlerFunc => (
    req,
    res,
    state,
    app
) => {
    if (!state.animation) {
        state.animation = new AnimationState()
        ;(window as any).animations = state.animation
    }
    if (!types.isArray(options)) {
        if (options.name !== undefined) {
            state.animation.name = options.name
        }
        if (options.duration !== undefined) {
            state.animation.duration = options.duration
        }
        if (options.overrideDuration !== undefined) {
            state.animation.overrideDuration = options.overrideDuration
        }
        if (options.animationOnFirst !== undefined) {
            state.animation.animationOnFirst = options.animationOnFirst
        }
        if (options.routes !== undefined) {
            state.animation.routes = putRoutes(
                state.animation.routes,
                options.routes
            )
        }
    } else {
        for (const route of options) {
            if (!route.from) {
                route.from = req.routePattern
            }
            if (!route.to) {
                route.to = req.routePattern
            }
        }
        state.animation.routes = putRoutes(
            state.animation.routes,
            options
        )
    }

    const from = ''// url.normalise(app.history[app.history.length - 2])
    const to = ''//url.normalise(app.history[app.history.length - 1])
    let name = state.animation.name
    let duration = state.animation.duration

    for (const route of state.animation.routes as AnimationRoute[]) {
        const routeFrom = route.from
        const routeTo = route.to

        if (routeFrom === '/**' && routeTo === '/**') {
            if (route.name) {
                name = route.name
            }
            if (route.duration) {
                duration = route.duration
            }
        }
        if (routeFrom === '/**' && routeTo === to) {
            if (route.name) {
                name = route.name
            }
            if (route.duration) {
                duration = route.duration
            }
        }
        if (routeTo === '/**' && routeFrom === from) {
            if (route.name) {
                name = route.name
            }
            if (route.duration) {
                duration = route.duration
            }
        }
    }

    for (const route of state.animation.routes as AnimationRoute[]) {
        const routeFrom = route.from
        const routeTo = route.to

        if (routeFrom === from && routeTo === to) {
            if (route.name) {
                name = route.name
            }
            if (route.duration) {
                duration = route.duration
            }
        }
    }

    res.ctx.animation = {
        name,
        duration
    }
}


export const animation = (name: string) => ({
    from: (from: string) => ({
        to: (to: string) => ({ name, from, to })
    })
})

export const findRoute = (
    routes: AnimationRoute[],
    newRoute: AnimationRoute
) => {
    for (const route of routes) {
        if (
            route.to == newRoute.to &&
            route.from == newRoute.from
        ) {
            return true
        }
    }
    return false
}

export const updateRoute = (
    routes: AnimationRoute[],
    newRoute: AnimationRoute
) => {
    const newRoutes = []
    for (const route of routes) {
        if (
            route.to == newRoute.to &&
            route.from == newRoute.from
        ) {
            newRoutes.push(newRoute)
            continue
        }
        newRoutes.push(route)
    }
    return newRoutes
}

export const putRoute = (
    routes: AnimationRoute[],
    newRoute: AnimationRoute
) => {
    newRoute.from = url.normalise(newRoute.from)
    newRoute.to = url.normalise(newRoute.to)
    const newRoutes = [...routes]
    const hasRoute = findRoute(newRoutes, newRoute)
    if (!hasRoute) {
        newRoutes.push(newRoute)
        return newRoutes
    }
    return updateRoute(routes, newRoute)
}

export const putRoutes = (
    routes: AnimationRoute[],
    incoming: AnimationRoute[]
) => {
    let newRoutes: AnimationRoute[] = [...routes]
    for (const route of incoming) {
        newRoutes = putRoute(newRoutes, route)
    }
    return newRoutes
}