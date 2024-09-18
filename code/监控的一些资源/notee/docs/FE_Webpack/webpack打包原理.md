# webpack 打包原理

1. 找到入口模块,然后拿到入口模块的源码
2. 解析源代码，找到它的依赖模块 ./hello.js
3. 对入口模块进行转换 require=>**webpack_require** './hello.js'=>转成相对于项根路径的模块 ID ./src/hello.js
4. 递归解析它依赖的模块，比如 hello.js
5. 最后把这些模块打包一个 chunk 里，然后生成 bundle 文件就可以。main.js

##### /src/index.js

```js
let hello = require('./hello.js');
console.log(hello);
```

##### /src/hello.js

```js
module.exports = 'zwh';
```

##### index.js

```js
const webpack = require('./webpack');
const config = require('./webpack.config');
webpack(config, (err, stats) => {
  if (err) {
    console.log('编译中发生了错误!');
  } else {
    console.log(
      stats.toJson({
        assets: false,
        hash: true,
      }),
    );
  }
});
```

##### webpack.config.js

```js
const path = require('path');
module.exports = {
  mode: 'development', //开发模式不压缩
  devtool: 'none', //不要产出sourcemap文件
  entry: './src/index.js', //默认entry名字就是main
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js', //main.js
  },
  plugins: [],
};
```

##### webpack.js

```js
const fs = require('fs');
const { compile } = require('ejs');
const { join, dirname } = require('path').posix; // 保证在win、mac、linux、分隔符都是一样的 \ /
const babylon = require('babylon'); // 把源代码转成ast语法树
const types = require('babel-types'); // 判断一个节点是否是某种类型，还可以用来生成一个新的节点
const generator = require('babel-generator').default; // 把ast语法树生成源代码
const traverse = require('babel-traverse').default; // 用来遍历语法树，然后对节点进行增、删、改
const mainTemplate = fs.readFileSync('./main.ejs', 'utf8');
class Compiler {
  constructor(config) {
    this.config = config;
  }
  /**
  1.找到入口模块,然后拿到入口模块的源码
  2.解析源代码，找到它的依赖模块 ./hello.js
  3.对入口模块进行转换 require=>__webpack_require__  './hello.js'=>转成相对于项根路径的模块ID  ./src/hello.js
  4.递归解析它依赖的模块，比如hello.js
  5.最后把这些模块统统打包一个chunk里，然后生成bundle文件就可以。main.js
   */
  run() {
    let { entry } = this.config; // ./src/index.js
    this.entry = entry;
    this.modules = {}; //key是模块ID 值是此模块的源代码
    this.buildModule(entry); //./src/index.js
    this.emitFiles(); //根据entry和modules生成文件
  }
  emitFiles() {
    let { path, filename } = this.config.output;
    //输出的目录名+文件名就是最终写入文件的路径
    let outputFilename = join(path, filename);
    let content = compile(mainTemplate)({
      entry: this.entry,
      modules: this.modules,
    });
    fs.writeFileSync(outputFilename, content, 'utf8');
  }
  buildModule(moduleId) {
    // ./src/index.js
    let originalSource = fs.readFileSync(moduleId, 'utf8');
    let ast = babylon.parse(originalSource); //把./src/index.js源代码转成语法树
    let dependencies = []; //放着moduleId依赖的模块的ID数组
    //遍历语法树，
    traverse(ast, {
      //当遍历语法树的时候，如果遇到了CallExpression节点
      CallExpression: nodePath => {
        //nodePath代表捕获的节点路径
        let node = nodePath.node;
        if (node.callee.name == 'require') {
          node.callee.name = '__webpack_require__'; //修改方法名require改为__webpack_require__
          let moduleName = node.arguments[0].value; // ./hello.js=>./src/hello.js
          //             ./src/hello.js
          let depModuleId = './' + join(dirname(moduleId), moduleName);
          node.arguments[0] = types.stringLiteral(depModuleId);
          dependencies.push(depModuleId); //['./src/hello.js']
        }
      },
    });
    //通过generator把抽象语法树转换成源代码 code
    let { code } = generator(ast);
    //把模块ID和此模块的源代码缓存在this.modules里面
    this.modules[moduleId] = code;
    //递归解析依赖项并编译依赖项
    dependencies.forEach(dependency => this.buildModule(dependency));
  }
}
//config配置对象 callback回调函数
function webpack(config, callback) {
  let compiler = new Compiler(config);
  compiler.run(); //开始编译
}
module.exports = webpack;
```

##### main.ejs

```ejs
((modules) => {
  var installedModules = {};
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    });
    modules[moduleId](module, module.exports, __webpack_require__);
    module.l = true;
    return module.exports;
  }
  function startup() {
    return __webpack_require__("<%-entry%>");
  }
  return startup();
})({
  <%for (let moduleId in modules) {%>
  "<%-moduleId%>": (module, exports, __webpack_require__) => {
          <% -modules[moduleId] %>
        },
  <%}%>
});
```
