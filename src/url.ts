export const matchPath = (
    pattern: string, 
    pathname: string
): Record<string, string> | undefined => {
    const params: any = {}
    const source = pattern.split('/')
    const test = pathname.split('/')
    if (source.length !== test.length) {
        return
    }
    for (const i in source) {
        if (source[i].startsWith(':')) {
            const paramName = source[i].slice(1)
            params[paramName] = test[i]
            continue
        }
        if (source[i] !== test[i]) {
            return
        }
    }
    return params
}

export const deserializeQuery = (query: string = '') => {
    var pairs = query.slice(1).split('&')
    var result: any = {}
    for (const pair of pairs) {
        const newPair = pair.split('=')
        if (!newPair[0]) {
            continue
        }
        result[newPair[0]] = decodeURIComponent(newPair[1] || '')
    }
    return result
}
