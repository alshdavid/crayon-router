import { handlerFunc } from "../types";
import { animatedMount } from '../mount'
import { VueMounter } from "./mounter";

export const router = (): handlerFunc => (req, res, state) => {
    if (!state.vue) {
        state.vue = {
            mounter: new VueMounter(state.vue.instances),
        }
    }

    res.mount = async (component: any, props?: any) => {
        const mounter = state.vue.mounter
        const instance = await mounter.createInstance(component, props)
        return animatedMount(
            instance,
            mounter,
            res.ctx.animation.name,
            res.ctx.animation.duration
        )
    }
}

