require('jest-localstorage-mock')
const oneHandle = require('../index')
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
// test('localStorage', () => {
//   const VALUE = 'a'
//   const KEY = 'foo'
//   const $wait = oneHandle(KEY, wait, true)
//   $wait(1, VALUE).then(data => {
//     expect(VALUE).toBe(data)
//     return $wait(1, 50)
//   })
//     .then(data => expect(VALUE).toBe(data))
//   expect(localStorage.setItem).toHaveBeenLastCalledWith(KEY, VALUE);
//   expect(localStorage.__STORE__[KEY]).toBe(VALUE)
//   $wait.$clear()
// })
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