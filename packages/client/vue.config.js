const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave: 'error',
  transpileDependencies: true,
  devServer: {
    port: 4000
  }
})
