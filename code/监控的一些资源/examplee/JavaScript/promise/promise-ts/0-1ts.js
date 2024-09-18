/*

rollup+ts 环境配置

typescript
rollup 打包核心
rollup-plugin-typescript2  rollup和ts做关联的模块
@rollup/plugin-node-resolve rollup用来解析第三方插件模块的库

npm install typescript rollup @rollup/plugin-node-resolve rollup-plugin-typescript2 -D


npx tsc --init  初始化ts配置文件


scripts  "rollup -c -w"

-c   --config的简写，读取默认配置
-w   --watch的简写  监控文件的变化



tsconfig.json

"module": "ESNext",   rollup是用es6写的
"strict": false,   关掉严格模式，所以未声明类型都为any

*/



