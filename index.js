/// <reference path="./index.d.ts">
'use strict'
/**
 * 多次调用，响应一次，可开缓存
 * 
 * @param {Function} fn 一个返回Promise的函数
 * @param {Boolean} cache 是否开启缓存
 * @param {*} context 上下文
 * @returns {Function} return Promise的闭包
 */
function oneHandle (fn, cache, context) {
  const queueThen = []
  const queueCatch = []
  let cacheData
  return function (...arg) {
    return new Promise((resolve, reject) => {
      if (cacheData !== undefined) {
        resolve(cacheData)
      } else if (queueThen.length) {
        queueThen.push(resolve)
        queueCatch.push(reject)
      } else {
        queueThen.push(resolve)
        queueCatch.push(reject)
        fn.call(context, ...arg)
          .then(data => {
            if (cache) cacheData = data
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
}
if ('undefined' !== typeof module) {
  module.exports = oneHandle
}
