export const slide = (selector: string) => `
${selector}.slide-up.slide-up-enter {
    top: 100%;
    bottom: auto;
    transform: translate3d(0,-100%,0);
}
${selector}.slide-up.slide-up-exit {
    transform: translate3d(0,-100%,0);
    top: 0%;
    bottom: auto;
}

${selector}.slide-down.slide-down-enter {
    top: auto;
    bottom: 100%;
    transform: translate3d(0,100%,0);
}
${selector}.slide-down.slide-down-exit {
    top: auto;
    transform: translate3d(0,100%,0);
    bottom: 0%;
}

${selector}.slide-left.slide-left {
    left: 100%;
    right: auto;
}
${selector}.slide-left.slide-left-enter {
    transform: translate3d(-100%,0,0);
}
${selector}.slide-left.slide-left-exit {
    transform: translate3d(-100%,0,0);
    left: 0%;
    right: auto;
}

${selector}.slide-right.slide-right {
    right: 100%;
    left: auto;
}
${selector}.slide-right.slide-right-enter {
    transform: translate3d(100%,0,0);
}
${selector}.slide-right.slide-right-exit {
    transform: translate3d(100%,0,0);
    right: 0%;
    left: auto;
}

${selector}.slide-up-enter-first,
${selector}.slide-down-enter-first,
${selector}.slide-left-enter-first,
${selector}.slide-right-enter-first {
    position: static;
    transition-duration: 0s !important;
}

${selector}.slide-up,
${selector}.slide-down,
${selector}.slide-left,
${selector}.slide-right {
    transition: transform .5s ease-in-out;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
}

${selector}.slide-up-enter-done,
${selector}.slide-down-enter-done,
${selector}.slide-left-enter-done,
${selector}.slide-right-enter-done {
    position: static;
    transition: none;
    transform: none;
    height: auto;
    width: auto;
}
`
