"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = (selector, React, ReactDOM) => (req, res) => {
    const App = () => class extends React.Component {
        constructor() {
            super(...arguments);
            this.state = {
                page: undefined
            };
        }
        paint(C) {
            this.setState({
                page: C
            });
        }
        render() {
            if (!this.state.page) {
                return React.createElement('div');
            }
            return React.createElement(this.state.page);
        }
    };
    class ReactState {
        constructor(selector) {
            this.animationName = '';
            this.animationDuration = 0;
            const element = document.querySelector(selector);
            if (!element) {
                throw new Error('Outlet element not found');
            }
            ReactDOM.render(React.createElement(App(), { ref: (c) => this.app = c }), element);
            this.app.state.elementRef = element;
        }
        mount(c) {
            return this.app.paint(c);
        }
    }
    if (!req.state.react) {
        req.state.react = new ReactState(selector);
    }
    res.mount = (c) => __awaiter(this, void 0, void 0, function* () {
        return req.state.react.mount(c);
    });
};
//# sourceMappingURL=react.js.map