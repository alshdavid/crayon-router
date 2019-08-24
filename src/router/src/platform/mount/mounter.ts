export interface Mounter {
  selector: string
  target: HTMLElement
  push: (C: any) => Promise<void>
  shift: () => Promise<void>
  unmount?: () => Promise<void>
}