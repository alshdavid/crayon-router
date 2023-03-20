import { normalise } from "./normalise"

/**
 * @description Will match a url declaration with an incoming pathname
 * e.g.
 * 
 * /users/:id/edit
 * 
 * /users/5345/edit
 */
export const matchPath = (
  pattern: string,
  pathname: string
): Record<string, string> | null  => {
  pathname = normalise(pathname, false).split('?')[0]
  pattern = normalise(pattern)
  const params: Record<string, string> = {}
  const source = pattern.split('/')
  const test = pathname.split('/')
  if (source.length !== test.length && !pattern.includes('**')) {
      return null
  }
  for (const i in source) {
      if (source[i].startsWith(':') && pathname !== '/') {
          const paramName = source[i].slice(1)
          params[paramName] = test[i].toString()
          continue
      }
      if (source[i].startsWith('**')) {
        return params
      }
      if (source[i] !== test[i].toLowerCase()) {
          return null
      }
  }
  return params
}