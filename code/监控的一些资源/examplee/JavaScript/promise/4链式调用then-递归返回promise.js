const Promise = require('./promise4');

const fs = require("fs");

const read = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    });
  })
}

const promise2 = read('./name.txt').then(data => {
  return new Promise((resolve, reject) => {
    setTimeout(() =>{
      resolve(new Promise((resolve, reject) => {
        setTimeout(() =>{
          reject('xxx')
        }, 1000)
      }))
    }, 1000)
  })
})


promise2.then((value) => {
  console.log("success", value)
},reason => {
  console.log("fail",reason)
});