import React from 'react'

export const Route = (req, nav) => () => (
    <div>
        <nav>
            <button 
                onClick={() => nav.navigate('/home')}>
                Home
            </button>
            <button
                onClick={() => nav.navigate('/about')}>
                About
            </button>
            <button
                className="anchored" 
                onClick={() => nav.navigate('/more')}>
                More &gt;
            </button>
        </nav>
        <h1>{ req.routePattern }</h1>
        {/* <pre>{ JSON.stringify(req, null, 4) }</pre> */}
    </div>
)