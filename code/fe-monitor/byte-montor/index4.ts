// 1. 写一个简易的 hook 函数
function hookMethod(obj: any, key: string, hookFunc: Function) {
  return (...params: any[]) => {
    obj[key] = hookFunc(obj[key], ...params);
  };
}

// 2. hook xhr 对象的 open 方法拿到请求地址和方法
hookMethod(
  XMLHttpRequest.prototype,
  "open",
  (origin: Function) =>
    function (method: string, url: string) {
      this.payload = {
        method,
        url,
      };
      // 执行原函数
      origin.apply(this, [method, url]);
    }
)();

// 3. hook xhr 对象的 send 方法监听到错误的请求
hookMethod(
  XMLHttpRequest.prototype,
  "send",
  (origin: Function) =>
    function (...params: any[]) {
      this.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status >= 400) {
          this.payload.status = this.status;
          console.log(this.payload);
        }
      });
      origin.apply(this, params);
    }
)();

const xhr = new XMLHttpRequest();
xhr.open("post", "111.cc");
xhr.send();

// 4, 封装成一个 monitor
function createXhrMonitor(report: ({ name: any, data: any }) => void) {
  const name = "xhr-error";
  function hookMethod(obj: any, key: string, hookFunc: Function) {
    return (...params: any[]) => {
      obj[key] = hookFunc(obj[key], ...params);
    };
  }
  function start() {
    hookMethod(
      XMLHttpRequest.prototype,
      "open",
      (origin: Function) =>
        function (this, method: string, url: string) {
          this.payload = {
            method,
            url,
          };
          origin.apply(this, [method, url]);
        }
    )();
    hookMethod(
      XMLHttpRequest.prototype,
      "send",
      (origin: Function) =>
        function (this, ...params: any[]) {
          this.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this.status >= 400) {
              this.payload.status = this.status;
              report({ name, data: this.payload });
            }
          });
          origin.apply(this, ...params);
        }
    )();
  }
  return { name, start };
}
