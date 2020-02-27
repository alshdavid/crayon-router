<img align="left" width="350px" src="https://cdn.davidalsh.com/crayon/logo.png">
<img align="right" width="350px" src="https://cdn.davidalsh.com/crayon/crayon.gif">

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
<br>
<br>

## SPA Router, for all Frameworks

![version](https://cdn.davidalsh.com/crayon/badges/version.svg)
![size](https://cdn.davidalsh.com/crayon/badges/size.svg)
![coverage](https://img.shields.io/badge/license-MIT-green.svg?cacheSeconds=2592000)
![dependencies](https://img.shields.io/badge/dependencies-0-orange.svg?cacheSeconds=2592000)
![coverage](https://img.shields.io/badge/test%20coverage-91.42%25-green.svg?cacheSeconds=2592000)

- Clientside Router
- Express like syntax
- Select your framework with middleware
- Select your animations with middleware
- No dependencies

### Example

```jsx
import React from 'react'
import crayon from 'crayon'
import react from 'crayon-react'

const app = crayon.create()

app.use(react.router())

app.path('/', ctx => {
    return ctx.mount(() => <h1>Hello World</h1>)
})

app.path('/users/:id', ctx => {
    return ctx.mount(() => <div>Hi { ctx.params.id }!</div>)
})

app.path('/**', ctx => {
    return ctx.mount(() => <div>Not Found!</div>)
})

app.load()
```

To nagivate use:

```javascript
app.navigate('/users/27')
```

### Introduction and Explanation

Crayon is a simple client-side UI router that uses a time-tested and familiar pattern to route actions based on browser paths.

The routing style is seen in serverside frameworks like Express in Node and Gin in Go, so it's nothing new - but a tool I felt browser-based applications were lacking.

While the router itself is only responsible for running a callback which it selects based on pattern matching the browser's path, you are able to compose behaviours using middleware.

This means that the front-end framework or animations you choose are a middleware concern, not a routing concern.

*The philosophy behind Crayon is to ask less of our front-end frameworks, but get more*

[Contributing Guide](docs/contributing.md)

### Installing



```bash
npm install --save crayon
```

### Framework Middlewares

<br>
<img width="150px" src="https://cdn.davidalsh.com/frameworks/react.png">
<br>

```bash
npm install --save crayon-react
```

```javascript
import react from 'crayon-react'
app.use(react.router())
```
<br>
<img width="190px" src="https://cdn.davidalsh.com/frameworks/preact.png">
<br>

```bash
npm install --save crayon-preact
```

```javascript
import preact from 'crayon-preact'
app.use(preact.router())
```

<br>
<img width="150px" src="https://cdn.davidalsh.com/frameworks/vue.png">
<br>

```bash
npm install --save crayon-vue
```

```javascript
import vue from 'crayon-vue'
app.use(vue.router())
```

<br>
<img width="150px" src="https://svelte.dev/svelte-logo-horizontal.svg">
<br>

```bash
npm install --save crayon-svelte
```

```javascript
import svelte from 'crayon-svelte'
app.use(svelte.router())
```
<br>

### Coming soon

<br>
<img width="200px" src="https://cdn.davidalsh.com/frameworks/angular.png">
<br>
<img width="240px" src="https://cdn.davidalsh.com/frameworks/customElements.png">
<br>


### Route Groups

Groups are created using the `crayon.group` function, which creates a middleware
of groups that you can use later

```javascript
const items = crayon.group('/items')

items.use(your.middleware())

// This will be "/items"
items.path('/', ctx =>
    ctx.mount(views.ItemsView)
)

// This will be "/items/add"
items.path('/add', ctx =>
    ctx.mount(views.ItemsAddView)
)

app.use(items)
app.load()
```

It also supplies an optional callback with the group object. This allows you to define variables within a scope dedicated to that group.

```javascript
const items = crayon.group('/items', group => {
    group.use(your.middleware())

    group.path('/', ctx =>
        ctx.mount(views.ItemsView)
    )

    group.path('/add', ctx =>
        ctx.mount(views.ItemsAddView)
    )
})

app.use(items)
app.load()
```

### Route parameters and observing changes

You can add paramaters in the route path and observe the changes.
The observe method is used to prevent rerenders which can cause problems
when dealing with nested routers and components that require preserved state

For the sake of reducing external dependencies and package size, I am not using
rxjs. This uses a portion of the rxjs API to enable dealing with event streams.

In future, I intend to create a middleware that implements rxjs, allowing you to pipe
the stream into their operators/utilities (like .map() and .filter())

```jsx
app.path('/users/:id', ctx => {
    let id = ctx.params.id

    // subscribe to the event steam and pull out the
    // "ProgressEnd" event
    const sub = app.events.subscribe(event => {
       if (event.type === RouterEventType.ProgressEnd) {
           id = ctx.params.id
       }
    })

    // A callback the router fires when you
    // navigate away from this page
    ctx.onLeave(() => sub.unsubscribe())
})
```

### Nested routers

They work just fine, just be sure to destroy a router before leaving a page

```javascript
const app = crayon.create('main')
app.path('/dashboard/:tab', handler)

const nested = crayon.create('tab-view')
nested.path('/dashboard/tab-a', handler)
nested.path('/dashboard/tab-b', handler)
nested.destroy()
```

You would setup the nested router inside your component, targeting an element
reference to obtain a mount-point

Take a look at the example in `/examples/crayon-react-app`. It is the demo in the
readme gif and features a nested router as the tab view.

### Animations Middleware

#### This works on all frameworks

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
To declare defaults, use the following:

```bash
npm install --save crayon-animate
```

```javascript
import animate from 'crayon-animate'

app.use(animate.defaults({
    name: 'css-class-name',
    duration: 350
}))
```

You can specify custom rules for a few routes:

```javascript
import animate from 'crayon-animate'

app.use(animate.routes([
    { from: '/a',  to: '/b',  name: 'slide-left' },
    { from: '/b',  to: '/a',  name: 'slide-right' },
    { from: '/**', to: '/c',  name: 'fade' },
    { from: '/c',  to: '/**', name: 'fade' }
]))
```

When provided inline on a route, you can omit the respecive to/from

```jsx
import animate from 'crayon-animate'

app.use(animate.defaults({
    name: 'fade',
    duration: 350
}))

app.path('/a', ctx => ctx.mount(() => <div>Route A</div>))
app.path('/b', ctx => ctx.mount(() => <div>Route B</div>))

// If you come from anywhere to /c slide-right
// If you go to anywhere from /c slide-left
app.path('/c',
    animate.route([
        { from: '/**', name: 'slide-right' },
        { to:   '/**', name: 'slide-left' }
    ]),
    ctx => {
        return ctx.mount(() => <div>Animated</div>)
    }
)
```

#### Animations package

For those who don't want to spend time writing animations, Crayon comes bundled with a bunch.

```bash
npm install --save crayon-transition
```

Just use the middleware
```javascript
import animate from 'crayon-animate'
import transition from 'crayon-transition'

app.use(transition.loader())
app.use(animate.defaults({
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
app.path('/', async ctx => {
    const HomeView = await import('./home-view')
    ctx.mount(HomeView)
})
```

#### Code splitting a group

First create a group in a file

```javascript
// my-group.js
export const myGroup = crayon.group('/my-group', myGroup => {
    myGroup.path('/',
        ctx => ctx.mount(MyView)
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
    app.path('/my-group', async ctx => {
        const { myGroup } = await import('./my-group')
        app.use(myGroup)
        app.load()
    })

    app.load()
}()
```
