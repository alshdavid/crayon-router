import { RouteMap } from './route-map'

it('Should find a route based on pathname', () => {
  const routeMap = new RouteMap()

  const fn_a = () => {}
  const fn_b = () => {}

  routeMap.add('/a', fn_a)
  routeMap.add('/b', fn_b)

  const result = routeMap.findWithPathname('/a') 
  expect(result!.handlers[0]).toBe(fn_a)
})

it('Should find a route based on pathname', () => {
  const routeMap = new RouteMap()

  const fn_a = () => {}
  const fn_b = () => {}

  routeMap.add('/a', fn_a)
  routeMap.add('/**', fn_b)

  const result = routeMap.findWithPathname('/a')
  expect(result!.handlers[0]).toBe(fn_a)
})

it('Should find a route based on pathname', () => {
  const routeMap = new RouteMap()

  const fn_a = () => {}
  const fn_b = () => {}

  routeMap.add('/a', fn_a)
  routeMap.add('/**', fn_b)

  const result = routeMap.findWithPathname('/something')
  expect(result!.handlers[0]).toBe(fn_b)
})

it('Should find a route based on pathname', () => {
  const routeMap = new RouteMap()

  const fn_a = () => {}
  const fn_b = () => {}

  routeMap.add('/a/**', fn_a)
  routeMap.add('/**', fn_b)

  const result = routeMap.findWithPathname('/a/something')
  expect(result!.handlers[0]).toBe(fn_a)
})

it('Should find a route based on pathname', () => {
  const routeMap = new RouteMap()

  const fn_a = () => {}
  const fn_b = () => {}

  routeMap.add('/a/b/**', fn_a)
  routeMap.add('/**', fn_b)

  const result = routeMap.findWithPathname('/a/b/something')
  expect(result!.handlers[0]).toBe(fn_a)
})

it('Should find a route based on pathname', () => {
  const routeMap = new RouteMap()

  routeMap.add('/a/:user', () => {})
  routeMap.add('/**', () =>{})

  const result = routeMap.findWithPathname('/a/value')
  expect(result!.params.user).toBe('value')
})

it('Should find a route based on pathname', () => {
  const routeMap = new RouteMap()
  const fn_a = () => 'a'
  const fn_b = () => 'b'

  routeMap.add('/test/:id', fn_a)
  routeMap.add('/test/**', fn_b)

  const result = routeMap.findWithPathname('/test/hi/hello')
  expect(result!.handlers[0]).toBe(fn_b)
})

// it('Should find a route based on pathname', () => {
//   const routeMap = new RouteMap()

//   routeMap.add('/a/**/b/:user', () => {})
//   routeMap.add('/**', () =>{})

//   const result = routeMap.findWithPathname('/a/something/b/value')
//   console.log(result.params)
//   expect(result.params.user).toBe('value')
// })

// it('Should find a route based on pathname', () => {
//   const routeMap = new RouteMap()

//   routeMap.add('/**', () =>{})
//   routeMap.add('/a/**/b/:user', () => {})

//   const result = routeMap.findWithPathname('/a/something/b/value')
//   expect(result.params.user).toBe('value')
// })