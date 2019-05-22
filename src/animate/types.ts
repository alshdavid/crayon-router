export class AnimationRoute {
    from?: string = ''
    to?: string = ''
    name?: string
    duration?: number
}

export interface AnimationOptions {
    name?: string
    duration?: number
    overrideDuration?: boolean
    animationOnFirst? : boolean,
    routes?: AnimationRoute[]
}