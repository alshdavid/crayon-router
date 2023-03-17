import { url } from 'crayon-kit'
import { AnimationRoute } from "./types.js";

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

    putRoute(newRoute: AnimationRoute) {
        if (newRoute.from) {
            newRoute.from = url.normalise(newRoute.from)
        }
        if (newRoute.to) {
            newRoute.to = url.normalise(newRoute.to)
        }
        for (const i in this.routes) {
            if (
                this.routes[i].to == newRoute.to &&
                this.routes[i].from == newRoute.from
            ) {
                this.routes[i] = newRoute
                return
            }
        }
        this.routes.push(newRoute)
    }

    putRoutes(routes: AnimationRoute[]) {
        for (const route of routes) {
            this.putRoute(route)
        }
    }

    calculate(from: string, to: string) {
        let name = this.name
        let duration = this.duration
        
        for (const route of this.routes) {
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

        for (const route of this.routes) {
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

        return {
            name,
            duration
        }
    }
}

export const getAnimationState = (state: Record<string, any>): AnimationState => {
    if (!state.animation) {
        state.animation = new AnimationState()
    }
    return state.animation
}