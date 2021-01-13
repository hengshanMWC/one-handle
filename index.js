'use strict'
/**
 * 多次调用，响应一次，可开缓存
 * 
 * @param {Function} fn 一个返回Promise的函数 | 是否开启缓存
 * @param {boolean | string} cache 是否开启闭包缓存 | 开启localStorage的key（默认为localStorage，你可以通过storageType来进行选择是localStorage|sessionStorage）
 * @param {string | object} [storageType] 本地缓存方式 | 上下文
 * @param {object | string} context 上下文 | 本地缓存方式
 * @returns {()=>Promise} return Promise的闭包
 */
function oneHandle (fn, cache, storageType, context) {
  const queueThen = []
  const queueCatch = []
  if (typeof storageType === 'object') {
    [ storageType, context ] = [ context, storageType ]
  }
  if (cache && !storageType) storageType = 'localStorage'
  let cacheData = getCache(cache, storageType)
  function result () {
    return new Promise((resolve, reject) => {
      if (cacheData !== undefined && cacheData !== null) {
        resolve(cacheData)
      } else if (queueThen.length) {
        queueThen.push(resolve)
        queueCatch.push(reject)
      } else {
        queueThen.push(resolve)
        queueCatch.push(reject)
        fn.apply(context, arguments)
          .then(data => {
            if (cache) {
              cacheData = setCache(data, cache, storageType)
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
      if (typeof cache === 'string') {
        g[storageType].removeItem(cache)
      }
      cacheData = null
    }
  }
  if (typeof cache === 'string') {
    result.$update = function () {
      cacheData = getCache(cache, storageType)
    }
  }
  return result
}
const g = typeof window === 'object' ? window : global
function getCache (cache, storageType) {
  if (typeof cache === 'string') {
    const data = g[storageType].getItem(cache)
    if (data === null) return null 
    try {
      return JSON.parse(data)
    } catch (e) {
      return data
    }
  }
}
function setCache (data, cache, storageType) {
  if (typeof cache === 'string') {
    g[storageType].setItem(cache, data)
  }
  return data
}
if ('undefined' !== typeof module) {
  module.exports = oneHandle
}
