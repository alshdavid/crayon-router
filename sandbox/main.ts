import "babel-polyfill"
import * as crayon from '../src'

const app = crayon.create()

app.path('/', (req, res) => console.log('Home'))
app.path('/a', (req, res) => console.log('A'))
app.path('/b', (req, res) => console.log('B')) 
app.path('/c', (req, res) => console.log('C')) 

app.load()

;(window as any).app = app