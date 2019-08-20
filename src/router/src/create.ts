import * as genString from "./platform/gen-string" 
import { getSharedState, SharedState, setSharedState } from './shared-state';
import { Router } from "./router";
import { History } from './history'
import { Locator } from "./locator";
import { RouteMap } from "./route-map";

/*
  This is the entrypoint for the router,
  bootstrapping dependencies and creating 
  the router
*/
export const create = (
  id = genString.ofLength(10),
  _window: Window = window,
): Router => {
  let sharedState = getSharedState(_window)
  if (!sharedState) {
    const history = new History(_window)
    sharedState = new SharedState(history)
    setSharedState(sharedState)
  }
  const routeMap = new RouteMap()
  const locator = new Locator(_window)
  const router = new Router(id, locator, routeMap, sharedState)
  return router
}