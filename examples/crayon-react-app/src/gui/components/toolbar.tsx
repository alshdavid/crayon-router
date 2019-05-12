import React from 'react'

export const Toolbar: any = React.memo(({ children }: any) => (
    <div className="toolbar-component">
        { children }
    </div>
))