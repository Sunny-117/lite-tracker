---
title: 正则表达式replace的函数用法
date: 2018-12-26 19:00:00
categories: [正则表达式]
---

```js
'border-top'.replace(/(\-)([a-z])/g, function(match, $1, $2, offset, string) {
  console.log(match);
  console.log($1);
  console.log($2);
  console.log(offset);
  console.log(string);
  $1 = '';
  $2 = $2.toUpperCase();
  return $1 + $2;
});
// => -t
// => -
// => t
// => 6
// => border-top
// => "borderTop"
```
