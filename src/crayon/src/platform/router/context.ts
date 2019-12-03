type LeaveAction = () => void

export class Context {
    public ctx: Record<string, any> = {}
    public hasCompleted = false
    public leaveActions: LeaveAction[] = []
    public routePattern: string = ''
    public hash: string = ''
    public host: string = ''
    public hostname: string = ''
    public href: string = ''
    public origin: string = ''
    public pathname: string = ''
    public port: string = ''
    public protocol: string = ''
    public search: string = ''
    public params: Record<string, string> = {}
    public query: Record<string, string> = {}
    
    public runOnLeave() {
        this.leaveActions.forEach(cb => cb())
        this.leaveActions = []
    }

    public onLeave(cb: LeaveAction) {
        this.leaveActions.push(cb)
    }

    public end() {
        this.hasCompleted = true
    }

    public unmount(..._args: any): void | Promise<void> {
    }

    public mount(..._args: any): void | Promise<void> {
    }

    public redirect(path: string): void | Promise<void> {
    }
}