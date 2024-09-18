# esj 模板引擎原理

### 1.模板渲染变量

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <%=name%> <%=age%>
  </body>
</html>
```

我们希望把 html 里的 name 和 age，按照 ejs 的用法传入对应的值，就能在返回渲染后的模板
只需要用正则把 `<%=`和`%>`之间的变量取到，再取值就可以了

```js
const path = require('path');
const fs = require('fs');

function renderFile(filename, data, cb) {
  let html = fs
    .readFileSync(filename, 'utf8')
    .replace(/<%=(.+?)%>/g, function() {
      return data[arguments[1]];
    });
  cb(null, html);
}

renderFile(
  path.resolve(__dirname, 'template.html'),
  { name: 'zwh', age: 18 },
  function(err, data) {
    console.log(data);
  },
);
```

### 2.模板里面写 js 语法

我们希望像 ejs 一样，可以在模板里写 js 语法。

**模板引擎的核心 with+function**

```js
// 示例
function fn(obj) {
  let str = '';
  with (obj) {
    str += `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body>`;

    arr.forEach(item => {
      str += `<a>${item}</a>`;
    });

    str += `
            </body>
        </html>`;
  }
  return str;
}

console.log(fn({ arr: [1, 2, 3] }));
```

function 里面用 with 改变作用域，最后返回拼接的 str，打印出来的下面这个结果

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <a>1</a><a>2</a><a>3</a>
  </body>
</html>
```

**修改 renderFile 函数**

所以我们只要把模板里的字符拼成上面这样就可以了

```js
const path = require('path');
const fs = require('fs');

function renderFile(filename, data, cb) {
  let template = fs.readFileSync(filename, 'utf8');
  let head = `let str = ''\r\n`;
  head += `with (obj) {\r\n`;
  head += 'str += `';

  head += template.replace(/<%(.+?)%>/g, function() {
    return '`\r\n' + arguments[1] + '\r\nstr += `';
  });

  let tail = '`;\r\n } \r\n return str;';

  let fn = new Function('obj', head + tail);
  cb(null, fn(data));
}

renderFile(
  path.resolve(__dirname, 'template.html'),
  { arr: [1, 2, 3] },
  function(err, data) {
    console.log(data);
  },
);
```

```html
// 渲染前
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <%arr.forEach(item => {%>
    <a>111<a>
  <%})%>
</body>
</html>

// 渲染后
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>

    <a>111<a>

    <a>111<a>

    <a>111<a>

</body>
</html>
```

### 3.js 语法+渲染变量

最后把渲染变量的 3 行加上就完成了

```js
const path = require('path');
const fs = require('fs');

function renderFile(filename, data, cb) {
  let template = fs.readFileSync(filename, 'utf8');

  template = template.replace(/<%=(.+?)%>/g, function() {
    // 渲染变量
    return '${' + arguments[1] + '}';
  });

  let head = `let str = ''\r\n`;
  head += `with (obj) {\r\n`;
  head += 'str += `';

  head += template.replace(/<%(.+?)%>/g, function() {
    return '`\r\n' + arguments[1] + '\r\nstr += `';
  });

  let tail = '`;\r\n } \r\n return str;';

  let fn = new Function('obj', head + tail);
  cb(null, fn(data));
}

renderFile(
  path.resolve(__dirname, 'template.html'),
  { arr: [1, 2, 3] },
  function(err, data) {
    console.log(data);
  },
);
```

```html
// 渲染前
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <%arr.forEach(item => {%>
    <a><%=item%></a>
    <%})%>
  </body>
</html>

// 渲染后
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <a>1</a>

    <a>2</a>

    <a>3</a>
  </body>
</html>
```
