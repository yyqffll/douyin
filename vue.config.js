const config = require('./src/config')
const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/style/baseColor.less')
      ]
    }
  },
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
      },
      '/ffmpeg': {
        target: config.baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/ffmpeg': ''
        }
      },
      '/nginx': {
        target: 'http://124.223.7.93',
        changeOrigin: true,
        pathRewrite: {
          '^/nginx': '/'
        }
      }
    }
  }
}
