# 手写 koa-bodyparser 中间件

```js
const querystring = require('querystring');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
module.exports = function bodyParser(uploadDir) {
  return async (ctx, next) => {
    ctx.request.body = await body(ctx, uploadDir);
    return next();
  };
};
async function body(ctx, uploadDir) {
  return new Promise((resolve, reject) => {
    let arr = [];
    ctx.req.on('data', function(chunk) {
      arr.push(chunk);
    });
    ctx.req.on('end', function() {
      /*
                接受到的请求体可能有3种类型
                1.表单类型 a=1&b=2
                2.json 类型 {a:1,b:2}
                3.普通文本类型
                4.文件类型
            */
      let type = ctx.get('content-type'); // koa内置方法，等于req.headers.content-type'
      let data = Buffer.concat(arr);
      // 表单类型
      if (type == 'application/x-www-form-urlencoded') {
        resolve(querystring.parse(data.toString())); // 转成对象 querystring.parse('a=1&b=2','&','=')
        // json 类型
      } else if (type == 'application/json') {
        resolve(JSON.parse(data.toString()));
        // 普通文本类型
      } else if (type === 'text/plain') {
        resolve(data.toString());
        // 文件类型
      } else if (type.startsWith('multipart/form-data')) {
        // 文件类型的请求体用 -- bondary 分割
        let bondary = '--' + type.split('=')[1];
        // 3 行数据会分割出 5行
        let lines = data.split(bondary);
        // 去掉头尾无用的数据
        lines = lines.slice(1, -1);
        // console.log(lines)
        let resultObj = {};
        lines.forEach(line => {
          // 用两个空行分割出表单头和表单体
          let [head, body] = line.split('\r\n\r\n');
          head = head.toString();
          let key = head.match(/name="(.+?)"/)[1];
          // 表单头带有 filename 字段的是文件，否则是普通表单
          if (!head.includes('filename')) {
            resultObj[key] = body.slice(0, -2).toString();
          } else {
            let originalName = head.toString().match(/filename="(.+?)"/)[1]; // 原文件名
            let filename = uuid.v4(); // 产生一个唯一的文件名
            let content = line.slice(head.length + 4, -2); // 获取文件内容，body 有 \r\n\r\n 是不准确的
            fs.writeFileSync(path.join(uploadDir, filename), content); // 写入文件到服务器
            resultObj[key] = resultObj[key] || []; // 多个文件的情况下
            resultObj[key].push({
              size: content.length,
              name: originalName,
              filename,
            });
          }
        });
        resolve(resultObj); // {user:'zwh',pwd:'123456',avatar:[{size:25,name:1.jpg,filename:f3r6w9-n4p8c5}]}
      } else {
        resolve();
      }
    });
  });
}

// buffer.split() 分割二进制方法。原理利用 buffer.indexOf() 方法
Buffer.prototype.split = function(bondary) {
  let arr = [];
  let offset = 0;
  let currentPosition = 0;
  // 只要不为 -1 就一直找
  while (-1 != (currentPosition = this.indexOf(bondary, offset))) {
    arr.push(this.slice(offset, currentPosition));
    offset = currentPosition + bondary.length;
  }
  arr.push(this.slice(offset));
  return arr;
};
// 测试代码 console.log(Buffer.from('111111&11111&111&111').split('&'))
```
