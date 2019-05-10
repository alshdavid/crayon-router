import { go } from "./timeout";

export const outletSelector = 'router-view'
export const getOutlets = (): HTMLElement[] => (document.body.getElementsByClassName(outletSelector) as any)
export const waitForElements = (...e: HTMLElement[]) => e.forEach(el => el.getBoundingClientRect())

export interface mountable {
    push: (C: any) => { commit: () => void, el: HTMLElement }
    pop: () => void
}

const addClass = (
    el: HTMLElement, 
    name: string
) => el && el.classList && el.classList.add && el.classList.add(name)

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

// The secret sauce
export const mount = (
    incoming: any,
    mounter: mountable,
    name: string,
    duration: number
) => {
    const states = makeClassNames(name)
    document.body.classList.add(states.isAnimating)
    const { commit, el } = mounter.push(incoming)
    
    const outlets = getOutlets()
    addClass(el, states.base)
    el.style.transitionDuration = `${duration}ms`
    commit()
    if (outlets.length === 1) {
        waitForElements(outlets[0])
        outlets[0].classList.add(states.firstEnter)
        outlets[0].classList.add(states.enter)
        return go(() => {
            outlets[0].classList.remove(states.firstEnter)
            outlets[0].classList.remove(states.enter)
            outlets[0].classList.add(states.enterDone)
            document.body.classList.remove(states.isAnimating)
        })
    }
    if (name === states.noAnimation || duration === 0) {
        mounter.pop()
        return Promise.resolve()
        return
    }

    const outgoingEl = outlets[0]
    const incomingEl = outlets[1]
    outgoingEl.style.transitionDuration = `${duration}ms`
    incomingEl.style.transitionDuration = `${duration}ms`
    outgoingEl.className = ''
    outgoingEl.classList.add(outletSelector)
    outgoingEl.classList.add(states.base)
    waitForElements(outgoingEl, incomingEl)
    outgoingEl.classList.add(states.exit)
    incomingEl.classList.add(states.enter)
    
    return go(() => {
        mounter.pop()
        incomingEl.classList.remove(states.enter)
        incomingEl.classList.add(states.enterDone)
        document.body.classList.remove(states.isAnimating)
    })
}