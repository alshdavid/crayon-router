export const fade = (selector: string) => `
${selector}.fade {
    opacity: 0;
    transition: opacity .5s;
}

${selector}.fade-enter-first {
    position: static;
    transition-duration: 0s !important;
}

${selector}.fade-enter {
    opacity: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}

${selector}.fade-enter-done {
    opacity: 1;
}

${selector}.fade-exit {
    opacity: 0;
}
`
