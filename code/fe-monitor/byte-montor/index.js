/**
 * 列举出性能指标对应的 entry type
 * fp,fcp --> paint
 * lcp --> largest-contentful-paint
 * fip --> first-input
 */
const entryTypes = ["paint", "largest-contentful-paint", "first-input"];

// 1. 通过 PerformanceObserver 监听
const p = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry);
  }
});
p.observe({ entryTypes });
// 2. 也可以通过 window.performance 对象拿到 fp fcp 和 fip。
// 注意如果同步打印他们是取不到值的，想想为什么？
console.log(window.performance.getEntriesByType("paint")); // 同步执行，body还没渲染完就执行了，所以[]
console.log(window.performance.getEntriesByType("first-input")); // 同步执行，body还没渲染完就执行了，所以[]

// // 3. 封装成一个 monitor
function createPerfMonitor(report) {
  const name = "performance";
  const entryTypes = ["paint", "largest-contentful-paint", "first-input"];
  //   让用户来决定是否开启 start
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
