import React from 'react';
import ReactDOM from 'react-dom';
import { mountable, getOutlets } from 'crayon'
import { Element } from 'kit'

export class ReactMounter implements mountable {
    constructor(
        public target = document.body,
        public selector = 'router-view'
    ) {}

    async push(C: any) { 
        const incoming = document.createElement('div')
        Element.addClassNames(incoming, [this.selector])
        ReactDOM.render(
            React.createElement(C), 
            incoming
        )
        this.target.appendChild(incoming)
    }

    async pop() {
        const { leaving } = getOutlets(this.selector)
        if (!leaving) {
            return
        }
        ReactDOM.unmountComponentAtNode(leaving)
        this.target.removeChild(leaving)
    }
}