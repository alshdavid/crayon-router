import { handlerFunc } from './router'

interface IReactDOM {
    unmountComponentAtNode: (element: Element) =>  any
    render: (reactElement: any, target: Element) => any
}

interface IReact {
    createElement: (v: any) => any
}

export const ReactRouter = (
    selector: string, 
    React: IReact, 
    ReactDOM: IReactDOM
): handlerFunc => (req, res) => {
    const element = document.querySelector(selector)
    if (!element) {
        throw new Error('Outlet element not found')
    }

    res.mount = async (v: any) => {
        ReactDOM.unmountComponentAtNode(element)
        return ReactDOM.render(React.createElement(v as any), element)
    }
}