// http 模块   主要是对http服务进行处理的  
var http = require('http');
// url 模块  主要是用来对url进行处理的
var url = require('url');
// 文件模块   处理文件的  
var fs = require('fs');
// request模块  服务端做网络请求的依赖
var req = require('request');
// 创建一个http的服务  服务执行在3000的端口号上  localhost / 127.0.0.1
http.createServer(function (request, response) {
    console.log('服务已起动');
    // 获取到前端要请求的路径
    var pathName = url.parse(request.url).pathname;
    // 前端发过来的请求参数
    var params = url.parse(request.url, true).query;
    //  前端发过来的请求方式
    console.log('methods', request.method);
    // request.headers 请求头信息
    console.log('header:', request.headers)
    // 判断接口路径
    if (pathName == '/chat') {
        // 向图灵机器人的接口传递的数据
        var data = {
            "reqType": 0,
            "perception": {
                "inputText": {
                    "text": params.text
                }
            },
            "userInfo": {
                "apiKey": "0e6e6058578344789a8820de7b541cc1",
                "userId": "123456"
            }
        }
        var contents = JSON.stringify(data);
        // 向图灵机器人的接口发出请求
        req({
            url: "http://openapi.tuling123.com/openapi/api/v2",
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: contents
        }, function (error, resp, body) {
        //    接收到图灵机器人接口的返回数据之后
            if (!error && resp.statusCode == 200) {
                // 设置返回给客户端的响应头信息  CORS
                var head = {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT",
                    "Access-Control-Allow-Headers": "x-requested-with , content-type, token, xxx",
                    // "Content-Type": 'application/json'
                }
                response.writeHead(200, head);
                // 设置返回给客户端的响应数据
                var obj = JSON.parse(body);
                if (obj && obj.results && obj.results.length > 0 && obj.results[0].values) {
                    response.write(JSON.stringify(obj.results[0].values));
                    response.end();
                } else {
                    response.write("{\"text\":\"布吉岛你说的是什么~\"}");
                    response.end();
                }
            } else {
                response.writeHead(400);
                response.write("数据异常");
                response.end();
            }
        });
    } else {
       try{
        var file = fs.readFileSync('/view' + pathName);
        response.writeHead(200);
        response.write(file);
        response.end();
       } catch(e) {
           console.log(e)
        response.writeHead(404);
        response.write("<html><body><h1>404 NotFound</h1></body></html>");
        response.end();
       }
    }

    // 当前服务启用的端口号  也就是接口调用的端口号
}).listen(3000);