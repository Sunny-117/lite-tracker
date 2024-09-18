---
title: 算法中级-构造一个 Person 类
date: 2019-04-12 22:00:00
categories: [JavaScript中级级算法题]
---

在这道题目中，我们需要写一个构造器（constructor）函数。它只接收一个字符串参数 firstAndLast，这个参数代表一个英文名的全名（姓和名）。这个构造函数创建出的实例需要具有以下方法：

getFirstName() getLastName() getFullName()
setFirstName(first) setLastName(last) setFullName(firstAndLast)

这些方法应当可以通过构造函数创建出的实例调用。

```js
var Person = function(firstAndLast) {
  var first = firstAndLast.split(' ')[0];
  var last = firstAndLast.split(' ')[1];

  this.getFirstName = function() {
    return first;
  };
  this.getLastName = function() {
    return last;
  };
  this.getFullName = function() {
    return first + ' ' + last;
  };

  this.setFirstName = function(firsName) {
    first = firsName;
  };
  this.setLastName = function(lastName) {
    last = lastName;
  };
  this.setFullName = function(fullName) {
    first = fullName.split(' ')[0];
    last = fullName.split(' ')[1];
  };
};

var bob = new Person('Bob Ross');
bob.getFullName();

/*
var Person = function (firstAndLast) {
  this.getFirstName = function () {
    return firstAndLast.split(" ")[0];
  };
  this.getLastName = function () {
    return firstAndLast.split(" ")[1];
  };
  this.getFullName = function () {
    return firstAndLast;
  };

  this.setFirstName = function (name) {
    firstAndLast = name + " " + firstAndLast.split(" ")[1];
  };
  this.setLastName = function (name) {
    firstAndLast = firstAndLast.split(" ")[0] + " " + name;
  };
  this.setFullName = function (name) {
    firstAndLast = name;
  };
};
*/

// Object.keys(bob).length应该返回 6。
// bob instanceof Person应该返回true。
// bob.firstName应该返回undefined。
// bob.lastName应该返回undefined。
// bob.getFirstName()应该返回 "// Bob"。
// bob.getLastName()应该返回 "Ross"。
// bob.getFullName()应该返回 "Bob Ross"。
// 调用bob.setFirstName("Haskell")之后，bob.getFullName()应该返回 "Haskell Ross"。
// 调用bob.setLastName("Curry")之后，bob.getFullName()应该返回 "Haskell Curry"。
// 调用bob.setFullName("Haskell Curry")之后，bob.getFullName()应该返回 "Haskell Curry"。
// 调用bob.setFullName("Haskell Curry")之后，bob.getFirstName()应该返回 "Haskell"。
// 调用bob.setFullName("Haskell Curry")之后，bob.getLastName()应该返回 "Curry"。
```
