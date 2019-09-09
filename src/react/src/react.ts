import { handlerFunc } from 'crayon'
import { mount } from 'crayon';
import { ReactState } from './state';
import { AccessSafe } from 'crayon-kit'

export const router = (
  target: HTMLElement = document.body, 
  className: string = 'router-view'
): handlerFunc => (req, res, state) => {
  if (state.reactState === undefined) {
    state.reactState = new ReactState(target, className)
  }
  res.mount = (Component: any): Promise<any> => {
    const animationName = AccessSafe.exec(
      () => res.ctx.animation.name, undefined)
    const animationDuration = AccessSafe.exec(
      () => res.ctx.animation.duration, undefined)
    return mount(
      Component,
      state.reactState.mounter,
      animationName,
      animationDuration
    )
  }
}