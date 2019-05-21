import "babel-polyfill"
import * as crayon from '../src/router/index'

const app = crayon.create()

app.path('/', (req, res) => console.log('/', req))
app.path('/a', (req, res) => console.log('/a', req))
app.path('/b/:id', (req, res) => {
    const sub = app.events.subscribe(console.log)
    
    res.onUnmount(() => sub.unsubscribe())

    console.log('fresh', app.history.currentRoute)
})

app.load()
;(window as any).app = app


// const app2 = crayon.create()

// app2.path('/e', (req, res) => console.log('E'))
// app2.path('/f', (req, res) => console.log('F'))
// app2.path('/g', (req, res) => console.log('G')) 
// app2.path('/h', (req, res) => console.log('H')) 

// app2.load()

// ;(window as any).app2 = app2