export const pop = (selector: string) => `
${selector}.push-up {
    transform: translate3d(0, 100%, 0);
}
${selector}.push-up-enter {
    transform: translate3d(0, 0%, 0);
}

${selector}.push-down {
    transform: translate3d(0, -100%, 0);
}
${selector}.push-down-enter {
    transform: translate3d(0, 0%, 0);
}

${selector}.push-left {
    transform: translate3d(100%, 0, 0);
}
${selector}.push-left-enter {
    transform: translate3d(0, 0, 0);
}

${selector}.push-right {
    transform: translate3d(-100%, 0, 0);
}
${selector}.push-right-enter {
    transform: translate3d(0, 0, 0);
}

${selector}.push-up,
${selector}.push-down,
${selector}.push-left,
${selector}.push-right {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

${selector}.push-up-enter-first,
${selector}.push-down-enter-first,
${selector}.push-left-enter-first,
${selector}.push-right-enter-first {
    position: static;
    transition-duration: 0s !important;
}

${selector}.push-up-enter-done,
${selector}.push-down-enter-done,
${selector}.push-left-enter-done,
${selector}.push-right-enter-done {
    transform: none;
}

${selector}.push-up-exit,
${selector}.push-down-exit,
${selector}.push-left-exit,
${selector}.push-right-exit {
    z-index: 1000;
    transform: none
}

${selector}.push-up-enter,
${selector}.push-down-enter,
${selector}.push-left-enter,
${selector}.push-right-enter {
    z-index: 10000;
    transition: transform .5s;
}`