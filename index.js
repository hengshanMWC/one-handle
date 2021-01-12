'use strict'
/**
 * 多次调用，响应一次，可开缓存
 * 
 * @param {string | Function} key 开启localStorage | 一个返回Promise的函数
 * @param {Function | boolean} fn 一个返回Promise的函数 | 是否开启缓存
 * @param {boolean | object} cache 是否开启缓存 | 上下文
 * @param {object} context 上下文
 * @returns {()=>Promise} return Promise的闭包
 */
function oneHandle (key, fn, cache, context) {
  const queueThen = []
  const queueCatch = []
  const params = paramConcoct(key, fn , cache, context)
  let cacheData = localStorage.getItem(params.key)
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
        params.fn.apply(params.context, arguments)
          .then(data => {
            if (params.cache) cacheData = data
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
  return result
}
function paramConcoct (key, fn , cache, context) {
  let result
  if (typeof key === 'function') {
    result = {
      fn: key,
      cache: fn,
      context: cache
    }
  } else {
    result = {
      key,
      fn,
      cache,
      context,
    }
  }
  return result
}

if ('undefined' !== typeof module) {
  module.exports = oneHandle
}
