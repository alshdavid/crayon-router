export const slide = `
.router-view.slide-up.slide-up-enter {
    top: 100%;
    bottom: auto;
    transform: translate3d(0,-100%,0);
}
.router-view.slide-up.slide-up-exit {
    transform: translate3d(0,-100%,0);
    top: 0%;
    bottom: auto;
}

.router-view.slide-down.slide-down-enter {
    top: auto;
    bottom: 100%;
    transform: translate3d(0,100%,0);
}
.router-view.slide-down.slide-down-exit {
    top: auto;
    transform: translate3d(0,100%,0);
    bottom: 0%;
}

.router-view.slide-left.slide-left {
    left: 100%;
    right: auto;
}
.router-view.slide-left.slide-left-enter {
    transform: translate3d(-100%,0,0);
}
.router-view.slide-left.slide-left-exit {
    transform: translate3d(-100%,0,0);
    left: 0%;
    right: auto;
}

.router-view.slide-right.slide-right {
    right: 100%;
    left: auto;
}
.router-view.slide-right.slide-right-enter {
    transform: translate3d(100%,0,0);
}
.router-view.slide-right.slide-right-exit {
    transform: translate3d(100%,0,0);
    right: 0%;
    left: auto;
}

.router-view.slide-up-enter-first,
.router-view.slide-down-enter-first,
.router-view.slide-left-enter-first,
.router-view.slide-right-enter-first {
    position: static;
    transition-duration: 0s !important;
}

.router-view.slide-up,
.router-view.slide-down,
.router-view.slide-left,
.router-view.slide-right {
    transition: transform .5s ease-in-out;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
}

.router-view.slide-up-enter-done,
.router-view.slide-down-enter-done,
.router-view.slide-left-enter-done,
.router-view.slide-right-enter-done {
    position: static;
    transition: none;
    transform: none;
}
`
