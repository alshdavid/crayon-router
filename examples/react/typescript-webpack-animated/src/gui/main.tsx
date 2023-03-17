import "./styles.scss"
import crayon from "crayon"
import crayonReact from "crayon-react"
import transition from "crayon-transition"
import animate from "crayon-animate"
import * as pages from "./pages"
import { AppContext, ctx } from "./context"

const outlet = document.getElementById("router-outlet")
const router = crayon.create()
ctx.router = router

router.use(crayonReact.router(outlet))
router.use(crayonReact.withContext(AppContext, ctx))
router.use(transition.loader())
router.use(
  animate.defaults({
    name: transition.fade,
    duration: 1000
  })
)
router.use(
  animate.routes([
    { from: "/**", to: "/more", name: transition.slideLeft },
    { from: "/more", to: "/**", name: transition.slideRight }
  ])
)

router.path("/", 
  (ctx) => ctx.redirect("/home")
)

router.path("/home", 
  (ctx) => ctx.mount(pages.Route)
)

router.path("/about", 
  (ctx) => ctx.mount(pages.Route)
)

router.path("/more", 
  (ctx) => ctx.mount(pages.More)
)

router.load()
