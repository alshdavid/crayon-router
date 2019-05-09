import { handlerFunc } from '../router'

export const Animate = (
    className: string, 
    duration: number
): handlerFunc => (
    req, 
    res
) => {
    if (!req.state.react) {
        throw new Error('Please use ReactRouter before using animation library')
    }
    req.state.react.app.setState({
        animationName: className,
        animationDuration: duration
    })
}