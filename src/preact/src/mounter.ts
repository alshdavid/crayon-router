import { render, h } from 'preact';
import { mountable, getOutlets, addClass } from 'crayon/platform/mount';

export class PeactMounter implements mountable {
    constructor(
        public target = document.body,
        public selector = 'router-view'
    ) {}

    async push(C: any) { 
        const incoming = document.createElement('div')
        addClass(incoming, this.selector)
        render(
            (h as any)(C), 
            incoming
        )
        this.target.appendChild(incoming)
    }

    async pop() {
        const { leaving } = getOutlets(this.selector)
        if (!leaving) {
            return
        }
        render(
            null, 
            leaving
        )
        this.target.removeChild(leaving)
    }
}