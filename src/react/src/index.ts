import { router } from './react.js'
import { EmbeddedRouter } from './embedded-router.js'
import { useActiveLink } from './use-active-link.js'
import { withContext } from './with-context.js'

export const reactCrayon = {
    router,
    EmbeddedRouter,
    useActiveLink,
    withContext
}

export default reactCrayon

// Exporting types
import { EmbeddedRouterProps as _EmbeddedRouterProps } from './embedded-router'
import { ReactMounter as _ReactMounter } from './mounter'
import { ReactState as _ReactState } from './state'

export declare namespace reactCrayon {
    export type EmbeddedRouterProps = _EmbeddedRouterProps
    export type ReactMounter = _ReactMounter
    export type ReactState = _ReactState
}