# Pico Router
## _A Client Side Router for SPAs, MPAs supporting all Frameworks_

- Client Side Router
- Express-like syntax
- Select your framework with middleware
- Select your animations with middleware
- No dependencies
- Tiny and efficent

### Example

```jsx
import React from 'react'
import pico from '@pico-router/core'
import reactPico from '@pico-router/react'

const app = new pico.Router()

// Framework support through middleware 
app.use(reactPico.middleware())

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

Pico router is a simple client-side UI router that uses a time-tested and familiar pattern to route actions based on browser paths.

The routing style is seen in serverside frameworks like Express in Node and Gin in Go, so it's nothing new - but a tool I felt browser-based applications were lacking.

While the router itself is only responsible for running a callback which it selects based on pattern matching the browser's path, you are able to compose behaviours using middleware.

This means that the front-end framework or animations you choose are a middleware concern, not a routing concern.

*The philosophy behind Pico router is to ask less of our front-end frameworks and get more*

### Installing

```bash
npm install --save @pico-router/core
```

### Framework Middlewares

<br>
<img width="150px" src="https://cdn.davidalsh.com/frameworks/react.png">
<br>

```bash
npm install --save @pico-router/react
```

```javascript
import reactPico from '@pico-router/react'
app.use(reactPico.router())
```