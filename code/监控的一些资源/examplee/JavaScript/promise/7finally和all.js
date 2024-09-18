const Promise = require('./promise7');



/*
// 最后的成果或者失败取决于finally是否失败
Promise.resolve(100).finally(() => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1)
    }, 1000)
  })
}).then(data => {
  console.log("data", data)
}).catch(err => {
  console.log("err", err)
})
*/

let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('res1')
  }, 1000)
})
let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('res2')
  }, 1000)
})

Promise.all([1, 2, 3, p1, p2, 5]).then(data => {
  console.log("data", data)
}).catch(err => {
  console.log("err", err)
})