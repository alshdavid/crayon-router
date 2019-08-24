import React from 'react';
import ReactDOM from 'react-dom';
import { Mounter, getRouteTargets } from 'crayon'
import { Element } from 'kit'

export class ReactMounter implements Mounter {
  constructor(
    public target: HTMLElement,
    public selector: string,
  ) { }

  async push(Component: () => JSX.Element): Promise<void> {
      const incoming = document.createElement('div')
      Element.addClassNames(incoming, [this.selector])
      await this.renderUsingReactDOM(Component, incoming)
      this.target.appendChild(incoming)
      Element.waitForElements(incoming)
  }

  async shift(): Promise<void> {
    const { leaving } = getRouteTargets(this.selector)
    if (!leaving) {
      return
    }
    ReactDOM.unmountComponentAtNode(leaving)
    this.target.removeChild(leaving)
  }

  renderUsingReactDOM(
    Component: () => JSX.Element, 
    target: HTMLElement
  ): Promise<void> {
    return new Promise(res => 
      ReactDOM.render(
        React.createElement(Component),
        target,
        () => res()
      ))
  }
}