// 1. 监听 js 执行报错
window.addEventListener("error", (e) => {
  // 只有 error 属性不为空的 ErrorEvent 才是一个合法的 js 错误
  if (e.error) {
    console.log("caputure an error", e.error);
  }
});
// throw(new Error('test'));
// 2. 监听 promise rejection
window.addEventListener("unhandledrejection", (e) => {
  console.log("capture a unrejection", e);
});
Promise.reject("test");

// 3. 封装成一个 monitor
function createJsErrorMonitor(report) {
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
