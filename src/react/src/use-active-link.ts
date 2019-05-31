import { useState, useCallback, useEffect } from "react";
import { Navigator } from 'crayon'

export const useActiveLink = (path: string, nav: Navigator) => {
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