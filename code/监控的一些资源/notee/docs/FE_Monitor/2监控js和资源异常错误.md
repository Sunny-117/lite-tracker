# 2.监控 js 和资源异常错误

## 数据结构

```js
// jsError
{
  "title": "前端监控系统",//页面标题
  "url": "http://localhost:8080/",//页面URL
  "timestamp": "1590815288710",//访问时间戳
  "userAgent": "Chrome",//用户浏览器类型
  "kind": "stability",//大类
  "type": "error",//小类
  "errorType": "jsError",//错误类型
  "message": "Uncaught TypeError: Cannot set property 'error' of undefined",//类型详情
  "filename": "http://localhost:8080/",//访问的文件名
  "position": "0:0",//行列信息
  "stack": "btnClick (http://localhost:8080/:20:39)^HTMLInputElement.onclick (http://localhost:8080/:14:72)",//堆栈信息
  "selector": "HTML BODY #container .content INPUT"//选择器
}
```

```js
// promiseError
{
  "title": "前端监控系统",//页面标题
  "url": "http://localhost:8080/",//页面URL
  "timestamp": "1590815290600",//访问时间戳
  "userAgent": "Chrome",//用户浏览器类型
  "kind": "stability",//大类
  "type": "error",//小类
  "errorType": "promiseError",//错误类型
  "message": "someVar is not defined",//类型详情
  "filename": "http://localhost:8080/",//访问的文件名
  "position": "24:29",//行列信息
  "stack": "http://localhost:8080/:24:29^new Promise (<anonymous>)^btnPromiseClick (http://localhost:8080/:23:13)^HTMLInputElement.onclick (http://localhost:8080/:15:86)",//堆栈信息
  "selector": "HTML BODY #container .content INPUT"//选择器
}
```

```js
// resourceError
{
  "title": "前端监控系统",//页面标题
  "url": "http://localhost:8080/",//页面URL
  "timestamp": "1590816168643",//访问时间戳
  "userAgent": "Chrome",//用户浏览器类型
  "kind": "stability",//大类
  "type": "error",//小类
  "errorType": "resourceError",//错误类型
  "filename": "http://localhost:8080/error.js",//访问的文件名
  "tagName": "SCRIPT",//标签名
  "timeStamp": "76",//时间
  "selector": "HTML BODY SCRIPT"//选择器
}
```

## 示例代码

```html
<!-- js错误示例，变量不存在 -->
function errorClick() { window.someVar.error = 'error' }

<!-- promise错误示例 -->
function promiseClick() { new Promise(function (resolve, reject) {
reject('出错了') }) }
```

## 代码实现

```js
import getLastEvent from '../utils/getLastEvent';
import getSelector from '../utils/getSelector';
import tracker from '../utils/tracker';
export function injectJsError() {
  //监听全局未捕获的错误
  window.addEventListener(
    'error',
    function(event) {
      //错误事件对象
      let lastEvent = getLastEvent(); //最后一个交互事件
      //这是一个资源异常错误
      if (event.target && (event.target.src || event.target.href)) {
        tracker.send({
          kind: 'stability', //监控指标的大类
          type: 'error', //小类型 这是一个错误
          errorType: 'resourceError', //js或css资源加载错误
          filename: event.target.src || event.target.href, //哪个文件报错了
          tagName: event.target.tagName, //SCRIPT
          //body div#container div.content input
          selector: getSelector(event.target), //代表最后一个操作的元素
        });
      } else {
        tracker.send({
          kind: 'stability', //监控指标的大类
          type: 'error', //小类型 这是一个错误
          errorType: 'jsError', //JS执行错误
          message: event.message, //报错信息
          filename: event.filename, //哪个文件报错了
          position: `${event.lineno}:${event.colno}`,
          stack: getLines(event.error.stack),
          //body div#container div.content input
          selector: lastEvent ? getSelector(lastEvent.path) : '', //代表最后一个操作的元素
        });
      }
    },
    true,
  );
  window.addEventListener(
    'unhandledrejection',
    event => {
      // promise错误
      console.log(event);
      let lastEvent = getLastEvent(); //最后一个交互事件
      let message;
      let filename;
      let line = 0;
      let column = 0;
      let stack = '';
      let reason = event.reason;
      if (typeof reason === 'string') {
        message = reason;
      } else if (typeof reason === 'object') {
        //说明是一个错误对象
        message = reason.message;
        //at http://localhost:8080/:23:38
        if (reason.stack) {
          let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
          filename = matchResult[1];
          line = matchResult[2];
          column = matchResult[3];
        }

        stack = getLines(reason.stack);
      }
      tracker.send({
        kind: 'stability', //监控指标的大类
        type: 'error', //小类型 这是一个错误
        errorType: 'promiseError', //JS执行错误
        message, //报错信息
        filename, //哪个文件报错了
        position: `${line}:${column}`,
        stack,
        //body div#container div.content input
        selector: lastEvent ? getSelector(lastEvent.path) : '', //代表最后一个操作的元素
      });
    },
    true,
  );

  function getLines(stack) {
    return stack
      .split('\n')
      .slice(1)
      .map(item => item.replace(/^\s+at\s+/g, ''))
      .join('^');
  }
}
```

### utils 工具箱代码

```js
// utils/getSelector.js

function getSelectors(path) {
  return path
    .reverse()
    .filter(element => {
      return element !== document && element !== window;
    })
    .map(element => {
      let selector = '';
      if (element.id) {
        return `${element.nodeName.toLowerCase()}#${element.id}`;
      } else if (element.className && typeof element.className === 'string') {
        return `${element.nodeName.toLowerCase()}.${element.className}`;
      } else {
        selector = element.nodeName.toLowerCase();
      }
      return selector;
    })
    .join(' ');
}
export default function(pathsOrTarget) {
  if (Array.isArray(pathsOrTarget)) {
    //可能是一个数组
    return getSelectors(pathsOrTarget);
  } else {
    //也有可有是一个对象
    let path = [];
    while (pathsOrTarget) {
      path.push(pathsOrTarget);
      pathsOrTarget = pathsOrTarget.parentNode;
    }
    return getSelectors(path);
  }
}
```

```js
// utils/getLastEvent.js
let lastEvent;
['click', 'touchstart', 'mousedown', 'keydown', 'mouseover'].forEach(
  eventType => {
    document.addEventListener(
      eventType,
      event => {
        lastEvent = event;
      },
      {
        capture: true, //捕获阶段
        passive: true, //默认不阻止默认事件
      },
    );
  },
);
export default function() {
  return lastEvent;
}
```

```js
// utils/onload.js
export default function(callback) {
  if (document.readyState === 'complete') {
    callback();
  } else {
    window.addEventListener('load', callback);
  }
}
```

```js
// utils/tracker.js

let userAgent = require('user-agent');
let project = 'sms-monitor';
let host = 'cn-shenzhen.log.aliyuncs.com';
let logstoreName = 'sms-monitor-store';

function getExtraData() {
  return {
    title: document.title,
    url: location.href,
    timestamp: Date.now(),
    userAgent: userAgent.parse(navigator.userAgent).name,
    userId: '',
  };
}
class SendTracker {
  constructor() {
    this.url = `http://${project}.${host}/logstores/${logstoreName}/track`; //上报的路径
    this.xhr = new XMLHttpRequest();
  }
  send(data = {}) {
    let extraData = getExtraData();
    let log = { ...extraData, ...data };
    //对象 的值不能是数字
    for (let key in log) {
      if (typeof log[key] === 'number') {
        log[key] = `${log[key]}`;
      }
    }
    console.log('log', log);
    let body = JSON.stringify({
      __logs__: [log],
    });
    this.xhr.open('POST', this.url, true);
    this.xhr.setRequestHeader('Content-Type', 'application/json'); //请求体类型
    this.xhr.setRequestHeader('x-log-apiversion', '0.6.0'); //版本号,阿里云规定
    this.xhr.setRequestHeader('x-log-bodyrawsize', body.length); //请求体的大小
    this.xhr.onload = function() {
      // console.log(this.xhr.response);
    };
    this.xhr.onerror = function(error) {
      //console.log(error);
    };
    this.xhr.send(body);
  }
}
export default new SendTracker();
```
