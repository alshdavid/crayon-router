import { route } from './route'
import crayon from 'crayon'
import { MockWindow } from '../../crayon/__tests__/mocks'

// going to anywhere from source
// coming from anywhere to source
fit('Should give the enter animation', (done) => {
    const window = new MockWindow() as any
    const app = crayon.create('test-router', window)

    // app.use(routes([
    //     { from: '/**', to:   '/a', name: 'enter' },
    //     { to:   '/**', from: '/a', name: 'exit'  },
    // ]))

    app.path('/a',
        route([
            { from: '/**', to:   '/a', name: 'enter' },
            { to:   '/**', from: '/a', name: 'exit'  },
        ]),
        (req, res) => {
            // console.log(res.ctx.animation)
        }
    )

    app.path('/b', 
        (req, res) => {
            // console.log(res.ctx.animation)
            done()
        }
    )

    app.load()

    setTimeout(() => app.navigate('/a'))
    setTimeout(() => app.navigate('/b'), 20)

})
