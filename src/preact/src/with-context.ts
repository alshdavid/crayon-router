import { h, Context } from 'preact'
import { Request, Response } from 'crayon';

export const withContext = <T = any>(context: Context<T>, contextState: T) => {
  const options = { value: contextState, children: undefined }
  const Context = (Component: () => h.JSX.Element) => () =>
    h(context.Provider, options, 
      h(Component, null))

  return (req: Request, res: Response) => {
    const OGmount = res.mount
    res.mount = (
      Component: () => h.JSX.Element
    ) => OGmount(Context(Component))
  }
}