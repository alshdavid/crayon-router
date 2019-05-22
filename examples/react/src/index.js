import crayon from '../../dist';
import react from '../../dist/react';
import * as pages from './pages'
import './index.css'

const app = crayon.create()

app.use(react.router())

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