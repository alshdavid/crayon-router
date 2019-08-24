type RouteTargets = {
  length: number
  entering: HTMLElement
  leaving: HTMLElement | undefined
}

// TODO:  make this use queryselector
export const getRouteTargets = (
  selector: string
): RouteTargets => {
  const routeTargets = (document.body.getElementsByClassName(selector) as any)
  if (routeTargets.length === 1) {
    return {
      length: 1,
      entering: routeTargets[0],
      leaving: undefined,
    }
  }
  return {
    length: 2,
    leaving: routeTargets[0],
    entering: routeTargets[1]
  }
}