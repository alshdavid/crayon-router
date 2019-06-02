export class Request {
    routePattern = ''
    hash = this.window.location.hash
    host = this.window.location.host
    hostname = this.window.location.hostname
    href = this.window.location.href
    origin = this.window.location.origin
    pathname = this.window.location.pathname
    port = this.window.location.port
    protocol = this.window.location.protocol
    search = this.window.location.search
    params: Record<string, string> = {}
    query: Record<string, string> = {}

    constructor(
        private window: Window = window
    ) {}
}