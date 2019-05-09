import { handlerFunc } from '../types'

export const Animate = (
    className: string, 
    duration: number
): handlerFunc => (
    req, 
    res,
    state
) => {
    if (!state.react) {
        throw new Error('Please use ReactRouter before using animation library')
    }
    state.react.app.setState({
        animationName: className,
        animationDuration: duration
    })
}