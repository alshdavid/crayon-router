import { url } from 'crayon-kit'
import { handlerFunc } from '../router/index.js'

export type ParamMap = Record<string, string>

export interface PatternMap {
  key: string,
  params: Record<string, string>
}

export interface Route {
  params: ParamMap,
  pattern: string,
  patterns: PatternMap[],
  handlers: handlerFunc[]
}

export class RouteMap {
  middleware: handlerFunc[] = []
  routes: Record<string, handlerFunc[]> = {}

  public add(path: string, ...handlers: handlerFunc[]) {
    this.routes[url.normalise(path)] = handlers
  }

  public addMiddleware(...handlers: handlerFunc[]) {
    for (const handler of handlers) {
      this.middleware.push(handler)
    }
  }

  public findWithPathname(pathname: string): Route | undefined {
    let patterns: { key: string, params: Record<string, string> }[] = []
    for (let key in this.routes) {
      const params = url.matchPath(key, pathname)
      if (params !== undefined) {
        patterns.push({ key, params })
      }
    }
    if (patterns.length === 0) {
      return
      // throw new Error('pattern not found')
    }

    const wildcard = patterns.filter(p => p.key.includes('**'))
    const noWildcardPatterns = patterns.filter(p => !p.key.includes('**'))

    let pattern: string | undefined
    let params: Record<string, string> | undefined
    for (let item of noWildcardPatterns) {
      pattern = item.key
      params = item.params
      if (item.key === pathname) {
        break
      }
    }
    if (!pattern || !params && wildcard.length) {
      const pattern = wildcard[0].key
      const handlers = [
        ...this.middleware, 
        ...this.routes[pattern]
      ]
      return {
        params: wildcard[0].params,
        pattern,
        patterns,
        handlers
      }
    }
    if (!pattern || !params) {
      return
      // throw new Error('Route not found')
    }
    const handlers = [
      ...this.middleware, 
      ...this.routes[pattern]
    ]
    return {
      params,
      pattern,
      patterns,
      handlers
    }
  }
}