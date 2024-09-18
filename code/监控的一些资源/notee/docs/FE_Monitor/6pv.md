# 6.pv

## 数据结构

```js
{
  "title": "前端监控系统",
  "url": "http://localhost:8080/",
  "timestamp": "1590829304423",
  "userAgent": "chrome",
  "kind": "business",
  "type": "pv",
  "effectiveType": "4g",
  "rtt": "50",
  "screen": "2049x1152"
}
```

## 代码实现

```js
import tracker from '../util/tracker';
export function pv() {
  var connection = navigator.connection;
  tracker.send({
    kind: 'business',
    type: 'pv',
    effectiveType: connection.effectiveType, //网络环境
    rtt: connection.rtt, //往返时间
    screen: `${window.screen.width}x${window.screen.height}`, //设备分辨率
  });
  let startTime = Date.now();
  window.addEventListener(
    'unload',
    () => {
      let stayTime = Date.now() - startTime;
      tracker.send({
        kind: 'business',
        type: 'stayTime',
        stayTime,
      });
    },
    false,
  );

  /*
  	// navigator.sendBeacon() 可用于通过HTTP将少量数据异步传输到Web服务器
    window.addEventListener('unload', logData, false);
    function logData() {
        navigator.sendBeacon("/log", {
            kind: 'business',
            type: 'stayTime',
            stayTime
        });
    }
    */
}
```

使用 **`sendBeacon()`**方法会使用户代理在有机会时异步地向服务器发送数据，同时不会延迟页面的卸载或影响下一导航的载入性能。这就解决了提交分析数据时的所有的问题：数据可靠，传输异步并且不会影响下一页面的加载。
