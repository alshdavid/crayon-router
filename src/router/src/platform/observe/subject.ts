import * as genString from "../gen-string" 

export type callback<T = any> = (value: T) => void

export interface Subject<T> {
  subscribe: (value: callback<T>) => Subscription
  next: (value: T) => void
}

export interface Subscription {
  unsubscribe: () => void 
}

export const createSubject = <T = any>(): Subject<T> => {
    const subscribers: Record<string, callback<T>> = {}

    const subscribe = (cb: callback<T>): Subscription => {
      const key = genString.ofLength(5)
      subscribers[key] = cb
      return {
        unsubscribe: () => delete subscribers[key]
      }
    }

    const next = (value: T) => {
      for (const key in subscribers) {
        subscribers[key](value)
      }
    }

    return {
      subscribe,
      next
    }
}
