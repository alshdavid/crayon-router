import crayon from 'crayon'
import { PreactMounter } from './mounter';

export const router = (
    target?: HTMLElement, 
    className?: string
): crayon.handlerFunc => (ctx, state) => {  
    if (!state.preact) {
        state.preact = {
            mounter: new PreactMounter(target, className),
        }
    }

    ctx.unmount = () => {
        return state.preact.mounter.unmount()
    }

    ctx.mount = (Component: any): Promise<any> => {
        return crayon.mount(
            Component,
            state.preact.mounter,
            ctx.ctx.animation && ctx.ctx.animation.name,
            ctx.ctx.animation && ctx.ctx.animation.duration
        )
    }
}