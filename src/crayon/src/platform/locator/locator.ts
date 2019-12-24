import { url } from 'crayon-kit'
import { Context } from '../router'

// Locator is a wrapper on top of window.location
export class Location {
  constructor(
    private window: Window = window
  ) {}

  getLocation() {
    return { ...this.window.location }
  }

  mergeContext(
    ctx: Context,
    routePattern: string, 
    params: Record<string, string>,
  ): void {
    ctx.routePattern = routePattern
    ctx.query = url.deserializeQuery(this.window.location.search)
    ctx.hash = this.window.location.hash
    ctx.host =  this.window.location.host,
    ctx.hostname =  this.window.location.hostname,
    ctx.href =  this.window.location.href,
    ctx.origin =  this.window.location.origin,
    ctx.pathname =  this.window.location.pathname,
    ctx.port =  this.window.location.port,
    ctx.protocol =  this.window.location.protocol,
    ctx.search = this.window.location.search,
    ctx.params = { ...params }
  }
}

