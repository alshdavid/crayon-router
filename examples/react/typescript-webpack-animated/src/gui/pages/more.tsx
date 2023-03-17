import React from 'react'
import { useAppContext } from '~/gui/context'

export const More = () => {
    const { router } = useAppContext()

    console.log(router)
    return <div>
        <nav>
            <button 
                onClick={() => router.back()}>
                &lt; Back
            </button>
        </nav>
        <h1>{ window.location.pathname }</h1>
    </div>
}