export const pop = `
.router-view.push-up {
    transform: translate3d(0, 100%, 0);
}
.router-view.push-up-enter {
    transform: translate3d(0, 0%, 0);
}

.router-view.push-down {
    transform: translate3d(0, -100%, 0);
}
.router-view.push-down-enter {
    transform: translate3d(0, 0%, 0);
}

.router-view.push-left {
    transform: translate3d(100%, 0, 0);
}
.router-view.push-left-enter {
    transform: translate3d(0, 0, 0);
}

.router-view.push-right {
    transform: translate3d(-100%, 0, 0);
}
.router-view.push-right-enter {
    transform: translate3d(0, 0, 0);
}

.router-view.push-up,
.router-view.push-down,
.router-view.push-left,
.router-view.push-right {
    background-color: inherit;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.router-view.push-up-enter-first,
.router-view.push-down-enter-first,
.router-view.push-left-enter-first,
.router-view.push-right-enter-first {
    position: static;
    transition-duration: 0s !important;
}

.router-view.push-up-enter-done,
.router-view.push-down-enter-done,
.router-view.push-left-enter-done,
.router-view.push-right-enter-done {
    transform: none;
}

.router-view.push-up-exit,
.router-view.push-down-exit,
.router-view.push-left-exit,
.router-view.push-right-exit {
    z-index: 1000;
    transform: none
}

.router-view.push-up-enter,
.router-view.push-down-enter,
.router-view.push-left-enter,
.router-view.push-right-enter {
    z-index: 10000;
    transition: transform .5s;
}`