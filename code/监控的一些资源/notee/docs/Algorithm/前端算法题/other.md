# 算法题

## Sum All Numbers in a Range

我们会传递给你一个包含两个数字的数组。返回这两个数字和它们之间所有数字的和。
(最小的数字并非总在最前面)

```javascript
function sumAll(arr) {
  var sum = 0;
  var max = Math.max.apply(null, arr);
  var min = Math.min.apply(null, arr);
  for (var i = min; i <= max; i++) {
    sum += i;
  }
  return sum;
}

sumAll([1, 4]); // 10
```

## Diff Two Arrays

比较两个数组，然后返回一个新数组，该数组的元素为两个给定数组中所有独有的数组元素。换言之，返回两个数组的差异。

```js
function diff(arr1, arr2) {
  var filterArr = arr1.filter(function(item) {
    var index = arr2.indexOf(item);
    if (index > -1) {
      arr2.splice(index, 1);
    } else {
      return item;
    }
  });

  return filterArr.concat(arr2);
}

diff([1, 2, 3, 5], [1, 2, 3, 4, 5]); // [4]
```

## Roman Numeral Converter

将给定的数字转换成罗马数字。

```js
function convert(num) {
  var romans = [
    'M',
    'CM',
    'D',
    'CD',
    'C',
    'XC',
    'L',
    'XL',
    'X',
    'IX',
    'V',
    'IV',
    'I',
  ];
  var units = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];

  var res = '';
  units.forEach(function(item, index) {
    while (num >= item) {
      res += romans[index];
      num -= item;
    }
  });

  return res;
}

convert(1984); //MCMLXXXIV
```

## Where art thou

写一个 function，它遍历一个对象数组（第一个参数）并返回一个包含相匹配的属性-值对（第二个参数）的所有对象的数组。如果返回的数组中包含 source 对象的属性-值对，那么此对象的每一个属性-值对都必须存在于 collection 的对象中。

例如，如果第一个参数是 [{ first: "Romeo", last: "Montague" }, { first: "Mercutio", last: null }, { first: "Tybalt", last: "Capulet" }]，第二个参数是 { last: "Capulet" }，那么你必须从数组（第一个参数）返回其中的第三个对象，因为它包含了作为第二个参数传递的属性-值对。

```js
function where(collection, source) {
  var arr = [];

  for (var i = 0; i < collection.length; i++) {
    var boon = true;
    for (var key in source) {
      if (collection[i][key] !== source[key]) boon = false;
    }
    if (boon) arr.push(collection[i]);
  }
  return arr;
}

where(
  [
    { first: 'Romeo', last: 'Montague' },
    { first: 'Mercutio', last: null },
    { first: 'Tybalt', last: 'Capulet' },
  ],
  { last: 'Capulet' },
);
// [{ first: "Tybalt", last: "Capulet" }]
```

## Search and Replace

使用给定的参数对句子执行一次查找和替换，然后返回新句子。

第一个参数是将要对其执行查找和替换的句子。

第二个参数是将被替换掉的单词（替换前的单词）。

第三个参数用于替换第二个参数（替换后的单词）。

注意：替换时保持原单词的大小写。例如，如果你想用单词 "dog" 替换单词 "Book" ，你应该替换成 "Dog"。

```js
function myReplace(str, before, after) {
  var newAfter = after;
  var firstBoot = /[A-Z]/.test(before.charAt(0));
  if (firstBoot) {
    var firstStr = after.charAt(0).toUpperCase();
    newAfter = after.replace(/^./, firstStr);
  }
  var res = str.replace(before, newAfter);
  return res;
}

myReplace('A quick brown fox jumped over the lazy dog', 'jumped', 'leaped');

// A quick brown fox leaped over the lazy dog
```

## Pig Latin

把指定的字符串翻译成 pig latin。
Pig Latin 把一个英文单词的第一个辅音或辅音丛（consonant cluster）移到词尾，然后加上后缀 "ay"。
如果单词以元音开始，你只需要在词尾添加 "way" 就可以了。

```js
function translate(str) {
  var vowels = ['a', 'e', 'r', 'o', 'u'];
  var arr = str.split('');
  var bool = false;

  while (vowels.indexOf(arr[0]) === -1) {
    arr.push(arr[0]);
    arr.splice(0, 1);
    bool = true;
  }
  if (bool) {
    arr.push('a', 'y');
  } else {
    arr.push('w', 'a', 'y');
  }

  return arr.join('');
}
translate('consonant');
// onsonantcay
```

## DNA Pairing

DNA 链缺少配对的碱基。依据每一个碱基，为其找到配对的碱基，然后将结果作为第二个数组返回。
Base pairs（碱基对） 是一对 AT 和 CG，为给定的字母匹配缺失的碱基。
在每一个数组中将给定的字母作为第一个碱基返回。
例如，对于输入的 GCG，相应地返回 [["G", "C"], ["C","G"],["G", "C"]]
字母和与之配对的字母在一个数组内，然后所有数组再被组织起来封装进一个数组。

```js
function pair(str) {
  var res = [];
  var map1 = ['A', 'T', 'C', 'G'];
  var map2 = ['T', 'A', 'G', 'C'];
  for (var i = 0; i < str.length; i++) {
    var tempArr = [];
    var index = map1.indexOf(str[i]);
    tempArr.push(str[i]);
    tempArr.push(map2[index]);
    res.push(tempArr);
  }
  return res;
}
pair('GCG');
// [["G","C"],["C","G"],["G","C"]]
```

## Missing letters

从传递进来的字母序列中找到缺失的字母并返回它。
如果所有字母都在序列中，返回 undefined。

```js
function fearNotLetter(str) {
  var letters = 'abcdefghijklmnopqrstuvwxyz';
  var firstIndex = 0;
  var lastIndex = 0;
  for (var i = 0; i < letters.length; i++) {
    if (letters[i] === str[0]) firstIndex = i;
    if (letters[i] === str[str.length - 1]) lastIndex = i;
  }

  var res = '';
  var all = letters.substring(firstIndex, lastIndex);
  for (var j = 0; j < all.length; j++) {
    if (str.indexOf(all[j]) === -1) {
      res += all[j];
    }
  }

  return res ? res : undefined;
}
fearNotLetter('abce');
// d
```

```js
function fearNotLetter(str) {
  var firstCode = str.charCodeAt(0);
  var lastCode = str.charCodeAt(str.length - 1);
  var allCode = [];
  for (var i = 0; i < str.length; i++) {
    allCode.push(str.charCodeAt(i));
  }

  // var missCode = [];
  var missCode = 0;
  for (var j = firstCode; j < lastCode; j++) {
    if (allCode.indexOf(j) === -1) {
      missCode = j;
    }
  }

  return missCode ? String.fromCharCode(missCode) : undefined;
}
fearNotLetter('abce');
// d
```

## Boo who

检查一个值是否是基本布尔类型，并返回 true 或 false。
基本布尔类型即 true 和 false。

```js
function boo(bool) {
  //return bool === true || bool === false ? true : false;
  return typeof bool === 'boolean' ? true : false;
}
boo(null);
// false
```

## Sorted Union

写一个 function，传入两个或两个以上的数组，返回一个以给定的原始数组排序的不包含重复值的新数组。
换句话说，所有数组中的所有值都应该以原始顺序被包含在内，但是在最终的数组中不包含重复值。
非重复的数字应该以它们原始的顺序排序，但最终的数组不应该以数字顺序排序。

```js
function unite(arr1, arr2, arr3) {
  var res = [];
  for (var i = 0; i < arguments.length; i++) {
    for (var j = 0; j < arguments[i].length; j++) {
      if (res.indexOf(arguments[i][j]) === -1) {
        res.push(arguments[i][j]);
      }
    }
  }
  return res;
}

unite([1, 3, 2], [5, 2, 1, 4], [2, 1]);
// [1,3,2,5,4]
```

```js
function unite(arr1, arr2, arr3) {
  var all = [];

  for (var i = 0; i < arguments.length; i++) {
    all.push.apply(all, arguments[i]);
  }

  var res = all.reduce(function(arr, item) {
    if (!arr.includes(item)) arr.push(item);
    return arr;
  }, []);

  return res;
}

unite([1, 3, 2], [5, 2, 1, 4], [2, 1]);
// [1,3,2,5,4]
```

## Convert HTML Entities

将字符串中的字符 &、<、>、" （双引号）, 以及 ' （单引号）转换为它们对应的 HTML 实体。

```js
function convert(str) {
  var res = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;');

  return res;
}

convert('Dolce & Gabbana');
// Dolce &amp; Gabbana
```

## Spinal Tap Case

将字符串转换为 spinal case。Spinal case 是 all-lowercase-words-joined-by-dashes 这种形式的，也就是以连字符连接所有小写单词。

```js
function spinalCase(str) {
  var res = str
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^\s/, '')
    .replace(/\s+/g, '-')
    .toLowerCase();

  return res;
}

spinalCase('This Is Spinal Tap');
// this-is-spinal-tap
```

## Sum All Odd Fibonacci Numbers

给一个正整数 num，返回小于或等于 num 的斐波纳契奇数之和。
斐波纳契数列中的前几个数字是 1、1、2、3、5 和 8，随后的每一个数字都是前两个数字之和。
例如，sumFibs(4)应该返回 5，因为斐波纳契数列中所有小于 4 的奇数是 1、1、3。
提示：此题不能用递归来实现斐波纳契数列。因为当 num 较大时，内存会溢出，推荐用数组来实现。

```js
function sumFibs(num) {
  var fibonacci = [];
  var sum = 0;
  var count = 1;

  while (sum <= num) {
    var temp = sum;
    sum += count;
    count = temp;
    fibonacci.push(sum);
  }

  var res = fibonacci.reduce(function(sum, item) {
    return item <= num && item % 2 === 1 ? sum + item : sum;
  });
  return res;
}

sumFibs(9);
// 10
```

# Sum All Primes

求小于等于给定数值的质数之和。
只有 1 和它本身两个约数的数叫质数。例如，2 是质数，因为它只能被 1 和 2 整除。1 不是质数，因为它只能被自身整除。
给定的数不一定是质数。

```js
function sumPrimes(num) {
  var prime = [];
  for (var i = 1; i <= num; i++) {
    //第一层循环，记录1-100中所有i 的数值
    for (var j = 2; j < i; j++) {
      //第二层循环，设置一个比i小的因子，从j=2开始自增
      if (i % j === 0) {
        break; //当i能够整除j的时候跳出循环。
      }
    }
    if (i <= j && i !== 1) {
      prime.push(i); //将没有因数的i，且i不等于1，添加到数组中。
    }
  }
  var res = prime.reduce(function(sum, item) {
    return sum + item;
  });

  return res;
}

sumPrimes(10);
// 17
```
