import { handlerFunc } from '../types'
import { Animation, AnimationRoute } from './animation';

interface AnimationOptions {
    name: string
    duration?: number
    routes?: AnimationRoute[]
}

export const Animate = (options: AnimationOptions): handlerFunc => (
    req, 
    res,
    state,
    history
) => {
    state.animation = new Animation(
        options.name,
        options.duration,
        options.routes
    )

    const from = history[history.length - 2]
    const to = history[history.length - 1]
    let name = state.animation.name
    let duration = state.animation.duration

    for (const route of state.animation.routes as AnimationRoute[]) {
        if (route.from === '/**' && route.to === to) {
            if (route.name) {
                name = route.name
            }
            if (route.duration) {
                duration = route.duration
            }
        }
        if (route.to === '/**' && route.from === from) {
            if (route.name) {
                name = route.name
            }
            if (route.duration) {
                duration = route.duration
            }
        }
    }

    for (const route of state.animation.routes as AnimationRoute[]) {
        if (route.from === from && route.to === to) {
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
    console.log(res.ctx.animation)
}
