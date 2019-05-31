import * as observe from './platform/observe'
import { Router } from "./router";
import { History } from './history'
import { RouterEvent } from './types';

export class SharedState {
    routers: Record<string, Router> = {}
    events = observe.createSubject<RouterEvent>()
    
    constructor(
        public history: History
    ) {}

    addRouter(router: Router) {
        this.routers[router.id] = router
    }

    removeRouter(router: Router) {
        delete this.routers[router.id]
        if (Object.keys(this.routers).length !== 0) {
            return
        }
        this.history.destroy()
    }
}

export const getSharedState = (): SharedState => {
    if ((window as any).crayon === undefined) {
        const history = new History()
        const sharedState = new SharedState(
            history
        )
        ;(window as any).crayon = sharedState
    }
    return (window as any).crayon
}