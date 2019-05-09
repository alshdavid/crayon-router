import { handlerFunc } from "../router";

export const Animate = ({ 
    name, 
    mode,
    childView
}: { 
    name: string, 
    mode?: string
    childView?: string
}): handlerFunc => (req, res) => {
    res.ctx.vueAnimation = {
        name,
        mode,
        childView
    }
}