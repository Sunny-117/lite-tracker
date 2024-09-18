# buffer 与二进制基本知识

### 字节和位

- 一个字节由八个位组成，最大转换成十进制是 255
- ASCII 都是一个字节
- gb2312 一个汉字由 2 个字节组成，用了一部分来设计汉字
- utf8 一个汉字是 3 个字节

- 前端中，2 进制是以 0b 开头，8 进制 0o 或 0 开头，16 进制 0x 开头

### 进制的转换

手动计算，当前位所在的值 \* 进制^所在位，累加可以转换成 10 进制

js 也提供了自动转换的函数

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

### 定义 buffer 的三种方式

- buffer 的声明方式都是固定大小的，声明出来后不能随意改变
- buffer 的字节以 16 进制显示
- Buffer.isBuffer() 可以判断是否为 buffer
- buffer.length 是字节的长度
- buffer.toString('utf8'/'base64') 可以把 buffer 转成 utf8 字符串 或者 base64 字符串，不填是 'utf8'
- Buffer.from()生成编码时，如果中文会用 utr8，一个文字有 3 位字节；如果字母、数字、特殊字符会用 ASCII， 一个文字有 1 位字节
- Buffer 的字节都是用 16 进制显示

```javascript
let buf1 = Buffer.alloc(6);
let buf2 = Buffer.from('深圳');
let buf3 = Buffer.from([65, 66, 67]);

console.log(Buffer.isBuffer(buf2));
// true

console.log(buf2.length);
// 6

console.log(buf2.toString());
// 深圳
```

### buffer 的扩容

**buff.copy()**

`源buf.copy(目标buf, 目标buf起始位置, 源buf起始位置(默认0), 源buf结束位置(默认最后一位))`

创建新分配空间，再挨个复制进去（比较少用，因为要计算字节空间和偏移量）

```js
const buf = Buffer.alloc(12);
const buffer1 = Buffer.from('中国');
const buffer2 = Buffer.from('深圳');

buffer1.copy(buf, 0, 0, 6);
buffer2.copy(buf, 6, 0, 6);

console.log(buf);

// e4 b8 ad e5 9b bd e6 b7 b1 e5 9c b3
```

```js
// 实现原理
Buffer.prototype.copy = function(
  targetBuffer,
  targetStart,
  sourceStart = 0,
  sourceEnd = this.length,
) {
  for (let i = sourceStart; i < sourceEnd; i++) {
    targetBuffer[targetStart++] = this[i];
  }
};
```

#### Buffer.concat()

`Buffer.concat([buf1, buf2], 合并截取多少字节)`

concat 直接合并

```js
const buffer1 = Buffer.from('中国');
const buffer2 = Buffer.from('深圳');

const buf = Buffer.concat([buffer1, buffer2]);
console.log(buf);

// e4 b8 ad e5 9b bd e6 b7 b1 e5 9c b3
```

```js
// 实现原理
Buffer.concat = function(
  bufferList,
  length = bufferList.reduce((r, v) => r + v.length, 0),
) {
  let buf = Buffer.alloc(length);
  let offset = 0;
  bufferList.forEach(bufItem => {
    bufItem.copy(buf, offset);
    offset += bufItem.length;
  });
  return buf.slice(0, offset);
};
```

### buffer 中常用的方法

- buff.toString()
- buff.fill()
- buff.slice()
- buff.copy
- Buffer.concat()
- Buffer.isBuffer()
- indexOf
