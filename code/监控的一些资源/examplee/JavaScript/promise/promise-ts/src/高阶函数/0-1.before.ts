/*
1.参数中有函数
2.返回值是函数
*/

type Callback = () => void;  // 类型是函数，无返回值
type ReturnFn = (...args: any[]) => void; // 类型是函数，参数是未知数组，无返回值

declare global {
  interface Function {
    before(fn: Callback): ReturnFn
  }
}

Function.prototype.before = function (fn) {
  return (...args) => {
    fn();
    this(...args);
  };
};

function say(...args) {
  console.log("说话", ...args);
}

let newSay = say.before(() => {
  console.log("说话前");
});

newSay(1, 2, 3);

export { }
