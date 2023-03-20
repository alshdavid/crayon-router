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
