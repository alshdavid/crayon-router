import { handlerFunc } from '../types'
import { mount } from '../mount';
import { ReactMounter } from './mounter';

export const router = (target?: HTMLElement): handlerFunc => (req, res, state) => {   
    if (!state.react) {
        state.react = {
            mounter: new ReactMounter(target),
        }
    }

    res.mount = (Component: any): Promise<any> => {
        const animation = {
            name: res.ctx.animation && res.ctx.animation.name,
            duration: res.ctx.animation && res.ctx.animation.duration,
        }
        return mount(
            Component,
            state.react.mounter,
            animation.name,
            animation.duration
        )
    }
}