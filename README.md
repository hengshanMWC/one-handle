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
```
## Options
```js
/**
 * 多次调用，响应一次，可开缓存
 * 
 * @param {Function} fn 一个返回Promise的函数
 * @param {Boolean} cache 是否开启缓存
 * @param {*} context 上下文
 * @returns {Function} return Promise的闭包
 */
function oneHandle (fn, cache, context) {
```
