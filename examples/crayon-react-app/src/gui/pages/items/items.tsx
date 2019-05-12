import React from 'react'
import * as crayon from 'crayon'
import * as react from 'crayon/react'
import * as transition from 'crayon/transition'
import * as item from '~/platform/item'
import { Toolbar } from '~/gui/components';
import { Tab } from './tab'

export const Items = (
    nav: crayon.Navigator, 
    pending: item.Store,
    complete: item.Store
) => () => {
    const completeItem = (item: item.Item) => {
        pending.remove(item.id)
        complete.add({ ...item, done: true })
    }

    const uncompleteItem = (item: item.Item) => {
        complete.remove(item.id)
        pending.add(item)
    }

    const [ tabs, setTabs ] = react.useRouter('items-view', (tabs, selector) => {
        tabs.use(transition.loader(selector))
        tabs.use(crayon.animate({
            duration: 500
        }))
        tabs.path('/items/pending', 
            crayon.animate([{ from: '/**', name: transition.slideRight }]),    
            (req, res) => res.mount(() => <Tab store={pending} onClick={completeItem} />)
        )

        tabs.path('/items/complete', 
            crayon.animate([{ from: '/**', name: transition.slideLeft }]),
            (req, res) => res.mount(() => <Tab store={complete} onClick={uncompleteItem}/>)
        )
    })
    
    return <main>
        <nav>
            <div>
                A Simple Todo SPA
            </div>
            <button
                onClick={() => nav.navigate('/items/add')}>
                Add +
            </button>
        </nav>
        <section 
            ref={setTabs}>
        </section>
        <Toolbar>
            <div
                className={react.useActiveLink('/items/pending', nav)}
                onClick={() => tabs.navigate('/items/pending')}>
                Pending
            </div>
            <div
                className={react.useActiveLink('/items/complete', nav)}
                onClick={() => tabs.navigate('/items/complete')}>
                Complete
            </div>
        </Toolbar>
    </main>
}