// 柯里化的作用，多参数收集的功能

// 生成isString判断类型函数，细化函数的功能，让他变得更具体一些

// 1.简易版

/*
const isType = (type) => (value) => {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
};

let util = {};
['String', 'Number', 'Boolean', 'Object', 'Array', 'Null', 'Undefined'].forEach(type => {
  util['is' + type] = isType(type)
});

console.log(util.isString('abc'));
// true

*/

// 2.通用的函数柯里化
/*
const sum = (a, b, c, d) => {
  console.log(a, b, c, d);
};

const currying = (fn, arr = []) => {
  let length = fn.length;
  return (...args) => {
    let newArr = [...arr, ...args];
    if (newArr.length < length) {
      return currying(fn, newArr);
    } else {
      return fn(...newArr);
    }
  };
};

const newSum = currying(sum);

newSum(1, 2)(3, 4);
// 1 2 3 4
*/

// 3.用通用函数柯里化包装判断类型函数
/*
const currying = (fn, arr = []) => {
  let length = fn.length;
  return (...args) => {
    let newArr = [...arr, ...args];
    if (newArr.length < length) {
      return currying(fn, newArr);
    } else {
      return fn(...newArr);
    }
  };
};

const isType = (type, value) => {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
};

let util = {};
['String', 'Number', 'Boolean', 'Object', 'Array', 'Null', 'Undefined'].forEach(type => {
  util['is' + type] = currying(isType)(type)
});

console.log(util.isString('abc'));
// true
*/