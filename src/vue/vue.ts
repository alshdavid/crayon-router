import { handlerFunc } from "../router";

// TODO refactor this file omg
const isFunction = (value: any) => typeof value === 'function'

export const Router = (selector: string, Vue: any): handlerFunc => (req, res) => {
    if (!req.state.vue) {
        const element = document.querySelector(selector)
        if (!element) {
            throw new Error('Outlet element not found')
        }
        let animationName: string = ''
        let animationMode: string = ''
        let animationChildView: string = ''
        if (res.ctx.vueAnimation) {
            animationName = res.ctx.vueAnimation.name
            animationMode = res.ctx.vueAnimation.mode
            animationChildView = res.ctx.vueAnimation.childView
        }
        req.state.vue = {
            app: new Vue({
                el: selector,
                data: {
                    current: undefined,
                    animationName,
                    animationMode,
                    animationChildView,
                    deps: {}
                },
                render(h: any) {
                    if (!this.current) {
                        return
                    }
                    if (!this.animationName) {
                        return h(this.current, {
                            props: { ...this.deps }
                        })
                    }
                    return h(
                        'transition', 
                        { props: {
                            name: this.animationName,
                            mode: this.animationMode
                        }}, 
                        [ 
                            h(this.current, {
                                props: { ...this.deps },
                                class: { [this.animationChildView || 'child-view']: true }
                            })
                        ]
                    )
                }
            })
        }
        ;(window as any).app = req.state.vue.app
    }

    res.mount = async (component: any, options?: any) => {
        if (res.ctx.vueAnimation) {
            req.state.vue.app.animationName = res.ctx.vueAnimation.name
            req.state.vue.app.animationMode = res.ctx.vueAnimation.mode
            req.state.vue.app.animationChildView = res.ctx.vueAnimation.childView
        }
        if (isFunction(component)) {
            component = await component()
        }
        await new Promise(res => {
            setTimeout(() => {
                req.state.vue.app.current = undefined
                res()
            })
        })
        Vue.component('current-page', component)
        if (options) {
            req.state.vue.app.deps = { ...options }
        }
        req.state.vue.app.current = 'current-page'
    }
}