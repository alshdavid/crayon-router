export const isArray = (value: any): value is Array<any> => {
    if (Array.isArray) {
        return Array.isArray(value)
    }
    return value && typeof value === 'object' && value.constructor === Array
}
