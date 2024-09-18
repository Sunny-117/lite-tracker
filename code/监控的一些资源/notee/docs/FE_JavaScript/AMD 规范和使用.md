---
title: AMD 规范和使用
date: 2016-02-02 01:00:00
categories: [JavaScript应用]
# JavaScript基础, JavaScript应用, 正则表达式, WebApi, CSS应用, Vue
# JavaScript初级算法题, JavaScript中级级算法题, JavaScript高级算法题
---

```js
// math.js
//匿名函数返回一个对象
define(function() {
  var add = function(x, y) {
    return x + y;
  };

  return {
    add: add,
  };
});

// main.js
require(['math'], function(math) {
  alert(math.add(1, 1));
});
```
