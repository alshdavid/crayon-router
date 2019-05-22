import * as types from '../platform/check-types'
import * as url from '../platform/url'
import { handlerFunc } from '../router'
import { AnimationRoute, AnimationOptions } from './types';
import { getAnimationState } from './state';

export const defaults = (options: AnimationOptions): handlerFunc => (
    req,
    res,
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

    res.ctx.animation = animationState.calculate(app)
}
