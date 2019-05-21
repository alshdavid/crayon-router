import "babel-polyfill"
import * as crayon from '../src/router/index'

const app = crayon.create()

app.path('/', (req, res) => console.log('/', req))
app.path('/a', (req, res) => console.log('/a', req))
app.path('/b/:id', (req, res) => {
    console.log('fresh')
    ;(window as any).show = () => console.log(req)
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