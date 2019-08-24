export const exec = <T = any>(
    callback: () => any, 
    duration: number = 0
): Promise<T> => new Promise(res =>
    setTimeout(() => {
        const val = callback()
        res(val)
    }, duration)
)

export const duration = <T = any>(
  duration: number = 0
): Promise<T> => new Promise(res =>
  setTimeout(() => {
      res()
  }, duration)
)
