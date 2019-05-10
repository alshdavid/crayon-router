import { handlerFunc, AnimationState, AnimationRoute } from './types'

export interface AnimationOptions {
    name?: string
    duration?: number
    overrideDuration?: boolean
    routes?: AnimationRoute[]
}

export const animate = (options: AnimationOptions): handlerFunc => (
    req, 
    res,
    state,
    history
) => {
    if (!state.animation) {
        state.animation = new AnimationState(
            options.name,
            options.duration,
            options.overrideDuration,
        )
    }
    if (options.routes) {
        state.animation.routes = [ 
            ...state.animation.routes, 
            ...options.routes 
        ]
    }

    const from = history[history.length - 2]
    const to = history[history.length - 1]
    let name = state.animation.name
    let duration = state.animation.duration

    for (const route of state.animation.routes as AnimationRoute[]) {
        if (route.from === '/**' && route.to === '/**') {
            if (route.name) {
                name = route.name
            }
            if (route.duration) {
                duration = route.duration
            }
        }
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


export const animation = (name: string) => ({ 
    from: (from: string) => ({
        to: (to: string) => ({ name, from, to }) 
    })
})