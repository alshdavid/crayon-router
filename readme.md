# Crayon

<img align="right" width="350px" src="https://alshdavid.github.io/crayon/docs/logo.png">

## SPA, Regardless of your Framework

- UI router for the browser
- ExpressJS like syntax
- Supports all major frameworks
- Route animations under one API
- Easy-to-write middleware

### Example

```jsx
import React from 'react'
import crayon from 'crayonjs'
import react from 'crayonjs/react'

const app = crayon.create()

app.use(react.router())

app.path('/', (req, res) => res.mount(() => <div>Hello World</div>))

app.load()
```

### Installation

```bash
# For npm users
npm install --save crayonjs

# For yarn users
yarn add crayonjs
```

### Framework

You can select your framework by using a middleware

```javascript
// React
app.use(react.router()

// Vue 
app.use(vue.router())

// Svelte 3 - TODO
app.use(svelte.router())

// Native custom elements - TODO
app.use(elements.router())

// Angular - TODO with Ivy
app.use(angular.router())
```

### Route Transitions

#### Work on all frameworks using the same API and middleware

```javascript
// Route Transitions 
// This declares "fade" is the default animation
// But going to and from /help will have custom transitions
app.use(crayon.animate({
    name: 'fade',
    duration: 5000,
    routes: [
         { from: '/**', to: '/help', name: 'push' },
         { from: '/help', to: '/**', name: 'pop' }
    ]
})

// Included route transitions are available 
// If you don't want to write CSS
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
import crayon from 'crayonjs';
import react from 'crayonjs/react';
import { usersGroup } from './users'

const app = crayon.create()

app.use(react.Router())
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

app.use(react.Router())

app.path('/', (req, res) => res.mount(MyView(dep)))

app.load()
```
