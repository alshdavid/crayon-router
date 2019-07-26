import React from 'react'
import { Request, Response, Router } from 'crayon';

export const withContext = (context: any, state: Record<string, any>) => {
  const apply = (Component: any) => React.createElement(context.provider, { value: state }, 
    React.createElement(Component, null)
  )
    return (req: Request, res: Response, state: Record<string, any>, app: Router) => {
    const original = res.mount
    res.mount = (c: any) => {
      original(apply(c))
    }
  }
}