import * as crayon from 'crayon'
import * as vue from 'crayon/vue'
import Route from './pages/Route.vue';
import More from './pages/More.vue';
import './styles.css'

const outlet = document.getElementById('app')
const app = crayon.create()

app.use(vue.router(outlet))

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