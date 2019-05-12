export * from './react'
export * from './use-router'
export * from './use-active-link'

import { router } from './react'
import { useRouter } from './use-router'
import { useActiveLink } from './use-active-link'

export default {
    useActiveLink,
    router,
    useRouter
}