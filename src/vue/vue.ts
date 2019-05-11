import { handlerFunc } from "../types";
import { mount } from '../mount'
import { VueMounter } from "./mounter";

export const router = (target?: HTMLElement): handlerFunc => (req, res, state) => {
    if (!state.vue) {
        state.vue = {
            mounter: new VueMounter(target),
        }
    }

    res.mount = async (component: any, props?: any) => {
        const animation = {
            name: res.ctx.animation && res.ctx.animation.name,
            duration: res.ctx.animation && res.ctx.animation.duration,
        }
        const mounter = state.vue.mounter
        const instance = await mounter.createInstance(component, props)
        return mount(
            instance,
            mounter,
            animation.name,
            animation.duration
        )
    }
}

