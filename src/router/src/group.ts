import { handlerFunc } from "./types";

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

export const group = (base: string, callback?: (group: Group) => void): Group => {
    const group = new Group(base)
    callback && callback(group)
    return group
}