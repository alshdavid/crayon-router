import { Request } from './request'
import * as url from "./platform/url"

export class Locator {
  constructor(
    private window: Window = window
  ) {}

  getLocation() {
    return { ...this.window.location }
  }

  generateRequest(
    pattern: string, 
    params: Record<string, string>
  ): Request {
    const query = url.deserializeQuery(this.window.location.search)
    return new Request(
      pattern,
      this.window.location.hash,
      this.window.location.host,
      this.window.location.hostname,
      this.window.location.href,
      this.window.location.origin,
      this.window.location.pathname,
      this.window.location.port,
      this.window.location.protocol,
      this.window.location.search,
      { ...params },
      query,
    )
  }
}

