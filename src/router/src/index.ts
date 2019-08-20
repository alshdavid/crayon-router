export * from './router'
export * from './group'
export * from './request'
export * from './response'
export * from './types'
export * from './platform/check-types'
export * from './platform/gen-string'
export * from './platform/mount'
export * from './platform/observe'
export * from './platform/url'

import { create } from './router'
import { group } from './group'
export default { create, group }