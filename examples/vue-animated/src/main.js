import crayon from 'crayon'
import vue from 'crayon/vue'
import transition from 'crayon/transition'
import Route from './pages/Route.vue';
import More from './pages/More.vue';
import './styles.css'

const app = crayon.create()

app.use(vue.router())
app.use(transition.loader()) 
app.use(crayon.animate({
    name: transition.fade,
    duration: 300,
    routes: [
        { from: '/**', to: '/more', name: transition.slideLeft },
        { from: '/more', to: '/**', name: transition.slideRight }
    ]
}))

app.path('/', (req, res) => 
    res.redirect('/home')
)
 
app.path('/home', (req, res) => 
    res.mount(() => Route, { nav: app, req })
)

app.path('/about', (req, res) => 
  res.mount(() => Route, { nav: app, req })
)

app.path('/more', (req, res) => 
  res.mount(() => More, { nav: app, req })
)

app.load()