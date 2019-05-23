# Crayon
## Svelte middleware

Simply load the svelte middleware, then pass Svelte components to the `mount` functions inside your handlers

```javascript
import crayon from 'crayon'
import svelte from 'crayon/svelte'
import Page from './Page.svelte'

/*
    If no target is supplied the router will set up inside <body>
    If no name is supplied the router will create a random one
*/
const target = document.getElementById('app')
const app = crayon.create('router-name') 

app.use(svelte.router(target))

app.path('/', (req, res) => {
	return res.mount(Page)
})

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

app.path('/', (req, res) => {
	return res.mount(MyView, { dep }))
})

app.load()
```