import crayon from "crayon";
import { VueMounter } from "./mounter";

export const router = (target?: HTMLElement): crayon.handlerFunc => (ctx, state) => {
    if (!state.vue) {
        state.vue = {
            mounter: new VueMounter(target),
        }
    }

    ctx.mount = async (component: any, props?: any) => {
        const { createInstance } = state.vue.mounter
        const instance = await createInstance(component, props)
        return crayon.mount(
            instance,
            state.vue.mounter,
            ctx.ctx.animation && ctx.ctx.animation.name,
            ctx.ctx.animation && ctx.ctx.animation.duration
        )
    }
}

