import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import crayon from 'crayon'
import { element } from 'crayon-kit'

export class ReactMounter implements crayon.Mounter {
  #root: Root | undefined

  constructor(
    public target: HTMLElement,
    public selector: string,
  ) { }

  async push(Component: () => JSX.Element): Promise<void> {
      const incoming = document.createElement('div')
      element.addClassNames(incoming, [this.selector])
      this.renderUsingReactDOM(Component, incoming)
      this.target.appendChild(incoming)
      element.waitForElements(incoming)
  }

  async shift(): Promise<void> {
    const { leaving } = crayon.getRouteTargets(this.selector)
    if (!leaving) {
      return
    }
    this.#root?.unmount()
    this.target.removeChild(leaving)
  }

  renderUsingReactDOM(
    Component: () => JSX.Element, 
    target: HTMLElement
  ): void {
    this.#root = createRoot(target)
    this.#root.render(React.createElement(Component))
  }
}