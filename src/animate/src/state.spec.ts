// import { AnimationState } from './state'

// it('Should give the right animation name and duration', () => {
//     const state = new AnimationState()
//     state.putRoute({ 
//         from: '/a', 
//         to: '/b', 
//         name: 'test-animation', 
//         duration: 5000 
//     })
//     const animation = state.calculate('/a', '/b')
//     expect(animation.name).toBe('test-animation')
//     expect(animation.duration).toBe(5000)
// })

// it('Should give the right animation wildcard', () => {
//     const state = new AnimationState()
//     state.putRoute({ 
//         from: '/**', 
//         to: '/**', 
//         name: 'test-animation', 
//         duration: 5000 
//     })
//     const animation = state.calculate('/a', '/b')
//     expect(animation.name).toBe('test-animation')
//     expect(animation.duration).toBe(5000)
// })

// it('Should give the right animation wildcard', () => {
//     const state = new AnimationState()
//     state.putRoute({ 
//         from: '/**', 
//         to: '/**', 
//         name: 'test-animation', 
//         duration: 5000 
//     })
//     const animation = state.calculate('/a/test', '/b')
//     expect(animation.name).toBe('test-animation')
//     expect(animation.duration).toBe(5000)
// })

// it('Should give the right animation wildcard', () => {
//     const state = new AnimationState()
//     state.putRoute({ 
//         from: '/**', 
//         to: '/**', 
//         name: 'test-animation', 
//         duration: 5000 
//     })
//     const animation = state.calculate('/a', '/b/c')
//     expect(animation.name).toBe('test-animation')
//     expect(animation.duration).toBe(5000)
// })