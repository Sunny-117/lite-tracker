const ENUM = {
  PENDING: 'PENDING', // 等待
  FULFILLED: 'FULFILLED', // 成功
  REJECTED: 'REJECTED' // 失败
}

class Promise {
  constructor(executor){
    this.status = ENUM.PENDING;
    this.value = undefined;
    this.reason = undefined;

    const resolve = (value) => {
      // 如果状态为等待才可以更改
      if (this.status === ENUM.PENDING) {
        this.status = ENUM.FULFILLED
        this.value = value
      }
    }

    const reject = (reason) => {
      if (this.status === ENUM.PENDING) {
        this.status = ENUM.REJECTED
        this.reason = reason
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
  }
}

module.exports = Promise