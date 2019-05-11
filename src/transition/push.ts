export const push = `
.router-view.pop-up {
    transform: translate3d(0, 0%, 0);
}
.router-view.pop-up-exit {
    transform: translate3d(0, -100%, 0);
}

.router-view.pop-down {
    transform: translate3d(0,  0, 0);
}
.router-view.pop-down-exit {
    transform: translate3d(0, 100%, 0);
}

.router-view.pop-left {
    transform: translate3d(0, 0, 0);
}
.router-view.pop-left-exit {
    transform: translate3d(-100%, 0, 0);
}

.router-view.pop-right {
    transform: translate3d(0, 0, 0);
}
.router-view.pop-right-exit {
    transform: translate3d(100%, 0, 0);
}

.router-view.pop-up,
.router-view.pop-left,
.router-view.pop-right,
.router-view.pop-down {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.router-view.pop-up-enter-first,
.router-view.pop-left-enter-first,
.router-view.pop-right-enter-first,
.router-view.pop-down-enter-first {
    position: static;
    transition-duration: 0s !important;
}

.router-view.pop-up-enter-done,
.router-view.pop-down-enter-done,
.router-view.pop-left-enter-done,
.router-view.pop-right-enter-done {
    transform: none;
}

.router-view.pop-up-enter,
.router-view.pop-down-enter,
.router-view.pop-left-enter,
.router-view.pop-right-enter {
    transform: none;
    z-index: 1000;
}

.router-view.pop-up-exit,
.router-view.pop-down-exit,
.router-view.pop-left-exit,
.router-view.pop-right-exit {
    transition: transform .5s;
    background-color: inherit;
    z-index: 10000;
}`