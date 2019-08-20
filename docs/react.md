# Crayon
## React middleware

Simply load the react middleware, then pass React components to the `mount` functions inside your handlers

```jsx
import React from 'react'
import crayon from 'crayon'
import react from 'crayon/react'

/*
    If no target is supplied the router will set up inside <body>
    If no name is supplied the router will create a random one
*/
const target = document.getElementById('app')
const app = crayon.create('router-name') 

app.use(react.router(target))

app.path('/', (req, res) => {
    return res.mount(() => <div>Hello World</div>)
})

app.load()
```