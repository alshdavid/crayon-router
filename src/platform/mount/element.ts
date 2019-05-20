export const addClass = (
    el: HTMLElement, 
    name: string
) => name && el && el.classList && el.classList.add && (el.classList.add(name))

export const removeClass = (
    el: HTMLElement, 
    name: string
) => name && el && el.classList && el.classList.add && (el.classList.remove(name))

export const clearClasses = (
    el: HTMLElement
) => el && el.className && (el.className = '')

export const addStyles = (
    el: HTMLElement, 
    styles: Record<string, string | number>
) => {
    if (!styles || !el) {
        return
    }
    for (const style in styles) {
        (el.style as any)[style] = styles[style]
    }
}

export const waitForElements = (...e: HTMLElement[]) => e.forEach(el => el.getBoundingClientRect())

export const getOutlets = (selector: string) => {
    const outlets = (document.body.getElementsByClassName(selector) as any)
    let leaving: HTMLElement | undefined
    let entering: HTMLElement
    if (outlets.length === 1) {
        entering = outlets[0]
    } else {
        leaving = outlets[0]
        entering = outlets[1]
    }
    return {
        length: outlets.length,
        leaving,
        entering
    }
}