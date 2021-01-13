export const g = typeof window === 'object' ? window : global
export function getCache (cacheKey, storageType) {
  if (cacheKey) {
    const data = g[storageType].getItem(cacheKey)
    if (data === null) return null 
    try {
      return JSON.parse(data)
    } catch (e) {
      return data
    }
  }
}
export function setCache (data, cacheKey, storageType) {
  if (cacheKey) {
    g[storageType].setItem(cacheKey, stringify(data))
  }
  return data
}
export function stringify (data) {
  if (typeof data === 'object') {
    return JSON.stringify(data)
  } else {
    return data
  }
}
