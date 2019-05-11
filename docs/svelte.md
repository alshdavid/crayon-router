# Crayon
## Svelte middleware

### Getting started

```javascript
import crayon from 'crayon'
import svelte from 'crayon/svelte'
import Page from './Page.svelte'

const app = crayon.create()
app.use(svelte.router())

app.path('/', (req, res) => res.mount(Page)

app.load()
```

### Lazy Loading

Just use the dynamic `import()` feature.
It's baked into modern browsers and available through module bundlers.

```javascript
app.path('/', async (req, res) => {
    const Home = await import('./Home.svelte')
    res.mount(Home)
})
```

### Route Groups

Groups (at least at this stage) are simply functions that take a `router` instance and register their routes.

```javascript
import Users from './views/Users.svelte'
import UsersDetail from './views/UsersDetail.svelte'

const usersGroup = (app) => {
    app.path('/users', (req, res) =>
        res.mount(Users)
    )

    app.path('/users/:id', (req, res) =>
        res.mount(UsersDetail)
    )
}
```

```javascript
import crayon from 'crayon'
import svelte from 'crayon/svelte'
import { usersGroup } from './users'

const app = crayon.create()

app.use(svelte.router())
usersGroup(app)

app.path('/', (req, res) =>
    res.mount(views.HomeView)
)

app.load()
```

### Dealing With Dependencies

I recomend using a parameter injection model for dependency injection

```html
<script>
	export let dep
</script>
<h1>{ dep.value }</h1>
```

```javascript
import crayon from 'crayon'
import svelte from 'crayon/svelte'
import MyView from './MyView.svelte'

const app = crayon.create()
app.use(svelte.router())

app.path('/', (req, res) => res.mount(MyView, { dep }))

app.load()
```

### Transitions

Use the standard animations middleware to add animations
These are just preset css classes/styles.
Check out the transitions docs to learn how you can make your own.

```javascript
import crayon from 'crayon';
import svelte from 'crayon/svelte';
import transition from 'crayon/transition';

const app = crayon.create()

app.use(svelte.router())
app.use(transition.loader())
app.use(crayon.animate({
    name: transition.fade,
    duration: 300,
    routes: [
        { from: '/**', to: '/more', name: transition.slideLeft },
        { from: '/more', to: '/**', name: transition.slideRight }
    ]
}))
```