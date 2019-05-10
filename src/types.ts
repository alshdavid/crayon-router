import { Request } from './request'
import { Response } from './response'

export interface Navigator {
    navigate: (path: string) => void
}

export type handlerFunc = (
    req: Request, 
    res: Response, 
    state: Record<string, any>, 
    history: string[]
) => void