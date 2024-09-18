const Promise = require('./promise6');
const fs = require("fs");

/*
// defer方法的使用，解决嵌套的问题
const read = (path) => {
  const dfd = Promise.defer()
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      dfd.reject(err)
    }
    dfd.resolve(data)
  });
  return dfd.promise
}


read('./name.txt').then(data => {
  console.log("data", data)
}, err => {
  console.log("err", err)
});

*/

new Promise((resolve, reject) => {
  reject(new Promise((resolve, reject) =>{
    setTimeout(() => {
      resolve('ok')
    }, 1000)
  }))
}).then(data => {
  console.log("data", data)
}).catch(err => {
  console.log("err", err)
})