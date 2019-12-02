import React from 'react'
import { Request, Response, Router } from 'crayon';

export const withContext = <T = any>(context: React.Context<any>, value?: T) => {
  const apply = (Component: any) => () =>
    React.createElement(context.Provider, { value }, 
      React.createElement(Component, null))

  return (req: Request, res: Response, state: Record<string, any>, app: Router) => {
    const mount = res.mount
    res.mount = (c: any) => {
      return mount(apply(c))
    }
  }
}