const enum STATUS { // 存放状态，ts枚举
  pending = 'PENDING',
  fulfilled = 'FULFILLED',
  rejected = 'REJECTED'
}

class Promise {
  status: STATUS;
  value: any;
  reason: any;
  onResolvedCallback: Function[];
  onRejectedCallback: Function[];
  constructor(executor) {
    this.status = STATUS.pending; // 当前状态
    this.value = undefined; // 成功原因
    this.reason = undefined;  // 失败原因
    this.onResolvedCallback = [];
    this.onRejectedCallback = [];

    const resolve = (value?: any) => { // 调resolve更改status状态，并把传入的value保存下来。加？表示value允许不传参
      if (this.status === STATUS.pending) { // 只有等待态时才允许修改状态和值，否则不生效
        this.status = STATUS.fulfilled;
        this.value = value;
        this.onResolvedCallback.forEach(fn => fn());
      }
    }
    const reject = (reason?: any) => { // 逻辑和resolve类似
      if (this.status === STATUS.pending) {
        this.status = STATUS.rejected;
        this.reason = reason;
        this.onRejectedCallback.forEach(fn => fn());
      }
    }

    try { // 如果promise初始执行报错，也走reject状态
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  then(onFulfilled, onRejected) {
    if (this.status == STATUS.fulfilled) {
      onFulfilled(this.value)
    }
    if (this.status == STATUS.rejected) {
      onRejected(this.reason)
    }
    if (this.status == STATUS.pending) { //如果executor()有异步代码，执行then时还是等待态，就把成功回调和失败回调存起来
      this.onResolvedCallback.push(() => { // 切片编程，套一层函数
        // 这里还可以加额外的逻辑...
        onFulfilled(this.value);
      })
      this.onRejectedCallback.push(() => {
        onRejected(this.reason);
      })
    }
  }

}


export default Promise