import { Request } from './request'
import { Response } from './response'
import { Router } from './router';
import { Subject } from 'rxjs';

export interface Navigator {
    navigate: (path: string) => void
    back: () => void
    events: Subject<any>
}

export type handlerFunc = (
    req: Request, 
    res: Response, 
    state: Record<string, any>, 
    app: Router
) => void

export class AnimationRoute {
    from?: string = ''
    to?: string = ''
    name?: string
    duration?: number
}

export class AnimationState {
    routes: AnimationRoute[] = []

    constructor(
        public name = 'no-animation',
        public duration = 0,
        public overrideDuration = false,
        public animationOnFirst = true
    ) {
        if (name === '') {
            throw new Error('Invalid animation name')
        }
    }
}