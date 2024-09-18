---
title: Javascript 面向对象编程（一）：封装
date: 2015-12-02 01:00:00
categories: [JavaScript基础]
---

```js
// -------原始模式-------
function Cat(name, color) {
  return {
    name: name,
    color: color,
  };
}

var cat1 = Cat('大毛', '黄色');
var cat2 = Cat('二毛', '黑色');

console.log('cat1', cat1);
// console.log('cat2', cat2);

// -----构造函数模式-------
function Cat(name, color) {
  this.name = name;
  this.color = color;
}

var cat1 = new Cat('大毛', '黄色');
var cat2 = new Cat('二毛', '黑色');

console.log('cat1', cat1);
console.log('cat2', cat2);

console.log('cat1.constructor', cat1.constructor == Cat); //true
console.log('cat2.constructor', cat2.constructor == Cat); //true

console.log('cat1 instanceof', cat1 instanceof Cat); //true
console.log('cat2 instanceof', cat2 instanceof Cat); //true

// -------构造函数模式的问题-------
function Cat(name, color) {
  this.name = name;
  this.color = color;
  this.type = '猫科动物';
  this.eat = function() {
    alert('吃老鼠');
  };
}

var cat1 = new Cat('大毛', '黄色');
var cat2 = new Cat('二毛', '黑色');

console.log(cat1.eat == cat2.eat); //false
console.log(cat1.type == cat2.type); //true

// -------Prototype模式-------
function Cat(name, color) {
  this.name = name;
  this.color = color;
}

Cat.prototype.type = '猫科动物';
Cat.prototype.eat = function() {
  alert('吃老鼠');
};

var cat1 = new Cat('大毛', '黄色');
var cat2 = new Cat('二毛', '黑色');

console.log(cat1.eat == cat2.eat); //true

for (var prop in cat1) {
  console.log('cat1[' + prop + ']=' + cat1[prop]);
}
```
