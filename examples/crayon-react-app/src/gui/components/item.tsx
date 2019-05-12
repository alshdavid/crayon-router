import React from 'react'

export const Item: any = React.memo(({ title, done, onClick }: any) => (
    <div 
        className={`item-component ${done && 'complete'}`}
        onClick={onClick}>
        <p>{ title }</p>
    </div>
))