import * as genString from "./platform/gen-string" 
import { getSharedState } from './shared-state';
import { Router } from "./router";
import { Locator } from "./locator";

export const create = (
  id = genString.ofLength(10),
  _window: Window = window,
) => {
  const sharedState = getSharedState(_window)
  const locator = new Locator(_window)
  const router = new Router(id, sharedState, locator)
  return router
}