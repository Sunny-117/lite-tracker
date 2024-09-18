/*
1.参数中有函数
2.返回值是函数
*/

function say(...args) {
  console.log("说话", ...args);
}

// 
Function.prototype.before = function (fn) {
  return (...args) => {
    fn();
    this(...args);
  };
};

let newSay = say.before(() => {
  console.log("说话前");
});

newSay(1, 2, 3);
