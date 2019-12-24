import crayon from 'crayon'
import { AnimationOptions } from './types';
import { getAnimationState } from './state';

export const defaults = (options: AnimationOptions): crayon.handlerFunc => (
    ctx,
    state,
    app
) => {
    const animationState = getAnimationState(state)
    if (options.name !== undefined) {
        animationState.name = options.name
    }
    if (options.duration !== undefined) {
        animationState.duration = options.duration
    }
    if (options.overrideDuration !== undefined) {
        animationState.overrideDuration = options.overrideDuration
    }
    if (options.animationOnFirst !== undefined) {
        animationState.animationOnFirst = options.animationOnFirst
    }
    const historyEvent = app.history.currentEvent
    if (historyEvent === undefined) {
        return
    }
    ctx.ctx.animation = animationState.calculate(
        historyEvent.from, 
        historyEvent.to
    )
}
