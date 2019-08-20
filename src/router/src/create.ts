import * as genString from "./platform/gen-string" 
import { getSharedState, SharedState, setSharedState } from './shared-state';
import { Router } from "./router";
import { History } from './history'
import { Locator } from "./locator";
import { RouteMap } from "./route-map";
import { RouterEventType } from "./types";

/*
  This is the entrypoint.
  It bootstraps dependencies, creates
  the router and handles teardown
*/
export const create = (
  id = genString.ofLength(10),
  _window: Window = window,
  sharedState?: SharedState,
): Router => {
  /*
    SharedState lives on the window object and allows
    for routers to talk to each other
  */
  if (sharedState === undefined) {
    sharedState = getSharedState(_window)
  }
  if (sharedState === undefined) {
    const history = new History(_window)
    sharedState = new SharedState(history)
    setSharedState(sharedState)
  }
  const history = sharedState.history
  const routeMap = new RouteMap()
  const locator = new Locator(_window)
  const router = new Router(
    id, 
    locator, 
    routeMap, 
    history,
    sharedState.events
  )
  // Add the router to the shared state
  sharedState.addRouter(router)
  
  // When the router is destroyed, clean up
  void async function(){
    await sharedState.events.first(event =>
      event.type === RouterEventType.Destroyed && 
      event.id === router.id
    )
    sharedState!.removeRouter(router)
  }()
  
  return router
}