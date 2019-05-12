import React, { useState, useMemo } from 'react'
import * as crayon from 'crayon'
import * as item from '~/platform/item'
import * as keyboard from 'mobile-keyboard-observer'
import { Subscription } from 'rxjs';

const onEnter = (e: React.KeyboardEvent, callback: () => any) => e.key === 'Enter' && callback()

const focusOnInput = (nav: crayon.Navigator) => {
    let sub: Subscription
    sub = nav.events.subscribe(v => {
        if (v.name === 'ROUTING_COMPLETE') {
            sub.unsubscribe()
            ;(document.getElementsByTagName('input')[0] as any).focus()
        }
    })
}

export const AddItem = (
    nav: crayon.Navigator, 
    store: item.Store
) => () => {
    useMemo(() => focusOnInput(nav), [nav])
    const [ name, setName ] = useState('')

    const addItem = () => {
        if (!name) {
            return
        }
        store.add(item.create(name))
        nav.back()
    }

    const addItemEnter = async () => {
        if (!name) {
            return
        }
        await keyboard.hide()
        store.add(item.create(name))
        nav.back()
    }

    return <main className="items-add-view">
        <nav className="feature">
            <div>
                Create A New Todo
            </div>
        </nav>
        <div className="container">
            <input 
                type="text" 
                placeholder="Title of todo" 
                onChange={e => setName(e.target.value)}
                onKeyPress={e => onEnter(e, addItemEnter)}/>
            <button 
                className="btn"
                onClick={addItem}>
                Add
            </button>
            <button 
                className="btn inverted"
                onClick={() => nav.back()}>
                Cancel
            </button>
        </div>
    </main>
}