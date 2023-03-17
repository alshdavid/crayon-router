import { ReactMounter } from './mounter.js'

export class ReactState {
  public mounter: ReactMounter

  constructor(
    public target: HTMLElement,
    public className: string
  ) {
    this.mounter = new ReactMounter(
      this.target, 
      this.className
    )
  }
}