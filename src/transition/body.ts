export const root = (selector: string) => `
${selector}.is-animating {
    overflow: hidden;
    position: fixed;
    width: 100%;
    height: 100%;
}
`