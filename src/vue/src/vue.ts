import { handlerFunc } from "crayon";
import { mount } from 'crayon/platform/mount'
import { VueMounter } from "./mounter";

export const router = (target?: HTMLElement): handlerFunc => (req, res, state) => {
    if (!state.vue) {
        state.vue = {
            mounter: new VueMounter(target),
        }
    }

    res.mount = async (component: any, props?: any) => {
        const { createInstance } = state.vue.mounter
        const instance = await createInstance(component, props)
        return mount(
            instance,
            state.vue.mounter,
            res.ctx.animation && res.ctx.animation.name,
            res.ctx.animation && res.ctx.animation.duration
        )
    }
}

