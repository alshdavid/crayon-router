import crayon from 'crayon';
import { SvelteMounter } from './mounter';

export const router = (target?: HTMLElement): crayon.handlerFunc => (ctx, state) => {   
    if (!state.svelte) {
        state.svelte = {
            mounter: new SvelteMounter(target),
        }
    }

    ctx.mount = (component: any, props: Record<any, any>): Promise<any> => {
        const { createBuilder } = (state.svelte.mounter as SvelteMounter)
        const instance = createBuilder(component, props) 
        return crayon.mount(
            instance,
            state.svelte.mounter,
            ctx.ctx.animation && ctx.ctx.animation.name,
            ctx.ctx.animation && ctx.ctx.animation.duration
        )
    }
}