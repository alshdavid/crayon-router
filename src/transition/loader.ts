import { handlerFunc } from "../types";
import * as fromSlide from "./slide";
import * as fromFade from "./fade";
import * as fromPop from "./pop";
import * as fromPush from './push'
import { root } from "./body";

let hasLoadedCSS = false

export const loader = (seletor = 'body'): handlerFunc => {
    const s = document.createElement('style')
    s.innerHTML += root(seletor)
    s.innerHTML += fromPop
    s.innerHTML += fromPush
    s.innerHTML += fromSlide.slide
    s.innerHTML += fromFade.fade
    document.head.appendChild(s)
    return (req, res, state) => null
} 

export const slideUp ='slide-up'
export const slideDown ='slide-down'
export const slideLeft = 'slide-left'
export const slideRight = 'slide-right'
export const pushUp ='push-up'
export const pushDown ='push-down'
export const pushLeft = 'push-left'
export const pushRight = 'push-right'
export const popUp ='slide-up'
export const popDown ='slide-down'
export const popLeft = 'slide-left'
export const popRight = 'slide-right'
export const fade = 'fade'