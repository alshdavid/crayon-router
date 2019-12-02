import crayon from 'crayon'
import { element } from 'crayon-kit'

export class SvelteMounter implements crayon.Mounter {
    constructor(
        public target = document.body,
        public selector = 'router-view',
        public instances: any[] = []
    ) { }

    async push(builder: any) { 
        const container = document.createElement('div')
        element.addClassNames(container, [this.selector])
        this.target.appendChild(container)
        const instance = builder(container)
        this.instances.push({
            instance,
            container
        })
    }

    async shift() {
        const { leaving } = crayon.getRouteTargets(this.selector)
        if (!leaving) {
            return
        }
        const { instance, container } = this.instances[0]
        instance.$destroy()
        this.target.removeChild(container)
        this.instances.shift()        
    }

    createBuilder(Component: any, props: Record<any, any> = {}) {
        return (target: HTMLElement) => {
            return new Component({
                target,
                props: { ...props }
            })
        }        
    }
}