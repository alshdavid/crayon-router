export class Request {
    routePattern = ''
    hash = ''
    host = ''
    hostname = ''
    href = ''
    origin = ''
    pathname = ''
    port = ''
    protocol = ''
    search = ''
    params: Record<string, string> = {}
    query: Record<string, string> = {}

    constructor(
        win: Window = window
    ) {
        this.hash = win.location.hash
        this.host = win.location.host
        this.hostname = win.location.hostname
        this.href = win.location.href
        this.origin = win.location.origin
        this.pathname = win.location.pathname
        this.port = win.location.port
        this.protocol = win.location.protocol
        this.search = win.location.search
    }
}