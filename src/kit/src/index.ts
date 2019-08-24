import * as fromEventStream from './event-stream'
import { 
    Subscription as OGSubscription,
    Bundle as OGBundle,
    Beacon as OGBeacon
} from './event-stream'
export const EventStream = fromEventStream
export declare module EventStream {
    export type Bundle = OGBundle
    export type Beacon<T> = OGBeacon<T>
    export type Subscription = OGSubscription
}

import * as fromAccessSafe from './access-safe'
export const AccessSafe = fromAccessSafe

import * as fromCheckType from './check-type'
export const CheckType = fromCheckType

import * as fromElement from './element'
export const Element = fromElement

import * as fromGenString from './gen-string'
export const GenString = fromGenString

import * as fromSleep from './sleep'
export const Sleep = fromSleep

import * as fromURL from './url'
export const URL = fromURL

export default {
    AccessSafe,
    EventStream,
    CheckType,
    Element,
    GenString,
    Sleep,
    URL,
}
