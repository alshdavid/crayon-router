import ReactDOM from 'react-dom'
import { createElement } from 'react'
import { handlerFunc } from './router'

export const React = (selector: string): handlerFunc => (req, res) => {
    const element = document.querySelector(selector)
    if (!element) {
        throw new Error('Outlet element not found')
    }

    res.mount = async (v: any) => {
        ReactDOM.unmountComponentAtNode(element)
        return ReactDOM.render(createElement(v as any), element)
    }
}