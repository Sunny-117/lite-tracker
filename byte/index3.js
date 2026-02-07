// 1. 监控静态资源错误，注意需要在捕获阶段才能监听到
window.addEventListener(
  "error",
  (e) => {
    // 注意区分 js error
    const target = e.target || e.srcElement;
    if (!target) {
      return;
    }
    if (target instanceof HTMLElement) {
      let url;
      // 区分 link 标签，获取静态资源地址
      if (target.tagName.toLowerCase() === "link") {
        url = target.getAttribute("href");
      } else {
        url = target.getAttribute("src");
      }
      console.log("异常的资源", url);
    }
  },
  true
);
const link = document.createElement("link");
link.href = "1.css";
link.rel = "stylesheet";
document.head.append(link);

const script = document.createElement("script");
script.src = "2.js";
document.head.append(script);

// 2. 封装成一个 monitor
function createResourceErrorMonitor(report) {
  const name = "resource-error";
  function start() {
    window.addEventListener(
      "error",
      (e) => {
        // 注意区分 js error
        const target = e.target || e.srcElement;
        if (!target) {
          return;
        }
        if (target instanceof HTMLElement) {
          let url;
          // 区分 link 标签，获取静态资源地址
          if (target.tagName.toLowerCase() === "link") {
            url = target.getAttribute("href");
          } else {
            url = target.getAttribute("src");
          }
          report({ name, data: { url } });
        }
      },
      true
    );
  }
  return { name, start };
}
