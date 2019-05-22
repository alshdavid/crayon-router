<img align="left" width="350px" src="https://alshdavid.github.io/crayon/docs/logo.png">
<img align="right" width="350px" src="https://alshdavid.github.io/crayon/docs/crayon.gif">

<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>


## Client-Side Router, for all Frameworks

![version](https://img.shields.io/badge/version-{{version}}-blue.svg?cacheSeconds=2592000)
![coverage](https://img.shields.io/badge/size-15kb-green.svg?cacheSeconds=2592000)
![coverage](https://img.shields.io/badge/license-MIT-green.svg?cacheSeconds=2592000)
![dependencies](https://img.shields.io/badge/dependencies-0-orange.svg?cacheSeconds=2592000)

- Clientside UI Router
- ExpressJS like syntax
- Supports all major frameworks
- Route animations under one API
- Easy-to-write middleware
- No dependencies

### Example

```jsx
import React from 'react'
import crayon from 'crayon'
import react from 'crayon/react'

const app = crayon.create()

app.use(react.router())

app.path('/', (req, res) => res.mount(() => <div>Hello World</div>))

app.load()
```

### Installation


```bash
# For npm users
npm install --save crayon

# For yarn users
yarn add crayon
```

### Framework

You can select your framework by using a middleware

```javascript
// React (Supports Preact and Solid.js)
app.use(react.router()

// Vue
app.use(vue.router())

// Svelte 3
app.use(svelte.router())

// Native custom elements - TODO
app.use(elements.router())

// Angular - TODO (Waiting on Ivy)
app.use(angular.router())
```

### Route Groups

Groups are created using the `crayon.group` function, which creates a middleware
of groups that you can use later

```javascript
const items = crayon.group('/items')

items.use(your.middleware())

// This will be "/items"
items.path('/', (req, res) =>
    res.mount(views.ItemsView)
)

// This will be "/items/add"
items.path('/add', (req, res) =>
    res.mount(views.ItemsAddView)
)

app.use(items)
app.load()
```

It also supplies an optional callback with the group object. This allows you to define variables within a scope dedicated to that group.

```javascript
const items = crayon.group('/items', group => {
    group.use(your.middleware())

    group.path('/', (req, res) =>
        res.mount(views.ItemsView)
    )

    group.path('/add', (req, res) =>
        res.mount(views.ItemsAddView)
    )
})

app.use(items)
app.load()
```

### Route Transitions

#### This single API works on all frameworks

Route Transitions are done using a middleware that
applies/removes CSS styles over the course of a routing
event.

You specify the "name" of the CSS class and the middleware
will add/remove the following classes:

```css
.name
.name-exit
.name-enter
.name-enter-done
.name-enter-first
```

The middleware can be placed on the global level, on a group or inline on the route itself.

```javascript
app.use(crayon.animate(animation))

group.use(crayon.animate(animation))

app.path('/your-path',
    crayon.animate(animation),
    (req, res) => res.mount(() => <div>Animated</div>)
)
```

To declare defaults, use the following:

```javascript
crayon.animate({
    name: 'css-class-name',
    duration: 350
})
```

You can specify defaults but add custom rules for a few routes:
```javascript
crayon.animate({
    name: 'css-class-name',
    duration: 350,
    routes: [
        { from: '/a',  to: '/b',  name: 'slide-left' },
        { from: '/b',  to: '/a',  name: 'slide-right' },
        { from: '/**', to: '/c',  name: 'fade' },
        { from: '/c',  to: '/**', name: 'fade' }
    ]
})
```

You can extend existing routing by using the middleware more than
once

```javascript
app.use(crayon.animate({
    name: 'css-class-name',
    duration: 350
}))

// The middleware will assume an array is route definitions
app.use(crayon.animate([
    { from: '/a',  to: '/b',  name: 'slide-left' },
    { from: '/b',  to: '/a',  name: 'slide-right' },
    { from: '/**', to: '/c',  name: 'fade' },
    { from: '/c',  to: '/**', name: 'fade' }
]))
```

When provided inline on a route, you can omit the respecive to/from

```jsx
app.use(crayon.animate({
    name: 'fade',
    duration: 350
}))

app.path('/a', (req, res) => res.mount(() => <div>Route A</div>))
app.path('/b', (req, res) => res.mount(() => <div>Route B</div>))

// If you come from anywhere to /c slide-right
// If you go to anywhere from /c slide-left
app.path('/c',
    crayon.animate([
        { from: '/**', name: 'slide-right' },
        { to:   '/**', name: 'slide-left' }
    ]),
    (req, res) => res.mount(() => <div>Animated</div>)
)
```

#### Animations package

For those who don't want to spend time writing animations, Crayon comes bundled with a bunch.


Just use the middleware
```javascript
import * as transition from 'crayon/transition';

app.use(transition.loader())
app.use(crayon.animate({
    name: transition.pushLeft,
    duration: 350
}))
```

#### Available bundled animations

```javascript
transition.fade

transition.pushUp
transition.pushDown
transition.pushLeft
transition.pushRight

transition.popUp
transition.popDown
transition.popLeft
transition.popRight

transition.slideUp
transition.slideDown
transition.slideLeft
transition.slideRight
```



### Code Spliting and Lazy Loading

Just use the dynamic `import()` feature.
It's baked into modern browsers and available through module bundlers.

#### Loading a route

```javascript
app.path('/', async (req, res) => {
    const HomeView = await import('./home-view')
    res.mount(HomeView)
})
```

#### Code splitting a group

First create a group in a file

```javascript
// my-group.js
export const myGroup = crayon.group('/my-group', myGroup => {
    myGroup.path('/',
        (req, res) => res.mount(MyView)
    )
})
```

Then load it in and use it

```javascript
// main.js
void async function main() {
    const app = crayon.create()
    app.use(framework.loader())

    const { myGroup } = await import('./my-group')
    app.use(myGroup)

    app.load()
}()
```

Lazy loading a group just requires you to trigger the load action
inside a route handler

```javascript
// main.js
void async function main() {
    const app = crayon.create()
    app.use(framework.loader())

    // This will wait until the user is on /my-group
    // before fetching and loading the routes into
    // the browser
    app.path('/my-group', async (req, res) => {
        const { myGroup } = await import('./my-group')
        app.use(myGroup)
        app.load()
    })

    app.load()
}()
```

### Dealing With Dependencies

I recomend using a parameter injection model for dependency injection

```jsx
export const MyView = (dep) => () => <div>{ dep.value }<div>
```

```javascript
import * as crayon from 'crayon';
import * as react from 'crayon/react';
import { MyView } from './views'

const dep = { value: 'hello world' }
const app = crayon.create()

app.use(react.Router())

app.path('/', (req, res) => res.mount(MyView(dep)))

app.load()
```
