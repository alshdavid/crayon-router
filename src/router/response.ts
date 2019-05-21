export class Response {
    ctx: Record<string, any> = {}
    hasCompleted = false
    unmountAction: (() => void) | undefined
    
    onUnmount(cb: (() => void) | undefined) {
        this.unmountAction = cb
    }

    end() {
        this.hasCompleted = true
    }

    unmount(...args: any) {
        console.log('Unmount action is not set')
        console.log(...args)
    }

    mount(...args: any) {
        console.log('Mount action is not set')
        console.log(...args)
    }

    redirect(path: string) {
        console.log('Redirect action is not set')
        console.log(path)
    }
}