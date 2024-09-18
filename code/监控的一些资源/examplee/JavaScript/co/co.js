const fs = require("fs").promises;

function* read() {
  const path = yield fs.readFile("./path.txt", "utf8");
  console.log("path", path);
  const name = yield fs.readFile(path, "utf8");
  console.log("name", name);
  return name;
}

function co(iterator) {
  const ctx = this;
  return new Promise((resolve, reject) => {
    // 如果传入的还是 generator 函数，先执行得到迭代器
    if (typeof iterator === 'function') iterator = iterator.call(ctx);

    function next(data) {
      const { value, done } = iterator.next(data);

      if (done) {
        return resolve(value);
      }

      // 可能yield返回的是基本值而不是promise，所以用Promise.resolve包装
      Promise.resolve(value).then(data => {
          next(data);
        },err => {
          reject(err);
        }
      );

      // Promise.resolve(value).then(next,reject) // 可以简写为
    }
    next();
  });
}

co(read()).then(data => {
  console.log("data", data);
}).catch((err) => {
  console.log("err", err);
});