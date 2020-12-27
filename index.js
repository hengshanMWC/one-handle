module.exports = function (fn, cache) {
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
        fn(...arg)
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