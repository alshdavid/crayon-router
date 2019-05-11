import crayon from 'crayon'
import svelte from 'crayon/svelte'
import Base from './pages/Base.svelte';
import More from './pages/More.svelte';

const app = crayon.create() 

const target = document.getElementById('app')
app.use(svelte.router(target))

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

