import { h, Context } from 'preact'
import crayon from 'crayon';

export const withContext = <T = any>(context: Context<T>, contextState: T) => {
  const options = { value: contextState, children: undefined }

  const Context = (Component: () => h.JSX.Element) => () =>
    h(context.Provider, options, 
      h(Component, null))

  return (ctx: crayon.Context) => {
    const _mount = ctx.mount
    ctx.mount = (
      Component: () => h.JSX.Element
    ) => _mount(Context(Component))
  }
}