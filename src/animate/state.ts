import { AnimationRoute } from "./types";

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