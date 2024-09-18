---
title: javascript的快速排序
date: 2019-02-02 23:00:00
categories: [JavaScript应用]
# JavaScript基础, JavaScript应用, 正则表达式, WebApi, CSS应用, Vue
# JavaScript初级算法题, JavaScript中级级算法题, JavaScript高级算法题
---

```js
let quickSort = function(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  let midIndex = Math.floor(arr.length / 2);
  let mid = arr.splice(midIndex, 1)[0];

  let left = [];
  let right = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] <= mid) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), mid, ...quickSort(right)];
};

// 利用箭头函数和filter一句话的快速排序
function quickSort(arr) {
  return arr.length <= 1
    ? arr
    : [
        ...quickSort(arr.slice(1).filter(item => item <= arr[0])),
        arr[0],
        ...quickSort(arr.slice(1).filter(item => item > arr[0])),
      ];
}

console.log(quickSort([2, 5, 103, 8, 54, 24]));
// [2, 5, 8, 24, 54, 103]
```
