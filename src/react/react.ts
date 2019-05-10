import { handlerFunc } from '../types'
import React from 'react';
import ReactDOM from 'react-dom';

export const Router = (): handlerFunc => (req, res, state) => {
    res.unmount = () => {
        // return reactState.unmount()
    }
    
    res.mount = (incoming: any): Promise<any> => {
        if (state.animation) {
            return animatedMount(incoming)
        }
        if (!state.outlet) {
            state.outlet = document.createElement('div')
            document.body.appendChild(state.outlet)
        }
        return Promise.resolve(mountC(incoming, state.outlet))
    }

    const animatedMount = (incoming: any) => {
        
        return new Promise(resolve => {
            const { commit, el } = pushC(incoming)
            const states = {
                hostView: 'host-view',
                base: res.ctx.animation.name,
                firstEnter: `${res.ctx.animation.name}-enter-first`,
                enter: `${res.ctx.animation.name}-enter`,
                enterDone: `${res.ctx.animation.name}-enter-done`,
                exit: `${res.ctx.animation.name}-exit`
            }
            
            const outlets = getOutlets()
            el.classList.add(states.base)
            el.style.transitionDuration = `${state.animation.duration}ms`
            commit()
            if (outlets.length === 1) {
                setTimeout(() => {
                    outlets[0].classList.add(states.firstEnter)
                    outlets[0].classList.add(states.enter)
                }, 1)
                setTimeout(() => {
                    outlets[0].classList.remove(states.firstEnter)
                    outlets[0].classList.remove(states.enter)
                    outlets[0].classList.add(states.enterDone)
                    resolve()
                }, state.animation.duration) 
                return
            }

            const outgoingEl = outlets[0]
            const incomingEl = outlets[1]
            outgoingEl.className = ''
            outgoingEl.classList.add(outletSelector)
            outgoingEl.classList.add(states.base)
            setTimeout(() => {
                outgoingEl.classList.remove(states.firstEnter)
                outgoingEl.classList.remove(states.enterDone)
                outgoingEl.classList.add(states.exit)
                incomingEl.classList.add(states.enter)
            }, 1)
            
            setTimeout(() => {
                popC()
                incomingEl.classList.remove(states.enter)
                incomingEl.classList.add(states.enterDone)
                resolve()
            }, state.animation.duration) 
        })
    }
}

const outletSelector = 'router-view'
const getOutlets = (): HTMLElement[] => (document.body.getElementsByClassName(outletSelector) as any)

const mountC = (C: any, target: HTMLElement) => {
    ReactDOM.render(
        React.createElement(C), 
        target
    )
}

const pushC = (C: any) => {
    const incoming = document.createElement('div')
    incoming.classList.add(outletSelector)
    ReactDOM.render(
        React.createElement(C), 
        incoming
    )
    return {
        el: incoming,
        commit: () => document.body.appendChild(incoming)
    }
}

const popC = () => {
    const outgoing = getOutlets()[0]
    ReactDOM.unmountComponentAtNode(outgoing)
    document.body.removeChild(outgoing)
}