export class Request {
    constructor(
      public routePattern: string,
      public hash: string,
      public host: string,
      public hostname: string,
      public href: string,
      public origin: string,
      public pathname: string,
      public port: string,
      public protocol: string,
      public search: string,
      public params: Record<string, string> = {},
      public query: Record<string, string> = {},
    ) { }
}