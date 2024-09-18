
const fs = require('fs');

const promisify = (fn) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, function(err, data) {
        if (err) reject(err);
        resolve(data);
      })
    })
  }
}

/*
let read = promisify(fs.readFile)

read('./name.txt', 'utf8').then(data => {
  console.log("data", data)
})
*/


const promisifyAll = (target) => {
  Reflect.ownKeys(target).forEach(key => {
    if (typeof target[key] === 'function') {
      target[key + 'Async'] = promisify(target[key]);
    }
  })
  return target;
}

const newFs = promisifyAll(fs);

newFs.readFileAsync('./name.txt', 'utf8').then(data => {
  console.log("data", data)
})