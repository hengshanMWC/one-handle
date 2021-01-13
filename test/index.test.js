import storageMock from './storage-mock'
import oneHandle from '../index'
global.sessionStorage = storageMock()
global.localStorage = storageMock()
function wait (time, data = 0) {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), time)
  })
}
test('default', done => {
  const $wait = oneHandle(wait)
  $wait(1, 1).then(data => expect(1).toBe(data))
  $wait(1000, 2).then(data => expect(1).toBe(data))
  $wait(1, 3).then(data => {
    expect(1).toBe(data)
    done()
  })
})
test('cache', done => {
  const $wait = oneHandle(wait, true)
  $wait(1, false).then(data => {
    expect(false).toBe(data)
    return $wait(1, 50)
  })
    .then(data => {
      expect(false).toBe(data)
      done()
    })
})
test('localStorage&getCache', done => {
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
      expect($wait.$getData()).toBe(data)
      $wait.$clear()
      expect($wait.$getData()).toBe(null)
      return $wait(1, objValue)
    })
    .then(data => {
      expect(objValue).toBe(data)
      return $wait(1, false)
    })
    .then(data => {
      expect(objValue).toBe(data)
      // 测试同key情况
      $wait2 = oneHandle(wait, KEY)
      return $wait2(1, {a: 2})
    })
    .then(data => {
      expect(objValue).toStrictEqual(data)
      $wait2.$clear()
      $wait.$update()
      expect($wait.$getData()).toBeNull()
      return $wait2(1, 2)
    })
    .then(data => {
      expect(data).toBe(2)
      $wait.$update()
      expect($wait.$getData()).toBe(2)
      done()
    })
})
test('sessionStorage&context', done => {
  const VALUE = '1\n1' // 故意拿来测试getData内部走报错
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
  let $wait2
  $wait(1, VALUE).then(data => {
    expect(VALUE).toBe(data)
    return $wait(1, 50)
  })
    .then(data => {
      expect(VALUE).toBe(data)
      expect($wait.$getData()).toBe(data)
      $wait2 = oneHandle(obj.wait, KEY, 'sessionStorage', obj)
      expect($wait2.$getData()).toBe($wait.$getData())
      $wait.$clear()
      expect($wait.$getData()).toBe(null)
      return $wait(1, true)
    })
    .then(data => {
      expect(true).toBe(data)
      return $wait(1, false)
    })
    .then(data => {
      expect(true).toBe(data)
      done()
    })
})
test('try', done => {
  function waitTry (time, data = 0) {
    return new Promise(resolve => {
      setTimeout1(() => resolve(data), time)
    })
  }
  const $wait = oneHandle(waitTry, true)
  const Err = "ReferenceError: setTimeout1 is not defined"
  $wait(1).catch(err => expect(err.toString()).toBe(Err))
  $wait(1).catch(err => expect(err.toString()).toBe(Err))
  $wait(1).catch(err => {
    expect(err.toString()).toBe(Err)
    done()
  })
})