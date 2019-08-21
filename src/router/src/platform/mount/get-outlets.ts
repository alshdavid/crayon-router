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