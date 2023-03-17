export const exec = <T = any>(callback: () => T, duration: number = 0): Promise<T> => new Promise<T>(
  res => setTimeout(() => res(callback()), duration)
)

export const duration = (duration: number = 0): Promise<void> => new Promise<void>(res => setTimeout(() => res, duration))
