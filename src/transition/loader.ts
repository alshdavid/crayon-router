import { handlerFunc } from "../types";
import * as fromSlide from "./slide";
import * as fromFade from "./fade";
import * as fromPop from "./pop";
import * as fromPush from './push'
import { root } from "./body";

export const loader = (seletor = 'body'): handlerFunc => {
    const s = document.createElement('style')
    s.innerHTML += root
    s.innerHTML += fromPop.pop
    s.innerHTML += fromPush.push
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
export const popUp ='pop-up'
export const popDown ='pop-down'
export const popLeft = 'pop-left'
export const popRight = 'pop-right'
export const fade = 'fade'