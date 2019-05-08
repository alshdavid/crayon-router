import { handlerFunc } from "./router";

// TODO refactor this file omg
const isFunction = (value: any) => typeof value === 'function'

export const VueAnimate = ({ name, mode }: { name: string, mode?: string }): handlerFunc => (req, res) => {
    res.ctx.vueAnimation = {
        name,
        mode
    }
}

export const VueRouter = (selector: string, Vue: any): handlerFunc => (req, res) => {
    if (!req.state.vue) {
        const element = document.querySelector(selector)
        if (!element) {
            throw new Error('Outlet element not found')
        }
        let animationName
        let animationMode
        if (res.ctx.vueAnimation) {
            animationName = res.ctx.vueAnimation.name
            animationMode = res.ctx.vueAnimation.mode
        }
        req.state.vue = {
            app: new Vue({
                el: selector,
                data: {
                    current: undefined,
                    animationName,
                    animationMode
                },
                render(h: any) {
                    if (!this.animationName) {
                        return h(this.current, {})
                    }
                    return h(
                        'transition', { props: {
                            name: this.animationName,
                            mode: this.animationMode
                        }}, 
                        [ h(this.current) ])
                }
            })
        }
    }

    res.mount = async (component: any) => {
        if (isFunction(component)) {
            component = await component()
        }
        req.state.vue.app.current = ''
        Vue.component('current-page', component)
        req.state.vue.app.current = 'current-page'
        if (res.ctx.vueAnimation) {
            req.state.vue.app.animationName = res.ctx.vueAnimation.name
            req.state.vue.app.animationMode = res.ctx.vueAnimation.mode
        }
    }
}