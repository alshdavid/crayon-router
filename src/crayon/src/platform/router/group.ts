import { handlerFunc } from "./types.js";

export class Group {
    middleware: handlerFunc[] = []
    routes: Record<string, handlerFunc[]> = {}

    constructor(
        public base: string
    ) {}

    path(path: string, ...handlers: handlerFunc[]) {
        this.routes[path] = handlers
    }

    use(handler: handlerFunc) {
        this.middleware.push(handler)
    }
}
