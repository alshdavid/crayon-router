import { Element, Sleep } from 'kit'
import { getRouteTargets } from "./get-route-targets";
import { Mounter } from './mounter';
import { ClassNameStates } from './make-class-names';

const {
  addClassNames,
  removeClassNames,
  clearClassList,
  setStyles,
  waitForElements
} = Element

export const animatedMount = async (
  states: ClassNameStates,
  Component: any,
  mounter: Mounter,
  name: string,
  duration: number
): Promise<void> => {
  const routerOutlet = mounter.target
  await mounter.push(Component)
  const { leaving, entering } = getRouteTargets(mounter.selector)

  // Add classes to entering element
  addClassNames(entering, [name])
  addClassNames(routerOutlet, [states.isAnimating])
  setStyles(entering, { transitionDuration: '0ms' })
  addClassNames(entering, [states.base])
  waitForElements(entering, routerOutlet)
  setStyles(entering, { transitionDuration: `${duration}ms` })
  
  // First load
  if (leaving === undefined) {
    addClassNames(entering, [states.firstEnter])
    addClassNames(entering, [states.enter])
    waitForElements(entering)
    await Sleep.duration(duration)
    removeClassNames(entering, [states.firstEnter])
    removeClassNames(entering, [states.enter])
    addClassNames(entering, [states.enterDone])
    removeClassNames(routerOutlet, [states.isAnimating])
    return
  }

  // Start route animation
  clearClassList(leaving)
  setStyles(leaving, { transitionDuration: `${duration}ms` })
  // setStyles(entering, { transitionDuration: `${duration}ms` })
  addClassNames(leaving, [mounter.selector])
  waitForElements(leaving, entering)
  addClassNames(leaving, [states.base])
  addClassNames(leaving, [states.exit])
  addClassNames(entering, [states.enter])
  waitForElements(leaving, entering)

  // Remove classes once duration is complete
  await Sleep.duration(duration)
  removeClassNames(entering, [states.enter])
  addClassNames(entering, [states.enterDone])
  removeClassNames(routerOutlet, [states.isAnimating])
  await mounter.shift()
}
