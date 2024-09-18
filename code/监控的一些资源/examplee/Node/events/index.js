function EventEmitter(){
  this._events = {}
}

// 订阅
EventEmitter.prototype.on = function(eventName, callback){
  if(!this._events) this._events = Object.create(null)

  //  绑定的时候，eventName 不是 newListener，就触发 newListener 事件并把 eventName 传递给回调函数
  if(eventName !== 'newListener'){
      this.emit('newListener',eventName)
  }

  if (this._events[eventName]) {
    this._events[eventName].push(callback)
  } else {
    this._events[eventName] = [callback]
  }
}

// 移除
EventEmitter.prototype.off = function(eventName, callback){
  this._events[eventName] = this._events[eventName].filter(fn => (fn !== callback) && (fn.l !== callback))
}

// 绑定一次
EventEmitter.prototype.once = function(eventName, callback){
  const once = (...args) => {
    callback(...args)
    // 执行一次后将自己移除掉
    this.off(eventName, once)
  }
  once.l = callback // 用来保存once真实的callback

  this.on(eventName, once)
}

// 发布
EventEmitter.prototype.emit = function(eventName, ...args){
  if (this._events[eventName]) {
    this._events[eventName].forEach(fn => fn(...args));
  }
}


const util = require('util')

function Person() {}
Person.prototype.__proto__ = EventEmitter.prototype


let my = new Person();

console.log('================')


// 用来监听用户绑定了哪些事件
my.on('newListener',function (type) { 
    console.log(type);
})
my.on('你是谁', () => {
    console.log('zwh')
})
let age = () => {
    console.log('18')
}
my.once('你是谁', age);
my.off('你是谁',age)
my.emit('你是谁')
my.emit('你是谁')