import Vue, { VueConstructor } from 'vue';
import { mountable, getOutlets } from '../mount'

const isFunction = (value: any) => typeof value === 'function'

export class VueMounter implements mountable {
    constructor(
        public target = document.body,
        public selector = 'router-view',
        public instances: any[] = []
    ){}

    async push(instance: any) { 
        const incoming = document.createElement('div')
        incoming.classList.add(this.selector)
        instance.$mount()
        incoming.appendChild(instance.$el)
        this.instances.push({instance})
        this.target.appendChild(incoming)
    }

    async pop() {
        const { leaving } = getOutlets(this.selector)
        if (!leaving) {
            return
        }
        this.instances[0].instance.$destroy()
        this.instances.shift()
        leaving.innerHTML = ''
        this.target.removeChild(leaving)
        return
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