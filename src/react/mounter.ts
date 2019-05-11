import React from 'react';
import ReactDOM from 'react-dom';
import { mountable,getOutlets, outletSelector, addClass } from '../mount'

export class ReactMounter implements mountable {
    constructor(
        public target = document.body
    ) {}

    push(C: any) { 
        const incoming = document.createElement('div')
        addClass(incoming, outletSelector)
        ReactDOM.render(
            React.createElement(C), 
            incoming
        )
        return {
            el: incoming,
            commit: () => this.target.appendChild(incoming)
        }
    }

    pop() {
        const { leaving } = getOutlets(outletSelector)
        if (!leaving) {
            return
        }
        ReactDOM.unmountComponentAtNode(leaving)
        this.target.removeChild(leaving)
    }
}