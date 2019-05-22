import './app.scss'
import * as crayon from 'crayon';
import * as react from 'crayon/react';
import * as transition from 'crayon/transition';
import * as animate from 'crayon/animate';
import * as pages from './pages'
import * as item from '~/platform/item';

const target: HTMLElement = (document.getElementById('router-outlet') as any)

void async function main(){
    const pending = item.createStore()
    const complete = item.createStore()
    const app = crayon.create('main')  

    app.use(react.router(target))
    app.use(transition.loader()) 
    app.use(animate.defaults({
        duration: 500
    }))
    
    app.path('/', (req, res) => res.redirect('/items'))

    const items = crayon.group('/items')    
    items.path('/', (req, res) => res.redirect('/items/pending'))

    items.path('/add/', 
        animate.route([
            { from: '/**', name: transition.pushUp },
            { to:   '/**', name: transition.popDown }
        ]), (req, res) => {
            return res.mount(pages.AddItem(app, pending))
        }
    )

    items.path('/:status', (req, res) => {
        return res.mount(pages.Items(app, pending, complete))
    })

    app.use(items)
    app.load()
}()
