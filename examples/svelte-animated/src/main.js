import * as crayon from 'crayon'
import * as transition from 'crayon/transition';
import * as animate from 'crayon/animate';
import * as svelte from 'crayon/svelte'
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
    { from: '/**',   to: '/more', name: transition.slideLeft  },
    { from: '/more', to: '/**',   name: transition.slideRight }
]))

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

