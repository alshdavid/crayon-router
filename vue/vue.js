"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// TODO refactor this file omg
const isFunction = (value) => typeof value === 'function';
exports.Router = (selector, Vue) => (req, res) => {
    if (!req.state.vue) {
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error('Outlet element not found');
        }
        let animationName = '';
        let animationMode = '';
        let animationChildView = '';
        if (res.ctx.vueAnimation) {
            animationName = res.ctx.vueAnimation.name;
            animationMode = res.ctx.vueAnimation.mode;
            animationChildView = res.ctx.vueAnimation.childView;
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
                render(h) {
                    if (!this.current) {
                        return;
                    }
                    if (!this.animationName) {
                        return h(this.current, {
                            props: Object.assign({}, this.deps)
                        });
                    }
                    return h('transition', { props: {
                            name: this.animationName,
                            mode: this.animationMode
                        } }, [
                        h(this.current, {
                            props: Object.assign({}, this.deps),
                            class: { [this.animationChildView || 'child-view']: true }
                        })
                    ]);
                }
            })
        };
        window.app = req.state.vue.app;
    }
    res.mount = (component, options) => __awaiter(this, void 0, void 0, function* () {
        if (res.ctx.vueAnimation) {
            req.state.vue.app.animationName = res.ctx.vueAnimation.name;
            req.state.vue.app.animationMode = res.ctx.vueAnimation.mode;
            req.state.vue.app.animationChildView = res.ctx.vueAnimation.childView;
        }
        if (isFunction(component)) {
            component = yield component();
        }
        yield new Promise(res => {
            setTimeout(() => {
                req.state.vue.app.current = undefined;
                res();
            });
        });
        Vue.component('current-page', component);
        if (options) {
            req.state.vue.app.deps = Object.assign({}, options);
        }
        req.state.vue.app.current = 'current-page';
    });
};
//# sourceMappingURL=vue.js.map