/**
 * @description Will take a querystring and cast it to an object
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
