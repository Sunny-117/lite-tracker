const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');//生成模板

module.exports = {
  entry: './src/index.js',//打包入口
  context: process.cwd(),//上下文目录
  mode: 'development',//开发模式
  output: {
    path: path.resolve(__dirname, 'dist'),//打包目录
    filename: 'monitor.js'//打包文件名
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),//devServer静态文件根目录
    //before是用来配置路由的  express服务器
    before(router) {
      router.get('/success', function (req, res) {
        res.json({ id: 1 });//200
      });
      router.post('/error', function (req, res) {
        res.sendStatus(500);//500
      });
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // 模板文件
      inject: 'head' // 把打包后的 monitor.js 加入head标签中(默认是body)
    })
  ]
}