const proto = {}

// 代理实现 ctx.xxx = ctx.request.xxx  ctx.xxx = ctx.response.xxx
defineGetter('request', 'path');
defineGetter('request', 'url');
defineGetter('response', 'body');
defineSetter('response', 'body');

module.exports = proto


function defineGetter(target, key) {
  proto.__defineGetter__(key, function () {
    return this[target][key]
  })
}

function defineSetter(target, key) {
  proto.__defineSetter__(key, function (value) {
    this[target][key] = value
  })
}