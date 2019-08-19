import crayon from 'crayon';
import react from 'crayon-react';
import transition from 'crayon-transition';
import animate from 'crayon-animate';
import * as pages from './pages'
import './index.css'

const app = crayon.create()
const outlet = document.getElementById('app')

app.use(react.router(outlet))
app.use(transition.loader())
app.use(animate.defaults({
    name: transition.fade,
    duration: 300,
}))
app.use(animate.routes([
    { from: '/**',   to: '/more', name: transition.slideLeft  },
    { from: '/more', to: '/**',   name: transition.slideRight }
]))

app.path('/', (req, res) => res.redirect('/home'))

app.path('/home', (req, res) => 
    res.mount(pages.Route(req, app))
)

app.path('/about', (req, res) =>
    res.mount(pages.Route(req, app))
)

app.path('/more', (req, res) =>
    res.mount(pages.More(req, app))
) 

app.load()