const path = require('path');
//webpack打包项目的 HtmlWebpackPlugin生成产出HTML文件 user-agent 把浏览器的UserAgent变成一个对象
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/index.js',//入口文件
    context: process.cwd(),//上下文目录 
    mode: 'development',//开发模式
    output: {
        path: path.resolve(__dirname, 'dist'),//输出目录
        filename: 'monitor.js'//文件名
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
        new HtmlWebpackPlugin({//自动打包出HTML文件的
            template: './src/index.html',
            inject: 'head'
        })
    ]

}