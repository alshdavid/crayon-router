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
To declare defaults, use the following:

```javascript
import animation from 'crayon/animation'

app.use(animate.defaults({
    name: 'css-class-name',
    duration: 350
}))
```

You can specify custom rules for a few routes:

```javascript
import animation from 'crayon/animation'

app.use(animate.routes([
    { from: '/a',  to: '/b',  name: 'slide-left' },
    { from: '/b',  to: '/a',  name: 'slide-right' },
    { from: '/**', to: '/c',  name: 'fade' },
    { from: '/c',  to: '/**', name: 'fade' }
]))
```

When provided inline on a route, you can omit the respecive to/from

```jsx
import animation from 'crayon/animation'

app.use(animate.defaults({
    name: 'fade',
    duration: 350
}))

app.path('/a', ctx => res.mount(() => <div>Route A</div>))
app.path('/b', ctx => res.mount(() => <div>Route B</div>))

// If you come from anywhere to /c slide-right
// If you go to anywhere from /c slide-left
app.path('/c',
    animate.route([
        { from: '/**', name: 'slide-right' },
        { to:   '/**', name: 'slide-left' }
    ]),
    ctx => {
        return res.mount(() => <div>Animated</div>)
    }
)
```

#### Animations package

For those who don't want to spend time writing animations, Crayon comes bundled with a bunch.


Just use the middleware
```javascript
import animation from 'crayon/animation'
import transition from 'crayon/transition'

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