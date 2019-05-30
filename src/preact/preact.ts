import { handlerFunc } from '../router'
import { mount } from '../platform/mount';
import { PeactMounter } from './mounter';

export const router = (target?: HTMLElement, className?: string): handlerFunc => (req, res, state) => {  
    if (!state.react) {
        state.react = {
            mounter: new PeactMounter(target, className),
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