import crayon from 'crayon';
import react from 'crayon-react';
import * as pages from './pages'
import { AppContext, ctx } from './context'
import './styles.scss'

const outlet = document.getElementById('router-outlet')
const router = crayon.create()
ctx.router = router

router.use(react.router(outlet))
router.use(react.withContext(AppContext, ctx))

router.path('/', (req, res) => res.redirect('/home'))

router.path('/home', (req, res) => 
    res.mount(pages.Route)
)

router.path('/about', (req, res) =>
    res.mount(pages.Route)
)

router.path('/more', (req, res) =>
    res.mount(pages.More)
) 

router.load()