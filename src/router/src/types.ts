import * as observe from './platform/observe'
import { Request } from './request'
import { Response } from './response'
import { Router } from './router';

export interface Navigator {
    navigate: (path: string) => void
    back: () => void
    events: observe.Subject<any>
}

export type handlerFunc = (
    req: Request,
    res: Response,
    state: Record<string, any>,
    app: Router
) => void

export enum RouterEventType {
    History = 'HISTORY_EVENT',
    LoadTriggered = 'ROUTER_LOAD_TRIGGERED',
    ProgressStart = 'ROUTER_START',
    ProgressEnd = 'ROUTER_END',
    RunningHanlders = 'ROUTER_RUNNING_HANDLERS',
    NoHanlders = 'ROUTER_NO_HANDLERS',
    SameRouteAbort = 'ROUTER_SAME_ROUTE_ABORT',
    Destroyed = 'ROUTER_DESTROYED'
}

export interface RouterEvent {
    type: RouterEventType
    id: string
    data?: any
}