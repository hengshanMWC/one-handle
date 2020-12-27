const oneHandle = require('../index')
function wait (time, data = 0) {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), time)
  })
}
test('default', () => {
  const $wait = oneHandle(wait)
  $wait(1).then(data => expect(0).toBe(data))
  $wait(1).then(data => expect(0).toBe(data))
  $wait(1).then(data => expect(0).toBe(data))
})
test('cache', () => {
  const $wait = oneHandle(wait, true)
  $wait(1, false).then(data => {
    expect(false).toBe(data)
    return $wait(1, 50)
  })
    .then(data => expect(false).toBe(data))
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