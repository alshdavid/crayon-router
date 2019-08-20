import * as genString from "../gen-string"

export type callback<T = any> = (value: T) => void

export interface Subscription {
  unsubscribe: () => void
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
}
