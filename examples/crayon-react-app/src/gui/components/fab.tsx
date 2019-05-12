import React from 'react'

export const Fab: any = React.memo(({ children, onClick }: any) => (
    <div className="fab-component" onClick={onClick}>
        { children }
    </div>
))