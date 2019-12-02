import { router } from './preact'
import { EmbeddedRouter } from './embedded-router'
import { withContext } from './with-context'

export const preactCrayon = {
    router,
    EmbeddedRouter,
    withContext
}

export default preactCrayon

// Exporting types
import { EmbeddedRouterProps as _EmbeddedRouterProps } from './embedded-router'
import { PreactMounter as _PreactMounter } from './mounter'

export declare namespace preactCrayon {
    export type EmbeddedRouterProps = _EmbeddedRouterProps
    export type PreactMounter = _PreactMounter
}