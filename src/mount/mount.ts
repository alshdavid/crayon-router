export const outletSelector = 'router-view'
export const getOutlets = (): HTMLElement[] => (document.body.getElementsByClassName(outletSelector) as any)
export const waitForElements = (...e: HTMLElement[]) => e.forEach(el => el.getBoundingClientRect())

export interface mountable {
    push: (C: any) => { commit: () => void, el: HTMLElement }
    pop: () => void
}

export const animatedMount = (
    incoming: any,
    mounter: mountable,
    name: string,
    duration: number
) => {
    return new Promise(resolve => {
        document.body.classList.add('is-animating')
        const { commit, el } = mounter.push(incoming)
        const states = {
            hostView: 'host-view',
            base: name,
            firstEnter: `${name}-enter-first`,
            enter: `${name}-enter`,
            enterDone: `${name}-enter-done`,
            exit: `${name}-exit`
        }
        
        const outlets = getOutlets()
        el.classList.add(states.base)
        el.style.transitionDuration = `${duration}ms`
        commit()
        if (outlets.length === 1) {
            waitForElements(outlets[0])
            outlets[0].classList.add(states.firstEnter)
            outlets[0].classList.add(states.enter)
            setTimeout(() => {
                outlets[0].classList.remove(states.firstEnter)
                outlets[0].classList.remove(states.enter)
                outlets[0].classList.add(states.enterDone)
                document.body.classList.remove('is-animating')
                resolve()
            }, duration) 
            return
        }
        if (name === 'no-animation' || duration === 0) {
            mounter.pop()
            resolve()
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
        
        setTimeout(() => {
            mounter.pop()
            incomingEl.classList.remove(states.enter)
            incomingEl.classList.add(states.enterDone)
            document.body.classList.remove('is-animating')
            resolve()
        }, duration) 
    })
}