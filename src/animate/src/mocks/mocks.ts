export class MockRouter {
    history = {
        currentEvent: {
            from: '',
            to: ''
        }
    }
    state = {}

    constructor(
        from: string = '', 
        to: string = ''
    ) {
        this.history.currentEvent.from = from
        this.history.currentEvent.to = to
    }
}

export class MockRequest {
    constructor(
        public routePattern: string = ''
    ){}
}
