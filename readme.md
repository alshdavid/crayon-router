# Express JS API for the Browser!
## Simple framework agnostic UI router for SPAs

_This is for usage inside the browser, use it with React, Vue, Svelte, CustomElements_

This router aims to mimic ExpressJS's API in the form of a SPA router for web apps to use.
Unopinionated, focused and simple to use.

Basic example with React

```typescript
import * as express from 'express-browser';
import * as views from '~/gui/views'

const app = express.create()

app.use(express.React('#app'))

app.path('/', (req, res) => res.redirect('/home'))

app.path('/home', (req, res) =>
    res.mount(views.HomeView)
)

app.load()
```

Using middleware, you can instruct the router how to mount your component

```typescript
app.use(express.React('#app'))
app.use(express.Vue('#app')) // TODO
app.use(express.Svelte('#app')) // TODO
app.use(express.CustomElement('#app')) //TODO
app.use(express.Angular('#app')) // TODO
```

You can mix/match frameworks on a per-route basis, this can help with the migration drama you experience when moving between framework versions.
Another use case is when working on enterprise scale applications, you can split routes into lazy loaded groups.

```typescript
app.path('/react-page', (req, res) => express.React('#app'), res.mount(ReactComponent))
app.path('/vue-page', (req, res) => express.Vue('#app'), res.mount(VueComponent))
```

Groups
```typescript
import * as views from '~/gui/views'

const usersGroup = (app) => {
    app.path('/users', (req, res) =>
        res.mount(views.UsersView)
    )

    app.path('/users/:id', (req, res) =>
        res.mount(views.UsersDetailView)
    )
}
```

```typescript
import * as express from 'express-browser';
import { usersGroup } from '~/gui/users'

const app = express.create()

app.use(express.React('#app'))
usersGroup(app)

app.path('/', (req, res) => res.redirect('/home'))

app.path('/home', (req, res) =>
    res.mount(views.HomeView)
)

app.load()
```

Example passing dependenices to your routed component

```tsx
export const MyView = (dep) => () => <div>{ dep.value }<div>
```

```typescript
import * as express from 'express-browser';
import * as views from '~/gui/views'

const dep = { value: 'hello world' }
const app = express.create()

app.use(express.React('#app'))

app.path('/', (req, res) => res.mount(views.MyView(dep)))

app.load()
```