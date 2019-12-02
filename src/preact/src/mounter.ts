import { render, h } from 'preact';
import { Mounter, getRouteTargets } from 'crayon';
import { element } from 'crayon-kit'

export class PreactMounter implements Mounter {
    constructor(
        public target = document.body,
        public selector = 'router-view'
    ) {}

    async unmount() {
        for (let i = 0; i < this.target.children.length; i++) {
            render(null, this.target.children[i])
            this.target.removeChild(this.target.children[i])
        }
    }

    async push(C: any) { 
        const incoming = document.createElement('div')
        element.addClassNames(incoming, [this.selector])
        render(
            (h as any)(C), 
            incoming
        )
        this.target.appendChild(incoming)
    }

    async shift() {
        const { leaving } = getRouteTargets(this.selector)
        if (!leaving) {
            return
        }
        render(null, leaving)
        element.waitForElements(leaving)
        this.target.removeChild(leaving)
    }
}