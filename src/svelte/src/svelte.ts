import crayon from 'crayon';
import { SvelteMounter } from './mounter';

export const router = (target?: HTMLElement): crayon.handlerFunc => (req, res, state) => {   
    if (!state.svelte) {
        state.svelte = {
            mounter: new SvelteMounter(target),
        }
    }

    res.mount = (component: any, props: Record<any, any>): Promise<any> => {
        const { createBuilder } = (state.svelte.mounter as SvelteMounter)
        const instance = createBuilder(component, props) 
        return crayon.mount(
            instance,
            state.svelte.mounter,
            res.ctx.animation && res.ctx.animation.name,
            res.ctx.animation && res.ctx.animation.duration
        )
    }
}