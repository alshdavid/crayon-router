# Crayon
## Vue middleware

### Getting started

_Simply used the supplied middleware_

```javascript
const app = crayon.create()
app.use(vue.Router('#app', Vue))
app.use(vue.Animate({ name: 'fade', mode: 'out-in', childView: 'child-view' }))
```

### Example using object-based components

```javascript
import Vue from 'vue'
import * as crayon from 'crayonjs'
import * as vue from 'crayonjs/vue'
import 'styles.css'

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

app.use(vue.Router('#app', Vue))

app.path('/', (req, res) => 
    res.redirect('/home')
)

app.path('/home', (req, res) => {
    res.mount(HomeAndAbout(app, req, someService))
})

app.path('/about', (req, res) => { 
    res.mount(HomeAndAbout(app, req, someService))
})

app.load()
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
import Vue from 'vue'
import * as crayon from 'crayonjs'
import * as vue from 'crayonjs/vue'
import HelloWorld from './HomeAndAbout.vue';

const app = crayon.create()

app.use(vue.Router('#app', Vue))

app.path('/', (req, res) => 
    res.redirect('/home')
)

app.path('/home', (req, res) => {
    res.mount(() => HelloWorld, { nav: r, req })
})

app.path('/about', (req, res) => {
  res.mount(() => HelloWorld, { nav: r, req })
})

r.load()
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
import * as crayon from 'crayonjs'

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
import Vue from 'vue'
import * as crayon from 'crayonjs'
import * as vue from 'crayonjs/vue'
import HelloWorld from './HomeAndAbout.vue';

const app = crayon.create()

app.use(vue.Router('#app', Vue))

app.path('/', (req, res) => 
    res.redirect('/home')
)

app.path('/home', (req, res) => {
    res.mount(() => HelloWorld, { nav: r, req })
})

app.path('/about', (req, res) => {
  res.mount(() => HelloWorld, { nav: r, req })
})

r.load()
```

### Lazy Loading a route

Just use the `import` statement with Webpack+Babel or Typescript

`main.ts`

```typescript
import Vue from 'vue'
import * as crayon from 'crayonjs'
import * as vue from 'crayonjs/vue'

const app = crayon.create()

app.use(vue.Router('#app', Vue))

app.path('/home', async (req, res) => {
    const HelloWorld = await import('./HomeAndAbout.vue')
    res.mount(() => HelloWorld, { nav: r, req })
})

r.load()
```

### Animations

Use the animations middleware to add animations

```javascript
app.use(vue.Animate({ 
    name: 'fade', 
    mode: 'out-in', 
    childView: 'child-view' 
}))
```

Make sure to add the appropriate CSS for the animations

```css
.fade-enter-active, .fade-leave-active {
    transition: opacity 1s ease;
}
.fade-enter, .fade-leave-active {
    opacity: 0;
}
.child-view {
    position: absolute;
    transition: all 1s cubic-bezier(.55,0,.1,1);
}
```