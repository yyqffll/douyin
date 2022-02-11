const devHosturl = 'http://localhost:3000'
const proHosturl = 'http://124.223.7.93:3000'
module.exports = {
  /**
   * @description api请求基础路径
   */
  baseUrl: process.env.NODE_ENV === 'development' ? devHosturl : proHosturl
}
