import "babel-polyfill"
import * as crayon from '../src'

const app = crayon.create()

app.path('/', (req, res) => {
    return res.mount('Home')
})


app.path('/**', (req, res) => {
    return res.mount('Not home')
})

app.load()

;(window as any).app = app