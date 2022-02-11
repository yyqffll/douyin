const config = require('./src/config')
const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}
module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
  },
  devServer: {
    proxy: {
      '/api': {
        target: config.baseUrl,
        changeOrigin: true
      }
    }
  }
}
