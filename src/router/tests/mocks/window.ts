export class MockWindow {
    location = {
        pathname: ''
    }

    history = {
        pushState: (a: any, title: string, path: string) => {
            this.location.pathname = path
        }
    }

    addEventListener(event: string, callback: () => void) {

    }

    removeEventListener(event: string, callback: () => void) {

    }
}
