---
title: 算法中级-DNA配对
date: 2019-04-12 22:00:00
categories: [JavaScript中级级算法题]
---

在这道题目中，我们需要写一个函数，为 DNA 中的碱基配对。这个函数只接收一个表示碱基的字符串为参数，最后返回完成配对的二维数组。

碱基对 由一对碱基组成。碱基有四种，分别为 A（腺嘌呤）、T（胸腺嘧啶）、G（鸟嘌呤）和 C（胞嘧啶）。配对原则是：A 与 T 配对，C 与 G 配对。我们需要根据这个原则对传入的所有碱基进行配对。

对于每个传入的碱基，我们应采用数组的形式展示配对结果。其中，传入的碱基需要作为数组的第一个元素出现。最终返回的数组中应当包含参数中每一个碱基的配对结果。

比如，传入的参数是 GCG，那么函数的返回值应为 [["G", "C"], ["C","G"],["G", "C"]]

```js
// 解法一,数组匹配
function pairElement(str) {
  let pairs1 = ['A', 'T', 'C', 'G'];
  let pairs2 = ['T', 'A', 'G', 'C'];
  return str.split('').map(item => {
    let index = pairs1.indexOf(item);
    return [item, pairs2[index]];
  });
}

// 解法二,对象匹配
function pairElement(str) {
  let pairs = {
    A: 'T',
    T: 'A',
    C: 'G',
    G: 'C',
  };
  return str.split('').map(x => [x, pairs[x]]);
}

pairElement('GCG');

// pairElement("ATCGA")应该返回[["A","T"],["T","A"],["C","G"],["G","C"],["A","T"]]。
// pairElement("TTGAG")应该返回[["T","A"],["T","A"],["G","C"],["A","T"],["G","C"]]。
// pairElement("CTCTA")应该返回[["C","G"],["T","A"],["C","G"],["T","A"],["A","T"]]。
```
