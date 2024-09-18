# express 和中间件用法

```js
// server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer'); //文件上传中间件

app.use(bodyParser.json()); //处理JSON格式的请求体
app.use(bodyParser.urlencoded({ extended: true })); //处理表单格式的请求体
let upload = multer({ dest: 'uploads/' });

app.post('/post', function(req, res) {
  //处理post请求
  let body = req.body;
  res.send(body);
});

app.post('/form', function(req, res) {
  //处理表单提交
  let body = req.body;
  res.send(body);
});

app.post('/upload', upload.single('avatar'), function(req, res) {
  // 处理带文件的表单
  console.log(req.file); //请求体formData里的avatar字段对应的文件内容
  res.send(req.body); //返回请求体formData里的name、age等普通字段内容
});

app.listen(8080);

// [multer文档](https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md)
```

- `upload.array('photos', 12)`字段为 photos 的最多 12 个文件

[multer 文档](https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md)

request 模块，封装的是 http.request 方法。

#### POST-json 请求

```js
const request = require('request');

let options = {
  url: 'http://localhost:8080/post', //请求的URL地址
  method: 'POST', //请求的方法
  json: true, //JSON，希望返回的数据是一个JSON格式的
  headers: {
    'Content-Type': 'application/json',
  },
  body: { name: 'zwh', age: 18 }, //请求体放在body里
};

request(options, function(err, response, body) {
  console.log(err); //null
  console.log(body); //{ name: 'zwh', age: '18' }
});
```

#### POST-表单请求

```js
const request = require('request');

let options = {
  url: 'http://localhost:8080/form', //请求的URL地址
  method: 'POST', //请求的方法
  json: true, //JSON，希望返回的数据是一个JSON格式的
  headers: {
    'Content-Type': 'application/x-www-urlencoded',
  },
  form: { name: 'zwh', age: 18 }, //请求体放在form里
};

request(options, function(err, response, body) {
  console.log(err); //null
  console.log(body); //{ name: 'zwh', age: '18' }
});
```

#### POST-带文件的表单请求

```js
const request = require('request');
const fs = require('fs');

let options = {
  url: 'http://localhost:8080/upload', //请求的URL地址
  method: 'POST', //请求的方法
  json: true, //JSON，希望返回的数据是一个JSON格式的
  headers: {
    'Content-Type': 'application/x-www-urlencoded',
  },
  formData: {
    //带文件的表单，请求体放在formData里
    name: 'zwh', //普通值
    age: 10, //普通值
    avatar: {
      //文件类型，属性是固定值
      value: fs.createReadStream('./avatar.png'), //这是一个可读流，存放着头像的字节
      options: {
        filename: 'avatar.png',
        contentType: 'image/png',
      },
    },
  },
};

request.post(options, (err, response, body) => {
  console.log(err);
  console.log(body);
});
```
