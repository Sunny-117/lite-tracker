const ENUM = {
  PENDING: 'PENDING', // 等待
  FULFILLED: 'FULFILLED', // 成功
  REJECTED: 'REJECTED' // 失败
}

class Promise {
  constructor(executor){
    this.status = ENUM.PENDING;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    this.value = undefined;
    this.reason = undefined;

    const resolve = (value) => {
      // 如果状态为等待才可以更改
      if (this.status === ENUM.PENDING) {
        this.status = ENUM.FULFILLED
        this.value = value
        this.onResolvedCallbacks.forEach(fn => fn()) // 发布
      }
    }

    const reject = (reason) => {
      if (this.status === ENUM.PENDING) {
        this.status = ENUM.REJECTED
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())  // 发布
      }
    }

    try {
      executor(resolve,reject)
    } catch (e) {
      reject(e)
    }
  }
  then(onFulfilled, onRejected){
    if (this.status === ENUM.FULFILLED) {
      onFulfilled(this.value)
    }
    if (this.status === ENUM.REJECTED) {
      onRejected(this.reason)
    }
    if (this.status === ENUM.PENDING) { // 订阅
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value)
      })
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}

module.exports = Promise