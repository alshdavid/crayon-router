import { 
    Subscription as OGSubscription,
    Bundle as OGBundle,
    Beacon as OGBeacon,
    nthEvent,
    first
} from './beacon'

export const eventStream = {
  Bundle: OGBundle,
  Beacon: OGBeacon,
  nthEvent,
  first
}

export default eventStream

export declare module eventStream {
    export type Bundle = OGBundle
    export type Beacon<T> = OGBeacon<T>
    export type Subscription = OGSubscription
}
