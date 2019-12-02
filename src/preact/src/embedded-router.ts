import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { router } from './preact'
import crayon from "crayon";
import { genString } from "crayon-kit";

export interface EmbeddedRouterProps {
  children: (router: crayon.Router, selector: string) => void | Promise<void>
  name?: string
  className?: string
}

export const EmbeddedRouter = ({ 
  children = () => {},
  name = genString.ofLength(5),
  className = '',
}: EmbeddedRouterProps) => {
  const [ ref, setRef ] = useState<HTMLElement | undefined>(undefined)
  const preparedName = `${name}-router`

  useEffect(() => {
    if (!ref) {
        return
    }
    const selector = `.${preparedName}`
    const app = crayon.create(preparedName)
    app.use(router(ref, preparedName))
    children(app, selector)

    app.load()
    return () => app.destroy()
  }, [ ref ])

  return h('div', { 
      className: `${className} ${preparedName}-outlet`, 
      ref: (el: any) => setRef(el)
    })
}
