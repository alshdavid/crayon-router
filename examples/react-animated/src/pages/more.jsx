import React from 'react'

export const More = (req, nav) => () => (
    <div>
        <nav>
            <button 
                onClick={() => nav.back()}>
                &lt; Back
            </button>
        </nav>
        <h1>{ req.routePattern }</h1>
    </div>
)