import React from 'react';
import ReactDOM from 'react-dom';
import crayon from 'crayon'
import { element } from 'crayon-kit'

export class ReactMounter implements crayon.Mounter {
  constructor(
    public target: HTMLElement,
    public selector: string,
  ) { }

  async push(Component: () => JSX.Element): Promise<void> {
      const incoming = document.createElement('div')
      element.addClassNames(incoming, [this.selector])
      await this.renderUsingReactDOM(Component, incoming)
      this.target.appendChild(incoming)
      element.waitForElements(incoming)
  }

  async shift(): Promise<void> {
    const { leaving } = crayon.getRouteTargets(this.selector)
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