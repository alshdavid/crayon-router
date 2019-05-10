import { Request } from './request'
import { Response } from './response'

export interface Navigator {
    navigate: (path: string) => void
    back: () => void
}

export type handlerFunc = (
    req: Request, 
    res: Response, 
    state: Record<string, any>, 
    history: string[]
) => void

export class AnimationRoute {
    from: string = ''
    to: string = ''
    name?: string
    duration?: number
}

export class AnimationState {
    routes: AnimationRoute[] = []

    constructor(
        public name = 'no-animation',
        public duration = 0,
        public overrideDuration = false
    ) {
        if (name === '') {
            throw new Error('Invalid animation name')
        }
    }
}