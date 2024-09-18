const config = {
  // 端口号的配置
  port: {
      option: '-p,--port <val>', // program.option('-p,--port<val>', 'set...')
      description: 'set your server port',
      usage: 'zwh-http-server --port 3000',
      default:3000
  },
  // 启动目录的配置
  directory: {
      option: '-d,--directory <val>',
      description: 'set your start directory',
      usage: 'zwh-http-server --directory D:',
      default:process.cwd(),
  },
  // 主机名的配置
  host: {
      option: '-h,--host <val>',
      description: "set your hostname",
      usage: 'zwh-http-server --host 127.0.0.1',
      default:'localhost'
  }
}

module.exports = config;