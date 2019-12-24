import React from 'react'
import crayon from 'crayon';

export const withContext = <T = any>(context: React.Context<any>, value?: T) => {
  const apply = (Component: any) => () =>
    React.createElement(context.Provider, { value }, 
      React.createElement(Component, null))

  return (ctx: crayon.Context) => {
    const _mount = ctx.mount
    ctx.mount = (c: any) => {
      return _mount(apply(c))
    }
  }
}