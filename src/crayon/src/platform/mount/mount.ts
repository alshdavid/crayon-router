import { ClassNameStates } from './make-class-names.js';
import { hasAnimation } from './has-animation.js';
import { Mounter } from './mounter.js';
import { animatedMount } from './mount-animated.js';
import { staticMount } from './mount-static.js';

/*
    The mount function will take a framework/library specific component
    and a generic "mounter" implimentation which knows how to mount that 
    library's component.

    When a mount action is triggered the follow occurs:

        1)  A new HTML element which corresponds to the incoming 
            route is pushed into the target outlet HTML element
        
        2)  The old HTML element which corresponds to the previous
            route is unmounted and removed from the outlet element
    
    In effect, you can think of this process like an array, where
    you push a new route, and shift the old route off.

    1)  ['route-1']
    2)  ['route-1', 'route-2']
    3)  ['route-2']

    If it's detected that we have an animation duration, then 
    classNames and timers are added to the process to facilitate.

    The animations themselves must be declared as CSS. The mount 
    function only adds/removes classes relating to certain 
    lifecycle events. There for, it's up to the CSS styles to 
    action the requirements of the animaiton animation.

    See /src/transition/ for example CSS animations
*/
export const mount = async (
  incoming: any,
  mounter: Mounter,
  name: string,
  duration: number
): Promise<void> => {
  const states = new ClassNameStates(name)
  const isAnimated = hasAnimation(
    states.noAnimation,
    name,
    duration,
  )
  if (isAnimated) {
    return animatedMount(
      states, 
      incoming, 
      mounter, 
      name, 
      duration
    )
  }
  return staticMount(
    states, 
    incoming, 
    mounter, 
    name
  )
}



