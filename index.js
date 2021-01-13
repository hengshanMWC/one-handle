'use strict'
const KEY = 'oneHandle'
/**
 * 多次调用，响应一次，可开缓存
 * 
 * @param {Function} fn 一个返回Promise的函数 | 是否开启缓存
 * @param {boolean | string} cache 是否开启闭包缓存 | 开启localStorage的key（默认为localStorage，你可以通过storageType来进行选择是localStorage|sessionStorage）
 * @param {string | object} [storageType] 本地缓存方式 | 上下文
 * @param {object | string} context 上下文 | 本地缓存方式
 * @returns {()=>Promise} return Promise的闭包
 */
export default function oneHandle (fn, cache, storageType, context) {
  const queueThen = []
  const queueCatch = []
  if (typeof storageType === 'object') {
    [ storageType, context ] = [ context, storageType ]
  }
  if (cache && !storageType) storageType = 'localStorage'
  const cacheKey = typeof cache === 'string' && `${KEY}-${cache}`
  let cacheData = getCache(cacheKey, storageType)
  function result (...arg) {
    return new Promise((resolve, reject) => {
      if (cacheData !== undefined && cacheData !== null) {
        resolve(cacheData)
      } else if (queueThen.length) {
        queueThen.push(resolve)
        queueCatch.push(reject)
      } else {
        queueThen.push(resolve)
        queueCatch.push(reject)
        fn.apply(context, arg)
          .then(data => {
            if (cache) {
              cacheData = setCache(data, cacheKey, storageType)
            }
            queueThen.forEach(then => then(data))
            queueThen.length = 0
            queueCatch.length = 0
          })
          .catch(err => {
            queueCatch.forEach(then => then(err))
            queueCatch.length = 0
            queueThen.length = 0
          })
      }
    })
  }
  if (cache) {
    result.$getData = function () {
      return cacheData
    }
    result.$clear = function () {
      if (cacheKey) {
        g[storageType].removeItem(cacheKey)
      }
      cacheData = null
    }
  }
  if (cacheKey) {
    result.$update = function () {
      cacheData = getCache(cacheKey, storageType)
    }
    result.$cacheKey = cacheKey
  }
  return result
}
const g = typeof window === 'object' ? window : global
function getCache (cacheKey, storageType) {
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
function setCache (data, cacheKey, storageType) {
  if (cacheKey) {
    g[storageType].setItem(cacheKey, stringify(data))
  }
  return data
}
function stringify (data) {
  if (typeof data === 'object') {
    return JSON.stringify(data)
  } else {
    return data
  }
}
if ('undefined' !== typeof module) {
  module.exports = oneHandle
}
