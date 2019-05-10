import { handlerFunc } from "../types";
import { mount } from '../mount'
import { VueMounter } from "./mounter";

export const router = (): handlerFunc => (req, res, state) => {
    if (!state.vue) {
        state.vue = {
            mounter: new VueMounter(),
        }
    }

    res.mount = async (component: any, props?: any) => {
        const mounter = state.vue.mounter
        const instance = await mounter.createInstance(component, props)
        return mount(
            instance,
            mounter,
            res.ctx.animation.name,
            res.ctx.animation.duration
        )
    }
}

