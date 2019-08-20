import { Beacon } from './platform/beacon'
import { Router } from "./router";
import { History } from './history'
import { RouterEvent } from './types';

export class SharedState {
    routers: Record<string, Router> = {}
    events = new Beacon<RouterEvent>()
    
    constructor(
        public history: History,
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

export const getSharedState = (
    _window: Window = window,   
): SharedState => {
    if ((_window as any).crayon === undefined) {
        const history = new History(_window)
        const sharedState = new SharedState(
            history
        )
        ;(_window as any).crayon = sharedState
    }
    return (_window as any).crayon
}