# Crayon
## Vue middleware

### Getting started

_Simply used the supplied middleware_

Pass Vue components to the `mount` functions inside your handlers. The second argument will provide props to your components.

```javascript
/*
    If no target is supplied the router will set up inside <body>
    If no name is supplied the router will create a random one
*/
const target = document.getElementById('app')
const app = crayon.create('router-name') 

app.use(vue.router(target))
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

app.path('/', ctx => res.redirect('/home'))

app.path('/home', ctx => {
  return res.mount(() => HelloWorld, { nav: r, req })
})

app.path('/about', ctx => {
  return res.mount(() => HelloWorld, { nav: r, req })
})

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

app.path('/', ctx => res.redirect('/home'))

app.path('/home', ctx => {
  return res.mount(HomeAndAbout(app, req, someService))
})

app.path('/about', ctx => {
  return res.mount(HomeAndAbout(app, req, someService))
})

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

app.path('/', ctx => res.redirect('/home'))

app.path('/home', ctx => {
  return res.mount(() => HelloWorld, { nav: r, req })
})

app.path('/about', ctx => {
  return res.mount(() => HelloWorld, { nav: r, req })
})

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

app.path('/', ctx => {
  return res.mount(MyPage, { dep })
})

app.load()
```
