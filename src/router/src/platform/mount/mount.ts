import { Element, Sleep } from 'kit'
import { getOutlets } from "./get-outlets";

const { addClassNames, removeClassNames, clearClassList, setStyles, waitForElements } = Element

export interface mountable {
    selector: string
    target: HTMLElement
    push: (C: any) => Promise<void>
    pop: () => Promise<void>
    unmount?: () => Promise<void>
}

/*
    The mount function will take a framework/library specific component
    and a generic "mounter" implimentation which knows how to mount that 
    library's component.

    When a mount action is triggered the follow occurs:

        1)  A new HTML element which corresponds to the incoming 
            route is pushed into the target outlet HTML element
        
        2)  The old HTML element which corresponds to the previous
            route is unmounted and removed from the outlet element
    
    In effect, you can think of this process like an array, where
    you push a new route, and shift the old route off.

    1)  ['route-1']
    2)  ['route-1', 'route-2']
    3)  ['route-2']

    If it's detected that we have an animation duration, then 
    classNames and timers are added to the process to facilitate.

    The animations themselves must be declared as CSS. The mount 
    function only adds/removes classes relating to certain 
    lifecycle events. There for, it's up to the CSS styles to 
    action the requirements of the animaiton animation.

    See /src/transition/ for example CSS animations
*/
export const mount = async (
    incoming: any,
    mounter: mountable,
    name: string,
    duration: number
): Promise<void> => {
    // Get actors
    const root = mounter.target
    const states = makeClassNames(name)
    const hasTransition = hasAnimation(states.noAnimation, name, duration)
    
    // Push incoming component to dom
    // The mountable implimentation describes
    // What happens here - it is different for
    // every framework
    await mounter.push(incoming)

    // Get elements
    const { leaving, entering } = getOutlets(mounter.selector)
    
    // Add classes to entering element
    if (hasTransition) {
        addClassNames(root, [states.isAnimating])
        addClassNames(entering, [states.base])
        setStyles(entering, { transitionDuration: `${duration}ms` })
        waitForElements(entering)
    }

    // First load
    // Special action
    if (leaving === undefined) {
        if (!hasTransition) {
            addClassNames(entering, [states.enterDone])
            return
        }
        addClassNames(entering, [states.firstEnter, states.enter])
        waitForElements(entering)
        return Sleep.exec(() => {
            removeClassNames(entering, [states.firstEnter, states.enter])
            addClassNames(entering, [states.enterDone])
            removeClassNames(root, [states.isAnimating])
        }, duration)
    }

    // If route has no animation skip
    if (!hasTransition) {
        mounter.pop()
        return
    }

    // Start route animation
    clearClassList(leaving)
    setStyles(leaving, { transitionDuration: `${duration}ms` })
    setStyles(entering, { transitionDuration: `${duration}ms` })
    addClassNames(leaving, [mounter.selector, states.base, states.exit, states.enter])
    waitForElements(leaving, entering)

    // Remove classes once duration is complete
    return Sleep.exec(() => {
        mounter.pop()
        removeClassNames(entering, [states.enter])
        addClassNames(entering, [states.enterDone])
        removeClassNames(root, [states.isAnimating])
    }, duration)
}

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