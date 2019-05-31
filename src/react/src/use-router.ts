import { useState, useEffect } from "react";
import { Router, create } from "crayon";
import * as react from "./react";

export const useRouter = (
    name: string, 
    handlers: (nav: Router, selector: string) => void
): [ Router, (el: HTMLElement) => void ] => {
    const [ ref, setRef ] = useState()
    const [ nav, setNav ] = useState()

    useEffect(() => {
        if (nav || !ref) {
            return
        }
        const router = create(name)
        router.use(react.router(ref, name))
        handlers(router, '.'+ name)
        router.load()
        setNav(router)
        return () => router.destroy()
    }, [ref])

    return ([ nav, setRef ] as any)
}