const path = require('path');
const HtmlWebpackPlugin= require('html-webpack-plugin');

let webpackConfig = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: { index: './src/index.js' },
  resolve: {
    extensions: ['.js'],
    alias: {
      'src': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: path.join(__dirname, 'src'),
        exclude: path.join(__dirname, 'node_modules')
      }
    ]
  },
  output: {
    path: path.resolve(__dirname,`dist`),
    filename: '[name].js',
    chunkFilename: '[id].[hash:7].js'
  },
  devServer:{
    contentBase:path.resolve(__dirname, 'dist'),
    port:9000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template:'./src/index.html',
      inject:'head'
    })
  ]
}

module.exports = webpackConfig
