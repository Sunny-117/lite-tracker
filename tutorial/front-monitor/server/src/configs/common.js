import env from '~/src/configs/env'

// 开发环境配置
const development = {
  loginType: 'normal', // 登录类型，uc(内部uc登录)/normal(普通登录)
  use: {
    alarm: false // 是否使用报警功能。如果启用，请在alarm配置里指定报警网址
  },
  nginxLogFilePath: 'C:/green/nginx/logs' // nginx日志文件根路径，此路径下面的日志文件命名格式请参照readme
}
// 测试环境配置
const testing = development
const production = testing
const config = {
  development,
  testing,
  production
}
export default config[env]
