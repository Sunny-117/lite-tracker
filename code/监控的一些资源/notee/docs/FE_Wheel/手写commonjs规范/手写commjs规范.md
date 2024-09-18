# 手写 commjs 规范

2. 1. Module.\_resolveFilename 解析文件名，拿到文件的绝对路径
3. new Module(filename) 创建模块实例，把文件名传入当做 id
4. module.load() 加载模块，内部根据后缀名采用不同的策略进行加载
   - json，把模块的内容的字符串读取出来，用 JSON.parse()解析，并挂载到 Module.\_extensions 上
   - js，把模块的内容的字符串读取，用 vm.runInThisContex 执行，模块内会进行赋值操作，module.exports = 'zwh'

```js
//------- a1.json -------//
{
  "name":"zf"
}
```

```js
//------- a2.js -------//
module.exports = 'zwh';
```

```js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function Module(filename) {
  this.id = filename; // 模块的文件名
  this.exports = {}; // 导出的结果
  this.path = path.dirname(filename); // 模块父级目录
}
Module._cache = {};
Module.prototype.load = function() {
  // 获取文件的后缀名 ，根据后缀名采用不同的策略进行加载
  let extension = path.extname(this.id);
  Module._extensions[extension](this);
};

Module._extensions = {};
Module._extensions['.json'] = function(module) {
  const content = fs.readFileSync(module.id, 'utf8');
  module.exports = JSON.parse(content);
};

Module._extensions['.js'] = function(module) {
  const content = fs.readFileSync(module.id, 'utf8');
  const str = Module.wrapper(content);
  const fn = vm.runInThisContext(str);
  const exports = module.exports;
  fn.call(exports, exports, myRequire, module, module.id, module.path);
  // fn执行时，模块内会进行赋值操作。module.exports = 'zwh'
};
Module.wrapper = function(content) {
  // 在模块字符外面包一层函数
  return `(function(exports, require, module, __filename, __dirname){${content}})`;
};
Module._resolveFilename = function(filename) {
  const filePath = path.resolve(__dirname, filename);
  const isExists = fs.existsSync(filePath);
  if (isExists) return filename; // 如果路径存在直接返回

  const keys = Reflect.ownKeys(Module._extensions);
  for (let i = 0; i < keys.length; i++) {
    const newFilename = filePath + keys[i]; // 尝试添加 .js 和 .json后缀
    if (fs.existsSync(newFilename)) return newFilename;
  }

  throw new Error('module not found');
};

function myRequire(filename) {
  // 1.解析文件名
  filename = Module._resolveFilename(filename);

  // 如果缓存里有这个路径的模块，则直接返回模块的exports
  if (Module._cache[filename]) {
    return Module._cache[filename].exports;
  }

  // 2.创建模块
  let module = new Module(filename);

  // 把模块存入缓存中
  Module._cache[filename] = module;

  // 3.加载模块
  module.load();

  return module.exports;
}

const res1 = myRequire('./a1');
console.log(res1);
// { name: 'zf' }

const res2 = myRequire('./a2');
console.log(res2);
// zwh
```

`exports = module.exports = {}`，最后导出的**module.exports**，所以导出变量有几种正确写法

- module.exports = 12
- module.exports.a = 12
- exports.a = 12
- this.a = 12（this = exports = module.exports）

## commonjs 的其他规范

#### `require('./a')`，相对路径的查找顺序

1. 先查找当前目录下的 js 文件
2. 找不到再找当前目录下的 json 文件
3. 找当前目录下以 a 为目录名的的文件夹
   1. 查找 package.json 中 main 字段指定的文件
   2. 查找文件夹下的 index.js

#### `require('a')`，模块名的查找顺序

1. 先查找核心模块
2. 当前目录下的 node_modules 文件夹，找 a 模块
3. 继续向父级目录查找，直到根目录位置，找不到报错
