import crayon from "crayon";
import { AnimationRoute } from "./types.js";
import { getAnimationState } from "./state.js";

export const routes = (
    routes:  AnimationRoute[]
): crayon.handlerFunc => (
    ctx, state, app
) => {
    const animationState = getAnimationState(state)
    for (const route of routes) {
        if (!route.from) {
            route.from = ctx.routePattern
        }
        if (!route.to) {
            route.to = ctx.routePattern
        }
    }
    animationState.putRoutes(routes)    
    const historyEvent = app.history.currentEvent
    if (historyEvent === undefined) {
        return
    }
    ctx.ctx.animation = animationState.calculate(
        historyEvent.from, 
        historyEvent.to
    )
}