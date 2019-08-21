import { Group } from '../platform/router'

export const group = (base: string, callback?: (group: Group) => void): Group => {
    const group = new Group(base)
    callback && callback(group)
    return group
}