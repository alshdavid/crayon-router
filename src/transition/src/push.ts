export const push = (selector: string) => `
${selector}.pop-up {
    transform: translate3d(0, 0%, 0);
}
${selector}.pop-up-exit {
    transform: translate3d(0, -100%, 0);
}

${selector}.pop-down {
    transform: translate3d(0,  0, 0);
}
${selector}.pop-down-exit {
    transform: translate3d(0, 100%, 0);
}

${selector}.pop-left {
    transform: translate3d(0, 0, 0);
}
${selector}.pop-left-exit {
    transform: translate3d(-100%, 0, 0);
}

${selector}.pop-right {
    transform: translate3d(0, 0, 0);
}
${selector}.pop-right-exit {
    transform: translate3d(100%, 0, 0);
}

${selector}.pop-up,
${selector}.pop-left,
${selector}.pop-right,
${selector}.pop-down {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

${selector}.pop-up-enter-first,
${selector}.pop-left-enter-first,
${selector}.pop-right-enter-first,
${selector}.pop-down-enter-first {
    position: static;
    transition-duration: 0s !important;
}

${selector}.pop-up-enter-done,
${selector}.pop-down-enter-done,
${selector}.pop-left-enter-done,
${selector}.pop-right-enter-done {
    transform: none;
}

${selector}.pop-up-enter,
${selector}.pop-down-enter,
${selector}.pop-left-enter,
${selector}.pop-right-enter {
    transform: none;
    z-index: 1000;
}

${selector}.pop-up-exit,
${selector}.pop-down-exit,
${selector}.pop-left-exit,
${selector}.pop-right-exit {
    transition: transform .5s;
    z-index: 10000;
}`