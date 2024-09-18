---
title: 算法中级-转换HTML实体
date: 2019-04-12 22:00:00
categories: [JavaScript中级级算法题]
---

在这道题目中，我们需要写一个转换 HTML entity 的函数。需要转换的 HTML entity 有&、<、>、"（双引号）和'（单引号）。

```js
let lentity = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};
function convertHTML(str) {
  // 解法一
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;');

  // 解法二
  return str.replace(/\&|\<|\>|\'|\"/g, function(match) {
    return lentity[match];
  });

  // 解法三
  return str
    .split('')
    .map(item => lentity[item] || item)
    .join('');
}

convertHTML('Dolce & Gabbana');

// convertHTML("Dolce & Gabbana")应该返回Dolce &​amp; Gabbana。
// convertHTML("Hamburgers < Pizza < Tacos")应该返回Hamburgers &​lt; Pizza &​lt; Tacos。
// convertHTML("Sixty > twelve")应该返回Sixty &​gt; twelve。
// convertHTML('Stuff in "quotation marks"')应该返回Stuff in &​quot;quotation marks&​quot;。
// convertHTML("Schindler's List")应该返回Schindler&​apos;s List。
// convertHTML("<>")应该返回&​lt;&​gt;。
// convertHTML("abc")应该返回abc。
```
