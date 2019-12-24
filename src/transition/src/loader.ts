import crayon from "crayon";
import * as fromSlide from "./slide";
import * as fromFade from "./fade";
import * as fromPop from "./pop";
import * as fromPush from './push'
import { root } from "./body";

export const loader = (seletor = '.router-view'): crayon.handlerFunc => {
    const s = document.createElement('style')
    s.innerHTML += root(seletor)
    s.innerHTML += fromPop.pop(seletor)
    s.innerHTML += fromPush.push(seletor)
    s.innerHTML += fromSlide.slide(seletor)
    s.innerHTML += fromFade.fade(seletor)
    document.head.appendChild(s)
    return (req, res, state) => {}
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