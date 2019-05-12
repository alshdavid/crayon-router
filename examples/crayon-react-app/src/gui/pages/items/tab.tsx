import React from 'react'
import * as item from '~/platform/item'
import { useObservable } from 'use-observable-hook'
import { Item } from '~/gui/components';

interface TabProps {
    store: item.Store
    onClick?: any
}

export const Tab = ({ store, onClick }: TabProps) => {
    const items = useObservable(store.items)
    return <React.Fragment>
        { items.length === 0 && <div className="nothing-here">Nothing here!</div>}
        { items.map(item => (
            <Item 
                key={item.id}
                title={item.title} 
                done={item.done} 
                onClick={() => onClick(item)}/>
        ))}  
    </React.Fragment>
}