import { useState, useCallback, useEffect } from "react";
import crayon from 'crayon'

export const useActiveLink = (path: string, nav: crayon.Router) => {
    const [ isActive, setIsActive ] = useState('')

    const cb = useCallback(() => {
        if (window.location.pathname === path) {
            setIsActive('active')
            return
        }
        setIsActive('')
    }, [])

    useEffect(() => {
        const sub = nav.events.subscribe(cb)
        return () => sub.unsubscribe()
    }, [nav, cb])

    return isActive
}