export const normalise = (path?: string, lowerCase: boolean = true) => {
    if (!path || path === '/') {
        return '/'
    }
    if (!path.startsWith('/')) {
        path = '/' + path
    }
    path = removeTrailingSlash(path)

    if(lowerCase) {
      path = path.toLowerCase()
    }

    return path;
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
    pathname = normalise(pathname, false).split('?')[0]
    pattern = normalise(pattern)
    const params: Record<string, string> = {}
    const source = pattern.split('/')
    const test = pathname.split('/')
    if (source.length !== test.length && !pattern.includes('**')) {
        return
    }
    for (const i in source) {
        if (source[i].startsWith(':') && pathname !== '/') {
            const paramName = source[i].slice(1)
            params[paramName] = test[i].toString()
            continue
        }
        if (source[i].startsWith('**')) {
          return params
        }
        if (source[i] !== test[i].toLowerCase()) {
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
    if (!query.startsWith('?')) {
        return {}
    }
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
