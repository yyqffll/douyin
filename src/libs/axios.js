import axios from 'axios'
import { noticeModal } from '@/libs/modal'
export function request (config) {
  const instance = axios.create({
    method: 'POST'
  })
  instance.interceptors.response.use((res) => {
    const {
      data
    } = res
    if (data.success === false) {
      noticeModal({
        msg: data.msg
      })
      return Promise.reject(data)
    } else {
      return data
    }
  }, err => {
    noticeModal({
      msg: '未知错误,请联系管理员!'
    })
    return Promise.reject(err)
  })
  return instance(config)
}
