"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animate = ({ name, mode, childView }) => (req, res) => {
    res.ctx.vueAnimation = {
        name,
        mode,
        childView
    };
};
//# sourceMappingURL=animate.js.map