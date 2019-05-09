"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animate = (className, duration) => (req, res) => {
    if (!req.state.react) {
        throw new Error('Please use ReactRouter before using animation library');
    }
    req.state.react.app.setState({
        animationName: className,
        animationDuration: duration
    });
};
//# sourceMappingURL=animate.js.map