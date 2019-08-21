import { useState, useCallback, useEffect } from "react";
import { Router } from 'crayon'

export const useActiveLink = (path: string, nav: Router) => {
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