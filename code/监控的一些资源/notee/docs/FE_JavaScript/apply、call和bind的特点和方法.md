# apply、call、bind 的特点和方法

- call 可以在调用函数时改变 this 的指向,方法.call(this, 参数 1, 参数 2)
- apply 可以在调用函数时改变 this 的指向,方法.apply(this, [参数 1, 参数 2])
- bind 可以复制函数，复制时可以改变 this 的指向，同时选择是否传入参数，也可以在调用时再传入参数

```js
function f1(x, y) {
  console.log(x + y, '| age==', this.age);
}
var obj = {
  age: 10,
};

// f1(10, 20);

// f1.call(obj, 10, 20);

// f1.apply(obj, [10, 20]);

var res1 = f1.bind(obj, 10, 20);
var res2 = f1.bind(obj);

console.log('res1', res1());
console.log('res2', res2(10, 20));

// call可以在调用函数时改变this的指向,方法.call(this, 参数1, 参数2)
// apply可以在调用函数时改变this的指向,方法.apply(this, [参数1, 参数2])
// bind可以复制函数，复制时可以改变this的指向，同时选择是否传入参数，也可以在调用时再传入参数
```
