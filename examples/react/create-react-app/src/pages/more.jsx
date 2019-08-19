import React, {useState} from 'react'
import { useAppContext } from '../context'

export const More = () => {
    // const { router } = useAppContext()
    const [v]= useState('test')

    return <div>
        {v}
        {/* <nav>
            <button 
                onClick={() => router.back()}>
                &lt; Back
            </button>
        </nav>
        <h1>{ router.currentReq.routePattern }</h1> */}
    </div>
}