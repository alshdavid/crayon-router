import * as crayon from 'crayon'
import * as svelte from 'crayon/svelte'
import Base from './pages/Base.svelte';
import More from './pages/More.svelte';

const outlet = document.getElementById('app')
const app = crayon.create() 

app.use(svelte.router(outlet))

app.path('/', (req, res) => res.redirect('/home'))

app.path('/home', (req, res) => 
    res.mount(Base, { req, nav: app })
)

app.path('/about', (req, res) =>
    res.mount(Base, { req, nav: app })
)

app.path('/more', (req, res) =>
    res.mount(More, { req, nav: app })
) 

app.load()

