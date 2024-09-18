const enum STATUS { // 存放状态，ts枚举
  pending = 'PENDING',
  fulfilled = 'FULFILLED',
  rejected = 'REJECTED'
}

// 解析x的类型(第一个then的返回结果)，来决定promise2走成功还是失败
function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) {
    return reject(new TypeError('类型出错'))
  }

  //兼容其他promise，返回的promise可以是对象和函数
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    let called = false; // 表示没调过成功和失败。加锁，防止状态的改变
    try {
      let then = x.then; // 取x上的then方法
      if (typeof then === 'function') { // 只要x上有then函数，就认为x是promise
        let y = then.call(x, y => {
          if (called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject); // y可能是一个promise，递归解析，直到是一个普通值为止
        }, r => {
          if (called) return;
          called = true;
          reject(r);
        });
      } else {
        resolve(x); // 普通对象{}
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x); // 普通值
  }
}

class Promise {
  status: STATUS;
  value: any;
  reason: any;
  onResolvedCallback: Function[];
  onRejectedCallback: Function[];
  constructor(executor: (resolve: (value?: any) => void, reject: (reason?: any) => void) => void) {
    this.status = STATUS.pending; // 当前状态
    this.value = undefined; // 成功原因
    this.reason = undefined;  // 失败原因
    this.onResolvedCallback = [];
    this.onRejectedCallback = [];

    const resolve = (value?: any) => { // 调resolve更改status状态，并把传入的value保存下来。加？表示value允许不传参
      if (value instanceof Promise) { // 支持resolve promise，递归解析
        return value.then(resolve, reject);
      }
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
  then(onFulfilled?, onRejected?) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    let promise2 = new Promise((resolve, reject) => { // 为了实现链式调用的效果，返回一个新的promise
      if (this.status == STATUS.fulfilled) {
        setTimeout(() => {  // 需要先产生promise2。这里加一个setTimeout，让里面的代码异步执行
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.status == STATUS.rejected) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason); // 这里x是普通值
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.status == STATUS.pending) { //如果executor()有异步代码，执行then时还是等待态，就把成功回调和失败回调存起来
        this.onResolvedCallback.push(() => { // 切片编程，套一层函数
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        })
        this.onRejectedCallback.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason); // 这里x是普通值
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        })
      }
    });
    return promise2;
  }
  catch(errFn) {
    return this.then(null, errFn);
  }
  finally(callback) {
    return this.then(data => {
      return Promise.resolve(callback()).then(() => data); // finally回调返回普通值(成功)，是不会传递到下一个then的
    }, err => {
      // 前一个失败，finally成功，也会返回失败。finally失败会默认抛出错误，先用finally的失败
      return Promise.resolve(callback()).then(() => { throw err });
    })
  }
  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value);
    })
  }
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    })
  }
  static all(values) {
    const isPromise = (value) => { // 判断传入值是否为promise
      if ((typeof value === 'object' && value !== null) || typeof value === 'function') {
        if (typeof value.then === 'function') {
          return true;
        }
      }
      return false;
    }

    return new Promise((resolve, reject) => { // Promise.all返回的是一个新promise
      const arr = [];
      let times = 0;
      const collect = (value, key) => {
        arr[key] = value;
        if (++times === values.length) {
          resolve(arr);
        }
      }

      for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if (isPromise(value)) {
          value.then(y => {
            collect(y, i);
          }, e => { // 简写reject
            reject(e)
          })
        } else {
          collect(value, i);
        }
      }
    })
  }
}

export default Promise;