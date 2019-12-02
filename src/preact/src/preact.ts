import crayon from 'crayon'
import { PreactMounter } from './mounter';

export const router = (
    target?: HTMLElement, 
    className?: string
): crayon.handlerFunc => (req, res, state) => {  
    if (!state.preact) {
        state.preact = {
            mounter: new PreactMounter(target, className),
        }
    }

    res.unmount = () => {
        return state.preact.mounter.unmount()
    }

    res.mount = (Component: any): Promise<any> => {
        return crayon.mount(
            Component,
            state.preact.mounter,
            res.ctx.animation && res.ctx.animation.name,
            res.ctx.animation && res.ctx.animation.duration
        )
    }
}