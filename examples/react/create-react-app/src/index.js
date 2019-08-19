import crayon from 'crayon';
import react from 'crayon-react';
import * as pages from './pages'
import { AppContext, AppState } from './context'
import './index.css'

const outlet = document.getElementById('app')
const router = crayon.create()
AppState.router = router

router.use(react.router(outlet))
router.use(react.withContext(AppContext, AppState))

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