import { handlerFunc } from "crayon";
import { AnimationRoute } from "./types";
import { getAnimationState } from "./state";

export const routes = (
    routes:  AnimationRoute[]
): handlerFunc => (
    req, res, state, app
) => {
    const animationState = getAnimationState(state)
    for (const route of routes) {
        if (!route.from) {
            route.from = req.routePattern
        }
        if (!route.to) {
            route.to = req.routePattern
        }
    }
    animationState.putRoutes(routes)    
    const { from, to } = app.history.currentEvent
    res.ctx.animation = animationState.calculate(from, to)
}