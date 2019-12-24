import crayon from 'crayon'
import { ReactState } from './state';

export const router = (
  target: HTMLElement = document.body, 
  className: string = 'router-view'
): crayon.handlerFunc => (ctx, state) => {
  if (state.reactState === undefined) {
    state.reactState = new ReactState(target, className)
  }
  ctx.mount = (Component: any): Promise<any> => {
    const animationName = ctx && ctx.ctx && ctx.ctx.animation && ctx.ctx.animation.name
    const animationDuration = ctx && ctx.ctx && ctx.ctx.animation && ctx.ctx.animation.duration
    return crayon.mount(
      Component,
      state.reactState.mounter,
      animationName,
      animationDuration
    )
  }
}