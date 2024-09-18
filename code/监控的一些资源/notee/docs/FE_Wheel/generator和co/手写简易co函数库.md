# 手写简易 co 函数库

## 1.什么是 co 函数库

如果你要用 Generator 函数处理异步操作，写成同步的写法，应该是这样的

```js
//------- ptah.txt -------//
name.txt;

//------- name.txt -------//
zwh;

const fs = require('fs').promises;

function* read() {
  const path = yield fs.readFile('./path.txt', 'utf8');
  const name = yield fs.readFile(path, 'utf8');
  return name;
}
```

```js
const it = read();
const { value, done } = it.next();
value.then(data => {
  console.log('data1', data);

  const { value, done } = it.next(data);
  value.then(data => {
    console.log('data2', data);

    const { value, done } = it.next(data);
    console.log('data3', value, done);
  });
});

/*
data1 name.txt
data2 zwh
data3 zwh true
*/
```

[代码 1](https://github.com/zwhid/example/blob/de5452a64db5a766afce1ce8cf3771d407cb93e9/JavaScript/co/co.js)

## 2.用 co 执行 Generator

co 函数库就是用来自动执行 Generator 函数的，如果用 co 函数库来解决的话，是这样的

```js
const co = require('co');

co(read()).then(data => {
  console.log('data', data);
});

/*
data zwh
*/
```

[代码 3](https://github.com/zwhid/example/blob/c02b7ef60b4d586c599eca41d10bb74f28d411e2/JavaScript/co/co.js)

## 3.实现简易 co 函数库

下面我们来简单实现 co 函数库

```js
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
      Promise.resolve(value).then(
        data => {
          next(data);
        },
        err => {
          reject(err);
        },
      );

      // Promise.resolve(value).then(next,reject) // 可以简写为
    }
    next();
  });
}

// const co = require('co');

co(read())
  .then(data => {
    console.log('data', data);
  })
  .catch(err => {
    console.log('err', err);
  });

/*
data zwh
*/
```

[代码 4](https://github.com/zwhid/example/blob/48d4c2a029fde3a3682b4be7363f60347c32d398/JavaScript/co/co.js)

## 4.题外

迭代器手动抛出错误，可以被 Generator 函数的 try catch 捕获到

```js
function* read() {
  try {
    const path = yield fs.readFile('./path1.txt', 'utf8');
    const name = yield fs.readFile(path, 'utf8');
    return name;
  } catch (error) {
    console.log('===\n', error);
  }
}

const it = read();
const { value, done } = it.next();
value
  .then(data => {
    console.log('data1', data);

    const { value, done } = it.next(data);
    value.then(data => {
      console.log('data2', data);

      const { value, done } = it.next(data);
      console.log('data3', value, done);
    });
  })
  .catch(err => {
    it.throw(err); //迭代器手动抛出错误，可以被try catch捕获到
  });

/*
===
[Error: ENOENT: no such file or directory, open './path1.txt'] {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: './path1.txt'
}
*/
```

[代码 2](https://github.com/zwhid/example/blob/a8408afd729245ebc35aa1d1abfb3e8a5602ea59/JavaScript/co/co.js)

[co 函数库源码](https://github.com/tj/co/blob/master/index.js)
