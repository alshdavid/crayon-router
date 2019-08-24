export const hasAnimation = (
  noAnimation: string,
  name?: string,
  duration?: number
) => {
  if (
    !name ||
    !duration ||
    name === noAnimation ||
    duration === 0
  ) {
    return false
  }
  return true
}