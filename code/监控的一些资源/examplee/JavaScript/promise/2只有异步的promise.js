const Promise = require('./promise2');

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('ok')
  }, 1000);
})

promise.then((value) => {
  console.log("success",value)
},reason => {
  console.log("fail",reason)
});

promise.then((value) => {
  console.log("success",value)
},reason => {
  console.log("fail",reason)
});