import React from 'react'
import { useAppContext } from '~/gui/context'

export const Route = () => {
    const { router } = useAppContext()
    return <div>
        <nav>
            <button 
                onClick={() => router.navigate('/home')}>
                Home
            </button>
            <button
                onClick={() => router.navigate('/about')}>
                About
            </button>
            <button
                className="anchored" 
                onClick={() => router.navigate('/more')}>
                More &gt;
            </button>
        </nav>
        <h1>{ window.location.pathname }</h1>
    </div>
}