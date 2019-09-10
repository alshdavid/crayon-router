import { 
  create,
  setStyles,
  setEvents,
  addClassNames,
  removeClassNames,
  clearClassList,
  waitForElements,
  ElementOptions as OGElementOptions
} from './element'

export const element = {
  create,
  setStyles,
  setEvents,
  addClassNames,
  removeClassNames,
  clearClassList,
  waitForElements,
}

export default element

export declare module element {
  export type ElementOptions<T extends keyof HTMLElementTagNameMap> = OGElementOptions<T>
}