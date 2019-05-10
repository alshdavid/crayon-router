export const slideLeft = `
.router-view.slide-left {
    transform: translate3d(100%,0,0);
    transition: transform .5s ease-in-out;
}

.router-view.slide-left.slide-left-enter-first {
    position: static;
    transition-duration: 0s !important;
}

.router-view.slide-left.slide-left-enter,
.router-view.slide-left.slide-left-exit {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}

.router-view.slide-left.slide-left-enter {
    transform: translate3d(0%,0,0);
}

.router-view.slide-left.slide-left-exit {
    transform: translate3d(-100%,0,0);
}

.router-view.slide-left.slide-left-enter-done {
    position: static;
    transform: translate3d(0%,0,0);
}
`

export const slideRight = `
.router-view.slide-right {
    transform: translate3d(-100%,0,0);
    transition: transform .5s ease-in-out;
}

.router-view.slide-right-enter-first {
    position: static;
    transition-duration: 0s !important;
}

.router-view.slide-right-enter,
.router-view.slide-right-exit {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}

.router-view.slide-right-enter {
    transform: translate3d(0%,0,0);
}

.router-view.slide-right-exit {
    transform: translate3d(100%,0,0);
}

.router-view.slide-right-enter-done {
    position: static;
    transform: translate3d(0%,0,0);
}
`
