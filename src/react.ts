import { handlerFunc, Request, Response } from './router'
// import React from 'react';
// import ReactDOM, { render } from 'react-dom';

const makeid = (length: number) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

export const ReactAnimate = (
    className: string, 
    duration: number
): handlerFunc => (
    req, 
    res
) => {
    if (!req.state.react) {
        throw new Error('Please use ReactRouter before using animation library')
    }
    req.state.react.app.setState({
        animationName: className,
        animationDuration: duration
    })
}


export const ReactRouter = (
    selector: string,
    React: any,
    ReactDOM: any
): handlerFunc => (req, res) => {

const App = () => class extends React.Component {
    state: any = {
        elementRef: undefined,
        routes: [],
        lastPage: undefined,
        page: undefined,
        animationName: undefined,
        animationDuration: 500
    }

    paint(C: any) {
        if (this.state.animationName) {
            return this.aniamtedPaint(C)
        }
        this.setState({ 
            routes: [{ C, key: makeid(6) }] 
        })
    }

    aniamtedPaint(C: any) {
        return new Promise(res => {
            const toMount = { C, key: makeid(6) }
            const states = {
                hostView: 'host-view',
                firstEnter: `${this.state.animationName}-enter-first`,
                enter: `${this.state.animationName}-enter`,
                enterDone: `${this.state.animationName}-enter-done`,
                exit: `${this.state.animationName}-exit`
            }
            const getIncomingEl = (): HTMLElement | undefined => this.state.elementRef.children[1]
            const getCurrentEl = (): HTMLElement | undefined => this.state.elementRef.children[0]
            this.setState({ 
                routes: [...this.state.routes, toMount]
            })
            const current = getCurrentEl()
            if (!current) {
                return
            }
            current.style.transitionDuration = `${this.state.animationDuration}ms`
            current.classList.add(states.hostView)
            current.classList.add(this.state.animationName)
            if (this.state.routes.length === 1) {
                setTimeout(() => {
                    current.classList.add(states.enter)
                    current.classList.add(states.firstEnter)
                }, 1)
                setTimeout(() => {
                    current.classList.remove(states.enter)
                    current.classList.remove(states.firstEnter)
                    current.classList.add(states.enterDone)
                    res()
                }, this.state.animationDuration)
                return
            }
            const incoming = getIncomingEl()
            if (!incoming) {
                return
            }
            incoming.classList.add(this.state.animationName)
            incoming.classList.add(states.hostView)
            setTimeout(() => {
                current.classList.add(states.exit)
                current.classList.remove(states.enterDone)
                incoming.classList.add(states.enter)
            }, 1)        
            setTimeout(() => {
                this.state.routes.shift()
                this.setState({
                    routes: [ ...this.state.routes ]
                })
                incoming.classList.remove(states.enter)
                incoming.classList.add(states.enterDone)
                res()
            }, this.state.animationDuration)
        })
    }

    render() {
        if (!this.state.routes.length) {
            return React.createElement('div')
        }
        if (this.state.animationName) {
            return React.createElement(
                React.Fragment, 
                {},
                this.state.routes.map(
                    ({ C, key }: any, i: any) => React.createElement(C, { key })
                )
            )
        } 
        return React.createElement(this.state.routes[0].C)
    }
}

class ReactState {
    app: any
    animationName: string = ''
    animationDuration: number = 0

    constructor(selector: string) {
        const element = document.querySelector(selector)
        if (!element) {
            throw new Error('Outlet element not found')
        }

        ReactDOM.render(
            React.createElement(
                App(), 
                { ref: (c: any) => this.app = c}
            ), 
            element
        )
        this.app.state.elementRef = element
    }

    mount(c: any) {
        return this.app.paint(c)
    }

    animatedMount(C: any) {

    }
}

    if (!req.state.react) {
        req.state.react = new ReactState(selector)
        ;(window as any).app = req.state.react
    }

    res.mount = async (c: any) => {
        return req.state.react.mount(c)
    }
}