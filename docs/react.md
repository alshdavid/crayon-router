# Crayon
## React middleware

### Getting started

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import * as crayon from 'crayonjs'
import * as react from 'crayonjs/react'

const app = crayon.create()

app.use(react.router())

app.path('/', (req, res) => res.mount(() => <div>Hello World</div>))

app.load()
```

### Lazy Loading

Lazy loading simply requires you to use the latest JavaScript dynamic module feature `import()`

```javascript
app.path('/', async (req, res) => {
    const HomeView = await import('./home-view')
    res.mount(HomeView)
})
```

### Route Groups

Groups (at least at this stage) are simply functions that take a `router` instance and register their routes.

```javascript
import { UsersView, UsersDetailView } from './views'

const usersGroup = (app) => {
    app.path('/users', (req, res) =>
        res.mount(UsersView)
    )

    app.path('/users/:id', (req, res) =>
        res.mount(UsersDetailView)
    )
}
```

```javascript
import * as crayon from 'crayonjs';
import * as react from 'crayonjs/react';
import { usersGroup } from './users'

const app = crayon.create()

app.use(react.router())
usersGroup(app)

app.path('/', (req, res) =>
    res.mount(views.HomeView)
)

app.load()
```

### Dealing With Dependencies

I recomend using a parameter injection model for dependency injection

```jsx
export const MyView = (dep) => () => <div>{ dep.value }<div>
```

```javascript
import * as crayon from 'crayonjs';
import * as react from 'crayonjs/react';
import { MyView } from './views'

const dep = { value: 'hello world' }
const app = crayon.create()

app.use(react.router())

app.path('/', (req, res) => res.mount(MyView(dep)))

app.load()
```

### Transitions

Use the standard animations middleware to add animations
These are just preset css classes/styles.
Check out the transitions docs to learn how you can make your own.

```javascript
import crayon from 'crayonjs';
import react from 'crayonjs/react';
import transition from 'crayonjs/transition';

const app = crayon.create()

app.use(react.router())
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