# Crayon
## React middleware

Simply load the react middleware, then pass React components to the `mount` functions inside your handlers

```jsx
import React from 'react'
import crayon from 'crayon'
import react from 'crayon/react'

const app = crayon.create()

app.use(react.router())

app.path('/', (req, res) => res.mount(() => <div>Hello World</div>))

app.load()
```

### Dealing With Dependencies

I recomend using a parameter injection model for dependency injection

```jsx
export const MyView = (dep) => () => <div>{ dep.value }<div>
```

```javascript
import crayon from 'crayon'
import react from 'crayon/react'
import { MyView } from './views'

const dep = { value: 'hello world' }
const app = crayon.create()

app.use(react.router())

app.path('/', (req, res) => res.mount(MyView(dep)))

app.load()
```