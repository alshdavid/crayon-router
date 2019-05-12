export const normalise = (path?: string) => {
    if (!path) {
        return ''
    }
    return removeTrailingSlash(path).toLowerCase()
}


export const removeTrailingSlash = (path: string) => {
    if (hasTrailingSlash(path)) {
        path = path.substring(0, path.length-1);
    }
    return path;
}

export const hasTrailingSlash = (path: string) => {
    if (path.substring(path.length-1) == "/") {
        return true
    }
    return false
}

/*
    Will match a url declaration with an incoming pathname
    e.g.

    /users/:id/edit
    /users/5345/edit
*/
export const matchPath = (
    pattern: string, 
    pathname: string
): Record<string, string> | undefined => {
    pathname = removeTrailingSlash(pathname)
    pattern = removeTrailingSlash(pattern)
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
            break
        }
        if (source[i] !== test[i]) {
            return
        }
    }
    return params
}

/*
    Will take a querystring and cast 
    it to an object
*/
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
