import { handlerFunc } from '../types'

export const Router = (
    selector: string,
    React: any,
    ReactDOM: any
): handlerFunc => (req, res, state) => {

    const App = () => class extends React.Component {
        state: any = {
            page: undefined
        }

        paint(C: any) {
            this.setState({ 
                page: C 
            })
        }

        render() {
            if (!this.state.page) {
                return React.createElement('div')
            }
            return React.createElement(this.state.page)
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
    }

    if (!state.react) {
        state.react = new ReactState(selector)
    }

    res.mount = async (c: any) => {
        return state.react.mount(c)
    }
}