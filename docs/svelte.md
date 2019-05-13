# Crayon
## Svelte middleware

Simply load the svelte middleware, then pass Svelte components to the `mount` functions inside your handlers

```javascript
import crayon from 'crayon'
import svelte from 'crayon/svelte'
import Page from './Page.svelte'

const app = crayon.create()
app.use(svelte.router())

app.path('/', (req, res) => res.mount(Page)

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