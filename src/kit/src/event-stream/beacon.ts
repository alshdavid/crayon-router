import * as genString from "../gen-string"

export type callback<T = any> = (value: T) => void

export interface Subscription {
  unsubscribe: () => void
}

export namespace EventStream {
  export interface Subscription {
    unsubscribe: () => void
  }
}

export class Beacon<T> {
  subscribers: Record<string, callback<T>> = {}

  subscribe(cb: callback<T>): Subscription {
    const key = genString.ofLength(5)
    this.subscribers[key] = cb
    return {
      unsubscribe: () => delete this.subscribers[key]
    }
  }

  next(value: T) {
    for (const key in this.subscribers) {
      this.subscribers[key](value)
    }
  }

  first(cb: (value: T) => boolean = () => true): Promise<T> {
    return first<T>(this, cb)
  }

  nthEvent(n: number): Promise<T> {
    return nthEvent(this, n)
  }
}

export class Bundle {
  subscriptions: Subscription[] = []

  add(subscription: Subscription): void {
    this.subscriptions.push(subscription)
  }

  unsubscribe(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
    this.subscriptions = []
  }
}

export const nthEvent = <T>(
  beacon: Beacon<T>, 
  n: number
): Promise<T> => {
  return new Promise(res => {
    let count = 0
    const subscription = beacon.subscribe(value => {
      count++
      if (count === n) {
        res(value)
        subscription.unsubscribe()
      }
    })
  })
}

export const first = <T>(
  beacon: Beacon<T>, 
  cb: (value: T) => boolean = () => true
): Promise<T> => {
  return new Promise(res => {
    const subscription = beacon.subscribe(value => {
      const result = cb(value)
      if (result === true) {
        res(value)
        subscription.unsubscribe()
      }
    })
  })
}