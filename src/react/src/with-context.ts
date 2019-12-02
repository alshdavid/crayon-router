import React from 'react'
import crayon from 'crayon';

export const withContext = <T = any>(context: React.Context<any>, value?: T) => {
  const apply = (Component: any) => () =>
    React.createElement(context.Provider, { value }, 
      React.createElement(Component, null))

  return (req: Request, res: crayon.Response) => {
    const mount = res.mount
    res.mount = (c: any) => {
      return mount(apply(c))
    }
  }
}