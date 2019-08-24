export class ClassNameStates {
  isAnimating = 'is-animating'
  noAnimation = 'no-animation'
  hostView = 'host-view'
  firstEnter: string
  enter: string
  enterDone: string
  exit: string

  constructor(
    public base: string = 'crayon'
  ) {
    this.firstEnter = `${base}-enter-first`
    this.enter = `${base}-enter`
    this.enterDone = `${base}-enter-done`
    this.exit = `${base}-exit`
  }
}
