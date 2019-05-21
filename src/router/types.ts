import * as observe from '../platform/observe'
import { Request } from './request'
import { Response } from './response'
import { Router } from './router';

export interface Navigator {
    navigate: (path: string) => void
    back: () => void
    events: observe.Subject<any>
}

export type handlerFunc = (
    req: Request,
    res: Response,
    state: Record<string, any>,
    app: Router
) => void
