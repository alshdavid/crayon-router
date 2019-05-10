export const fade = `
.router-view.fade {
    opacity: 0;
    transition: opacity .5s;
}

.router-view.fade-enter-first {
    position: static;
    transition-duration: 0s !important;
}

.router-view.fade-enter {
    opacity: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}

.router-view.fade-enter-done {
    opacity: 1;
}

.router-view.fade-exit {
    opacity: 0;
}
`
