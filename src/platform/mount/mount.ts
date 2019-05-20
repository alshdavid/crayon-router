import { go } from "./timeout";
import { addClass, addStyles, removeClass, clearClasses, waitForElements, getOutlets } from "./element";

export interface mountable {
    selector: string
    target: HTMLElement
    push: (C: any) => Promise<void>
    pop: () => Promise<void>
}

// The secret sauce
export const mount = async (
    incoming: any,
    mounter: mountable,
    name: string,
    duration: number
) => {
    // Get actors
    const root = mounter.target
    const states = makeClassNames(name)
    const hasTransition = hasAnimation(states.noAnimation, name, duration)
    
    // Push incoming to dom
    await mounter.push(incoming)

    // Get elements
    const { leaving, entering } = getOutlets(mounter.selector)
    
    // Add classes to entering element
    if (hasTransition) {
        addClass(root, states.isAnimating)
        addClass(entering, states.base)
        addStyles(entering, { transitionDuration: `${duration}ms` })
        waitForElements(entering)
    }

    // First load
    // Special action
    if (leaving === undefined) {
        if (!hasTransition) {
            addClass(entering, states.enterDone)
            return Promise.resolve()
        }
        addClass(entering, states.firstEnter)
        addClass(entering, states.enter)
        waitForElements(entering)
        return go(() => {
            removeClass(entering, states.firstEnter)
            removeClass(entering, states.enter)
            addClass(entering, states.enterDone)
            removeClass(root, states.isAnimating)
        }, duration)
    }

    // If route has no animation skip
    if (!hasTransition) {
        mounter.pop()
        return Promise.resolve()
    }

    // Start route animation
    clearClasses(leaving)
    addStyles(leaving, { transitionDuration: `${duration}ms` })
    addStyles(entering, { transitionDuration: `${duration}ms` })
    addClass(leaving, mounter.selector)
    addClass(leaving, states.base)
    addClass(leaving, states.exit)
    addClass(entering, states.enter)   
    waitForElements(leaving, entering)

    // Remove classes once duration is complete
    return go(() => {
        mounter.pop()
        removeClass(entering, states.enter)
        addClass(entering, states.enterDone)
        removeClass(root, states.isAnimating)
    }, duration)
}

// TODO remove name
const makeClassNames = (name: string) => ({
    isAnimating: 'is-animating',
    noAnimation: 'no-animation',
    hostView: 'host-view',
    base: name,
    firstEnter: `${name}-enter-first`,
    enter: `${name}-enter`,
    enterDone: `${name}-enter-done`,
    exit: `${name}-exit`
})

const hasAnimation = (
    noAnimation: string, 
    name?: string, 
    duration?: number
) => {
    if (
        !name || 
        !duration ||
        name === noAnimation || 
        duration === 0
    ) {
        return false
    }
    return true
}