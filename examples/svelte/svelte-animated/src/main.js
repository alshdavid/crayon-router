import crayon from 'crayon'
import transition from 'crayon-transition';
import animate from 'crayon-animate';
import svelte from 'crayon-svelte'
import Base from './pages/Base.svelte';
import More from './pages/More.svelte';

const outlet = document.getElementById('app')
const app = crayon.create()

app.use(svelte.router(outlet))
app.use(transition.loader())
app.use(animate.defaults({
    name: transition.fade,
    duration: 300
}))
app.use(animate.routes([
    { from: '/**', to: '/more', name: transition.slideLeft },
    { from: '/more', to: '/**', name: transition.slideRight }
]))

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
