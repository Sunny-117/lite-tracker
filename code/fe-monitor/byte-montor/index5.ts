// class Sdk{
//   // js原生不支持oop面向对象，是通过原型链的方式实现的，最终打包会多余的polilfy，为了减少sdk体积，建议用fp：函数式
// }

function createSdk(url: string) {
  const monitors: Array<{ name: string; start: Function }> = [];
  const sdk = {
    url,
    report,
    loadMonitor,
    monitors,
    start,
  };
  function report({ name: string, data: any }) {
    // 注意：数据发送前需要先序列化为字符串
    navigator.sendBeacon(url, JSON.stringify({ name: string, data: any }));
  }
  function loadMonitor({ name: string, start: Function }) {
    monitors.push({ name: string, start: Function });
    // 实现链式调用
    return sdk;
  }
  function start() {
    monitors.forEach((m) => m.start());
  }
  return sdk;
}
const sdk = createSdk("111.com");
const jsMonitor = createJsErrorMonitor(sdk.report);
sdk.loadMonitor(jsMonitor).loadMonitor(createPerfMonitor(sdk.report));
sdk.start();
throw new Error("test");

function createJsErrorMonitor(report: ({ name: string, data: any }) => void) {
  const name = "js-error";
  function start() {
    window.addEventListener("error", (e) => {
      // 只有 error 属性不为空的 ErrorEvent 才是一个合法的 js 错误
      if (e.error) {
        report({ name, data: { type: e.type, message: e.message } });
      }
    });
    window.addEventListener("unhandledrejection", (e) => {
      report({ name, data: { type: e.type, reason: e.reason } });
    });
  }
  return { name, start };
}

function createPerfMonitor(report: ({ name: string, data: any }) => void) {
  const name = "performance";
  const entryTypes = ["paint", "largest-contentful-paint", "first-input"];
  function start() {
    const p = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        report({ name, data: entry });
      }
    });
    p.observe({ entryTypes });
  }
  return { name, start };
}
