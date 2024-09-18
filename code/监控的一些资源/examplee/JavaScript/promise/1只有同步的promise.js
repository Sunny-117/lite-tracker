const Promise = require('./promise1');

const promise = new Promise((resolve, reject) => {
  reject('e')
  // throw new Error('errr')
  // resolve('ok')
})

promise.then((value) => {
  console.log("success",value)
},reason => {
  console.log("fail",reason)
});