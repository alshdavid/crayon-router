import { eventStream } from 'crayon-kit'
import { History } from '../history'
import { Router, RouterEvent, RouterEventType } from "../router";

export class SharedState {
  routers: Record<string, Router> = {}
  events = new eventStream.Beacon<RouterEvent>()

  constructor(
    public history: History,
  ) { }

  addRouter(router: Router) {
    this.routers[router.id] = router
    this.events.next({ type: RouterEventType.Registered, id: router.id })
  }

  removeRouter(router: Router) {
    delete this.routers[router.id]
    if (Object.keys(this.routers).length !== 0) {
      return
    }
    this.events.next({ type: RouterEventType.Unregistered, id: router.id })
    this.history.destroy()
  }
}

export const getSharedState = (
  _window: Window = window,
): SharedState | undefined => {
  if ((_window as any).crayon === undefined) {
    return undefined
  }
  return (_window as any).crayon
}

export const setSharedState = (
  sharedState: SharedState,
  _window: Window = window,
): void => {
  ; (_window as any).crayon = sharedState
}