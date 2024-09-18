import path from "path";
import ts from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
export default {
  input: 'src/index.ts',
  output: {
    exports: 'auto', // 自动根据导出猜测类型
    format: 'cjs', // 打包后的格式。cjs/umd。这里打包的promis是在node中使用，用commonjs
    file: path.resolve('dist/bundle.js') // 打包输出文件
  },
  plugins: [
    ts({
      tsconfig: path.resolve('tsconfig.json') // 指定ts配置地址
    }),
    nodeResolve({
      extensions: ['.js', '.ts'] // 解析第三方插件的.js .ts模块
    })
  ]
}