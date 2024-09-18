# Node 常用的全局变量

## Node 自带的全局变量

大家都知道浏览器中的 this 指代的是 window ，node 中的 this 指代的都是 global，把 this 打印出来，有这些属性和方法：
`console.dir(Reflect.ownKeys(global, {showHidden: true}))`

```bash
'Object',
'Function',
'Array',
'Number',
'parseFloat',
'parseInt',
'Infinity',
'NaN',
'undefined',
'Boolean',
'String',
'Symbol',
'Date',
'Promise',
'RegExp',
'Error',
'EvalError',
'RangeError',
'ReferenceError',
'SyntaxError',
'TypeError',
'URIError',
'globalThis',
'JSON',
'Math',
'console',
'Intl',
'ArrayBuffer',
'Uint8Array',
'Int8Array',
'Uint16Array',
'Int16Array',
'Uint32Array',
'Int32Array',
'Float32Array',
'Float64Array',
'Uint8ClampedArray',
'BigUint64Array',
'BigInt64Array',
'DataView',
'Map',
'BigInt',
'Set',
'WeakMap',
'WeakSet',
'Proxy',
'Reflect',
'decodeURI',
'decodeURIComponent',
'encodeURI',
'encodeURIComponent',
'escape',
'unescape',
'eval',
'isFinite',
'isNaN',
'SharedArrayBuffer',
'Atomics',
'WebAssembly',
'global',
'process',
'GLOBAL',
'root',
'Buffer',
'URL',
'URLSearchParams',
'TextEncoder',
'TextDecoder',
'clearInterval',
'clearTimeout',
'setInterval',
'setTimeout',
'queueMicrotask',
'clearImmediate',
'setImmediate',
'Symbol(Symbol.toStringTag)'
```

## 模块系统的全局变量

这些对象在所有的模块中都可用。 以下的变量虽然看似全局的，但实际上不是。 它们仅存在于模块的作用域中

```bash
_dirname
__filename
exports
module
require()
```

## 常用的全局变量

- process.platform。用途：根据不同平台，操作系统文件。win32 / drawin / linux

```js
console.log(process.platform);
// darwin
```

- process.cwd()。用途： 可以获取当前执行 node 命令的目录 ,可以找到当前目录下的某个文件

```js
console.log(process.cwd());
// /Users/zwh/Desktop/node/dir
```

- process.chdir()。用途： 可以改变文件夹

```js
console.log(process.chdir('a'));
console.log(process.cwd());
// /Users/zwh/Desktop/node/dir/a
```

- process.env.xxx。用途： 根据不同的环境变量做配置

  ```js
  export NODE_ENV=production
  if(process.env.NODE_ENV === 'production'){
      console.log('生产环境')
  }else{
      console.log('开发环境')
  }
  // 生产环境
  // window: set xxx=xxx / mac: export xxx=xxx
  ```

* process.argv。用途： 获取执行命令时的参数

  ```js
  node test.js  --port 3000
  [
    '/usr/local/bin/node',
    '/Users/zwh/Desktop/node/dir/test.js',
    '--port',
    '3000'
  ]
  ```

  ```js
  let config = process.argv.slice(2).reduce((memo, current, index, arr) => {
    // [--port, 3000, --config ,xx.js]
    if (current.startsWith('--')) {
      memo[current.slice(2)] = arr[index + 1];
    }
    return memo;
  }, {});
  console.log(config);
  // {port: 3000, config: xx.js}
  ```

也可以用 commander 包，解析用户传递的参数

```js
const program = require('commander');
program.name('zwh');
program.usage('[options]');
program.command('rm').action(() => {
  console.log('删除');
});
program.option('-p, --port <v>', '设置端口');
program.parse(process.argv);
```
