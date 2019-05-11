# Crayon
## Vue middleware

### Getting started

_Simply used the supplied middleware_

```javascript
const app = crayon.create()
app.use(vue.router())
```

### Example using Vue file components

`HomeAndAbout.vue`

```html
<template>
  <main>
    <h1>{{ req.pathname }}</h1>
    <div class="hello">
      <a @click="nav.navigate('/home')">Home</a>
      <a @click="nav.navigate('/about')">About</a>
    </div>
  </main>
</template>

<script>
export default {
  props: {
    nav: null,
    req: null
  }
}
</script>
```
`main.js`

```javascript
import crayon from 'crayon'
import vue from 'crayon/vue'
import HelloWorld from './HomeAndAbout.vue';

const app = crayon.create()

app.use(vue.router())

app.path('/', (req, res) => 
    res.redirect('/home')
)

app.path('/home', (req, res) => 
    res.mount(() => HelloWorld, { nav: r, req })
)

app.path('/about', (req, res) => 
  res.mount(() => HelloWorld, { nav: r, req })
)

r.load()
```

### Example using object-based components

```javascript
import crayon from 'crayon'
import vue from 'crayon/vue'
import './styles.css'

const HomeAndAbout = (router, req, someService) => ({
    data: () => ({
        req,
        router,
        someService
    }),
    template:  
    /* html */
    `<div>
        <h1>{{ req.pathname }}</h1>
        <nav>
            <a @click="router.navigate('/home')">Home</a>
            <a @click="router.navigate('/about')">About</a>
        </nav>
        <p>{{ someService.getData() }}</p>
    </div>`
})

const someService = {
    getData: () => 'Some data or something from your service'
}
const app = crayon.create()

app.use(vue.router())

app.path('/', (req, res) => 
    res.redirect('/home')
)

app.path('/home', (req, res) => 
    res.mount(HomeAndAbout(app, req, someService))
)

app.path('/about', (req, res) => 
    res.mount(HomeAndAbout(app, req, someService))
)

app.load()
```



### Example using Vue file components with TypeScript

`HomeAndAbout.vue`

```html
<template>
  <main>
    <h1>{{ req.pathname }}</h1>
    <div class="hello">
      <a @click="nav.navigate('/home')">Home</a>
      <a @click="nav.navigate('/about')">About</a>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import crayon from 'crayon'

@Component
export default class HomeAndAbout extends Vue {
  @Prop() 
  private nav!: crayon.Navigator;

  @Prop() 
  private req!: crayon.Request;
}
</script>
```
`main.ts`

```typescript
import * as crayon from 'crayon'
import * as vue from 'crayon/vue'
import HelloWorld from './HomeAndAbout.vue';

const app = crayon.create()

app.use(vue.router())

app.path('/', (req, res) => 
    res.redirect('/home')
)

app.path('/home', (req, res) => 
    res.mount(() => HelloWorld, { nav: r, req })
)

app.path('/about', (req, res) => 
  res.mount(() => HelloWorld, { nav: r, req })
)

r.load()
```

### Lazy Loading a route

Just use the dynamic `import()` feature.
It's baked into modern browsers and available through module bundlers.

`main.ts`

```typescript
import * as crayon from 'crayon'
import * as vue from 'crayon/vue'

const app = crayon.create()

app.use(vue.router())

app.path('/home', async (req, res) => 
    const HelloWorld = await import('./HomeAndAbout.vue')
    res.mount(() => HelloWorld, { nav: r, req })
)

r.load()
```

### Dealing With Dependencies

I recomend using a parameter injection model for dependency injection.
Generally I'll use object components because I can wrap them in functions allowing me
to pass in dependencies.

In the case of vue files, the second paramter of the mount method allows you to map values
to the component's props.

```html
<template>
  <main>
    {{ prop.value }}
  </main>
</template>

<script>
export default {
  props: {
    dep: null,
  }
}
</script>

```

```javascript
import crayon from 'crayon'
import vue from 'crayon/vue'
import MyPage from './MyPage'

const dep = { value: 'hello world' }
const app = crayon.create()

app.use(react.router())

app.path('/', (req, res) => res.mount(MyPage, { dep }))

app.load()
```

### Transitions

Use the standard animations middleware to add animations
These are just preset css classes/styles.
Check out the transitions docs to learn how you can make your own.

```javascript
import crayon from 'crayon';
import vue from 'crayon/vue';
import transition from 'crayon/transition';

const app = crayon.create()

app.use(vue.router())
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
