import * as router from './platform/router'
import * as mount from './platform/mount'
import * as history from './platform/history'
import * as locator from './platform/locator'
import * as sharedState from './platform/shared-state'
import { create, group } from './sdk'

export const crayon = {
  create, 
  group,
  mount: mount.mount,
  Router: router.Router,
  Group: router.Group,
  Request: router.Request,
  Response: router.Response,
  SharedState: sharedState.SharedState,
  History: history.History,
  getRouteTargets: mount.getRouteTargets,
  RouterEventType: router.RouterEventType,
  HistoryEventType: history.HistoryType,
}

export default crayon

export declare module crayon {
  export type Router = router.Router
  export type Group = router.Group
  export type Request = router.Request
  export type Response = router.Response
  export type RouterEvent = router.RouterEvent
  export type RouterEventType = router.RouterEventType
  export type handlerFunc = router.handlerFunc
  export type ClassNameStates = mount.ClassNameStates
  export type Mounter = mount.Mounter
  export type History = history.History
  export type HistoryEvent = history.HistoryEvent
  export type HistoryType = history.HistoryType
  export type Locator = locator.Locator
  export type SharedState = sharedState.SharedState
}

