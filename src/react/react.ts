import { handlerFunc } from '../router/types'
import { mount } from '../platform/mount';
import { ReactMounter } from './mounter';

export const router = (target?: HTMLElement, className?: string): handlerFunc => (req, res, state) => {  
    if (!state.react) {
        state.react = {
            mounter: new ReactMounter(target, className),
        }
    }

    res.mount = (Component: any): Promise<any> => {
        return mount(
            Component,
            state.react.mounter,
            res.ctx.animation && res.ctx.animation.name,
            res.ctx.animation && res.ctx.animation.duration
        )
    }
}