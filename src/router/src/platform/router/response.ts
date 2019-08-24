type LeaveAction = () => void

export class Response {
    ctx: Record<string, any> = {}
    hasCompleted = false
    leaveActions: LeaveAction[] = []
    
    runOnLeave() {
        this.leaveActions.forEach(cb => cb())
        this.leaveActions = []
    }

    onLeave(cb: LeaveAction) {
        this.leaveActions.push(cb)
    }

    end() {
        this.hasCompleted = true
    }

    public async unmount(...args: any): Promise<void> {
        console.log('Unmount action is not set')
        console.log(...args)
    }

    public async mount(...args: any): Promise<void> {
        console.log('Mount action is not set')
        console.log(...args)
    }

    public redirect(path: string): void {
        console.log('Redirect action is not set')
        console.log(path)
    }
}