# 字符串转 base64 的原理

## 前置知识

- uft8 一个汉字是 3 个字节

- 前端中，2 进制是以 0b 开头，8 进制 0o 或 0 开头，16 进制 0x 开头

- 进制的转换方法

  ```js
  //把任意进制转成10进制
  console.log(parseInt('11', 2)); //3
  console.log(parseInt('115', 8)); //77
  console.log(parseInt('20', 16)); //32

  //把10进制（16进制）转成任意进制
  console.log((3).toString(2)); //11
  console.log((77).toString(8)); //115
  console.log((77).toString(16)); //4d
  ```

## 字符串转 base64 的原理解析

假设我们要把**”中“**这个字转成 base64

#### 一、拿到字符 utf8 编码

Buffer.from()生成编码时，如果中文会用 utr8，一个文字有 3 位字节

如果字母、数字、特殊字符会用 ASCII， 一个文字有 1 位字节

字节用 16 进制显示

```js
let buffer = Buffer.from('中');
console.log(buffer);

// e4 b8 ad
```

#### 二、16 进制转为 2 进制

```js
console.log((0xe4).toString(2));
console.log((0xb8).toString(2));
console.log((0xad).toString(2));

// 11100100  10111000  10101101
```

#### 三、把 8 位的 2 进制数据划分为 6 位一组

base64 一组存 6 位 2 进制，最大存储 `111111`，即 10 进制的 63，加上 0 是 64 位，这也是 base64 名字的由来

```js
11100100  10111000  10101101

111001 001011 100010 101101
```

#### 四、把二进制转成十进制

```js
console.log(parseInt('111001', 2));
console.log(parseInt('001011', 2));
console.log(parseInt('100010', 2));
console.log(parseInt('101101', 2));

/*

57
11
34
45

*/
```

#### 五、转成 base64 编码

```js
const CHARTS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

console.log(CHARTS[57] + CHARTS[11] + CHARTS[34] + CHARTS[45]);

// 5Lit
```

所以**“中”**这个字符串的 base64 的编码是`5Lit` [点击查看](https://base64.us/#d=5Lit)

## 字符串转 base64 的封装函数

```js
function transfer(str) {
  const CHARTS =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const buf = Buffer.from(str);
  let result = '';
  for (let b of buf) {
    result += b.toString(2);
  }
  return result
    .match(/(\d{6})/g)
    .map(val => parseInt(val, 2))
    .map(val => CHARTS[val])
    .join('');
}

let res = transfer('中国');
console.log(res);

// 5Lit5Zu9
```
