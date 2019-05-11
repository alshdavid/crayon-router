import crayon from 'crayon'
import transition from 'crayon/transition';
import svelte from 'crayon/svelte'
import Base from './pages/Base.svelte';
import More from './pages/More.svelte';

const app = crayon.create() 

const target = document.getElementById('app')
app.use(svelte.router(target))

app.use(transition.loader())
app.use(crayon.animate({
    name: transition.fade,
    duration: 300,
    routes: [
        { from: '/**', to: '/more', name: transition.slideLeft },
        { from: '/more', to: '/**', name: transition.slideRight }
    ]
}))

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

