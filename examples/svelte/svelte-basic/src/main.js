import crayon from 'crayon'
import svelte from 'crayon-svelte'
import Base from './pages/Base.svelte';
import More from './pages/More.svelte';

const outlet = document.getElementById('app')
const app = crayon.create()

app.use(svelte.router(outlet))

app.path('/', (req, res) => req.redirect('/home'))

app.path('/home', (req, res) =>
    req.mount(Base, { req, nav: app })
)

app.path('/about', (req, res) =>
    req.mount(Base, { req, nav: app })
)

app.path('/more', (req, res) =>
    req.mount(More, { req, nav: app })
)

app.load()
