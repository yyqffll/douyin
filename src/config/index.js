const devHosturl = 'http://localhost:3000'
const proHosturl = 'http://124.223.7.93:3000'
module.exports = {
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description api请求基础路径
   */
  baseUrl: process.env.NODE_ENV === 'development' ? devHosturl : proHosturl
}
