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

export const staticMount = async (
  states: ClassNameStates,
  incoming: any,
  mounter: Mounter,
  name: string,
): Promise<void> => {
  await mounter.push(incoming)
  const { leaving, entering } = getRouteTargets(mounter.selector)

  // Add classes to entering element
  addClassNames(entering, [name])
  waitForElements(entering)

  // First load
  if (leaving === undefined) {
    addClassNames(entering, [states.enterDone])
    return
  }
  
  await mounter.shift()
}

