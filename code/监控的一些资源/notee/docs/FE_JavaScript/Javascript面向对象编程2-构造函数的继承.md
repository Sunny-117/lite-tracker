---
title: Javascript面向对象编程（二）：构造函数的继承
date: 2015-12-02 01:00:00
categories: [JavaScript基础]
---

```js
function Animal() {
  this.species = '动物';
}

function Cat(name, color) {
  this.name = name;
  this.color = color;
}

// ------构造函数绑定----------
function Cat(name, color) {
  Animal.apply(this, arguments); //关键
  this.name = name;
  this.color = color;
}

var cat1 = new Cat('大毛', '黄色');
console.log(cat1.species); // 动物

// ------prototype模式----------
// 原本Cat.prototype.constructor指向Cat构造函数
console.log('constructor', Cat.prototype.constructor === Cat); //true

Cat.prototype = new Animal();

// 继承后Cat.prototype.constructor指向Animal构造函数
console.log('constructor', Cat.prototype.constructor === Animal); //true

// 需要把Cat.prototype.constructor重新指向Cat
// 凡是修改了o.prototype,都需要把prototype.constructor重新指向构造函数 o.prototype.constructor = o
Cat.prototype.constructor = Cat;
var cat1 = new Cat('大毛', '黄色');

console.log(cat1.species); // 动物

// ------直接继承prototype----------
function Animal() {}
Animal.prototype.species = '动物';

Cat.prototype = Animal.prototype;
Cat.prototype.constructor = Cat;

var cat1 = new Cat('大毛', '黄色');
console.log(cat1.species); // 动物

// 坏消息是任何对Cat.prototype的修改，都会反映到Animal.prototype，比如Cat.prototype.constructor = Cat
console.log(Animal.prototype.constructor); // Cat

// ------用空对象作为中介----------
function Animal() {}
Animal.prototype.species = '动物';

var F = function() {};
F.prototype = Animal.prototype;

Cat.prototype = new F();

Cat.prototype.constructor = Cat;

// 此时修改Cat的prototype对象，就不会影响到Animal的prototype对象
console.log(Animal.prototype.constructor); // Animal

// 封装成继承函数
function extend(Child, Parent) {
  var F = function() {};
  F.prototype = Parent.prototype;

  Child.prototype = new F();
  Child.prototype.constructor = Child;

  Child.uber = Parent.prototype; // 直接调用父对象的方法
}

// 使用方法
extend(Cat, Animal);

var cat1 = new Cat('大毛', '黄色');
console.log(cat1.species); // 动物

// ------拷贝继承----------
function Animal() {}
Animal.prototype.species = '动物';

// 封装成拷贝方式的继承函数
function extend2(Child, Parent) {
  var p = Parent.prototype;
  var c = Child.prototype;

  for (var i in p) {
    c[i] = p[i];
  }

  c.uber = p;
}

// 使用方法
extend2(Cat, Animal);

var cat1 = new Cat('大毛', '黄色');
console.log(cat1.species); // 动物
```
