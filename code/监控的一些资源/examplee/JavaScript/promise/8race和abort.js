const Promise = require('./promise8')

const wrap = (p1) => {
  let abort
  const p2 = new Promise((resolve, reject) => {
    abort = reject
  })
  let p = Promise.race([p1, p2])
  p.abort = abort
  return p
}

let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('ok')
  }, 10000)
})

let newPromise = wrap(promise)

setTimeout(() => {
  newPromise.abort('超时了')
}, 3000)

newPromise.then(data => {
  console.log("data", data)
}).catch(err => {
  console.log("err", err)
})

