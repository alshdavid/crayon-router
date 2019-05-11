import Vue, { VueConstructor } from 'vue';
import { mountable, outletSelector, getOutlets } from '../mount'
import { CombinedVueInstance } from 'vue/types/vue';

const isFunction = (value: any) => typeof value === 'function'

export class VueMounter implements mountable {
    constructor(
        public target = document.body,
        public instances: any[] = []
    ){}

    push(instance: CombinedVueInstance<any,any,any,any,any>) { 
        const incoming = document.createElement('div')
        incoming.classList.add(outletSelector)
        instance.$mount()
        incoming.appendChild(instance.$el)
        this.instances.push({instance})
        return {
            commit: () => this.target.appendChild(incoming), 
            el: incoming
        }
    }

    pop() {
        const { leaving } = getOutlets(outletSelector)
        if (!leaving) {
            return
        }
        this.instances[0].instance.$destroy()
        this.instances.shift()
        leaving.innerHTML = ''
        this.target.removeChild(leaving)
    }

    async createInstance(component: any, props?: any) {
        if (isFunction(component)) {
            component = await component()
        }
        const Component: VueConstructor = Vue.extend(component)
        const instance = new Component()
        for (const key in props) {
            instance.$props[key] = props[key]
        }
        return instance
    }
}