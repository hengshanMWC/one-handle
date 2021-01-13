## Features
多次调用，响应一次，可开缓存
## Scene
one-handle接受一个return Promise的函数生成一个闭包，
里面缓存了一个队列，当并发调用的时候，只会同时触发一次
函数，后面函数都会归到队列里面，等待第一次函数完成，当
然，第一个的Promise状态也会影响到队列里面的状态
（resolve还是reject）
## Introduction
下载方式

npm i one-handle

yarn add one-handle
```js
// 引入方式
// esm
import oneHandle from 'one-handle'
// script
<script src="https://unpkg.com/one-handle"></script>
window.oneHandle
```
使用方式
```js
import oneHandle from 'one-handle'
function wait (time, data = 0) {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), time)
  })
}
const $wait1 = oneHandle(wait)
$wait1(1000, 1).then(data => console.log('只触发一次', data)) // 只触发一次 1
$wait1(4000, 2).then(data => console.log('只触发一次', data)) // 只触发一次 1
$wait1(1, 3).then(data => console.log('只触发一次', data)) // 只触发一次 1
// 使用缓存，第二个参数传true
const $wait2 = oneHandle(wait, true)
// 第一次调用成功返回的值缓存起来，下次调用都会取这个值
$wait2(1, false).then(data => {
    console.log('缓存起来', data) // 缓存起来 false
    return $wait2(1, 50)
  })
    .then(data => console.log('使用缓存', data)) // 使用缓存 false
// 通过设置catch为字符串开启本地缓存
const $wait3 = oneHandle(wait, 'key')
let $wait4
$wait3(1, {a: 1}).then(data => {
    console.log(data) // {a: 1}
    $wait4 = oneHandle(wait, 'key')
    // key一样，随意初始化的缓存一样
    console.log('同步缓存', $wait4.$getData()) // 同步缓存 {a: 1}
    $wait4.$clear() // 清除缓存
    $wait3.$update() // 更新缓存
    // $wait3.$update()更新到的缓存已经被$wait4.$clear()清除了
    console.log($wait3.$getData()) // null
  })
```
## Options
```js
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
```
## API
通过传参方式，可以开启额外的api

### 开启cache
返回的包装函数附带$getData和$clear
```js
const $wait = oneHandle(wait, true)
$wait.$getData() // 返回缓存
$wait.$clear() // 清除缓存
```

### 开启本地缓存(cache参数为string)
返回的包装函数附带$update
```js
const $wait = oneHandle(wait, 'key')
$wait.$update() // 从本地缓存中更新
$wait.$cacheKey // oneHandle-key。缓存的真正key
```
