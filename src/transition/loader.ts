import { handlerFunc } from "../types";
import * as fromSlide from "./slide";
import * as fromFade from "./fade";
import { root } from "./body";

let hasLoadedCSS = false

export const loader = (seletor = 'body'): handlerFunc => {
    const s = document.createElement('style')
    s.innerHTML += root(seletor)
    s.innerHTML += fromSlide.slideLeft
    s.innerHTML += fromSlide.slideRight
    s.innerHTML += fromFade.fade
    document.head.appendChild(s)
    return (req, res, state) => null
} 

export const slideLeft ='slide-left'
export const slideRight = 'slide-right'
export const fade = 'fade'