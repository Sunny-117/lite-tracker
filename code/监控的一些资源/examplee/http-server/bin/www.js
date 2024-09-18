#! /usr/bin/env node

// /http-server 目录下 npm link ，链接到全局下，供临时调试
// 用于 --help 打印信息和运行时解析参数

const program = require('commander');
const config = require('./config');
const { version } = require('../package.json');

// program.name('zhs') // 如果不写默认填运行全局的那个指令
program.usage('[args]') // Usage: zhs [args]

// zhs -V,--version
program.version(version);

// --help 打印 Options 信息
Object.values(config).forEach(val => {
  program.option(val.option, val.descriptor)
});

// --help 打印 Examples 信息
program.on('--help', function () {
  console.log('\r\nExamples:');
  Object.values(config).forEach(val => {
    if (val.usage) {
      console.log('  ' + val.usage)
    }
  });
})

// 解析运行参数
program.parse(process.argv);

// 如果没有填运行参数的采用默认参数
const finalConfig = {}
Object.entries(config).forEach(([key, value]) => {
  finalConfig[key] = program[key] || value.default
});

// console.log(finalConfig)

const Server = require('../src/index');
let server = new Server(finalConfig); // 传入开启服务的参数
server.start(); // 开启服务
