const storageMock = require('./storage-mock')
const oneHandle = require('../index')
global.sessionStorage = storageMock()
global.localStorage = storageMock()
function wait (time, data = 0) {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), time)
  })
}
test('default', () => {
  const $wait = oneHandle(wait)
  $wait(100, 1).then(data => expect(1).toBe(data))
  $wait(1000, 2).then(data => expect(1).toBe(data))
  $wait(1, 3).then(data => expect(1).toBe(data))
})
test('cache', () => {
  const $wait = oneHandle(wait, true)
  $wait(1, false).then(data => {
    expect(false).toBe(data)
    return $wait(1, 50)
  })
    .then(data => expect(false).toBe(data))
})
test('localStorage&getCache', () => {
  const VALUE = 'a'
  const objValue = {a: 1}
  const KEY = 'localStorage&getCache'
  const $wait = oneHandle(wait, KEY)
  let $wait2
  $wait(1, VALUE).then(data => {
    expect(VALUE).toBe(data)
    return $wait(1, 50)
  })
    .then(data => {
      expect(VALUE).toBe(data)
      expect(localStorage.getItem(KEY)).toBe(data)
      $wait.$clear()
      expect(localStorage.getItem(KEY)).toBe(null)
      return $wait(1, objValue)
    })
    .then(data => {
      expect(objValue).toBe(data)
      return $wait(1, false)
    })
    .then(data => {
      expect(objValue).toBe(data)
      $wait2 = oneHandle(wait, KEY)
      return $wait2(1, {a: 2})
    })
    .then(data => {
      expect(objValue).toBe(data)
    })
})
test('sessionStorage&context', () => {
  const VALUE = 'a'
  const KEY = 'sessionStorage&context'
  const obj = {
    wait (time, data = 0) {
      return new Promise(resolve => {
        expect(this).toBe
        setTimeout(() => resolve(data), time)
      })
    }
  }
  const $wait = oneHandle(obj.wait, KEY, obj, 'sessionStorage')
  $wait(1, VALUE).then(data => {
    expect(VALUE).toBe(data)
    return $wait(1, 50)
  })
    .then(data => {
      expect(VALUE).toBe(data)
      expect(sessionStorage.getItem(KEY)).toBe(data)
      $wait.$clear()
      expect(sessionStorage.getItem(KEY)).toBe(null)
      return $wait(1, true)
    })
    .then(data => {
      expect(true).toBe(data)
      return $wait(1, false)
    })
    .then(data => expect(true).toBe(data))
})
test('try', () => {
  function waitTry (time, data = 0) {
    return new Promise(resolve => {
      setTimeout1(() => resolve(data), time)
    })
  }
  const $wait = oneHandle(waitTry, true)
  const Err = "ReferenceError: setTimeout1 is not defined"
  $wait(1).catch(err => expect(err.toString()).toBe(Err))
  $wait(1).catch(err => expect(err.toString()).toBe(Err))
  $wait(1).catch(err => expect(err.toString()).toBe(Err))
})