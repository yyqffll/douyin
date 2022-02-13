import axios from 'axios'
import { noticeModal } from '@/libs/modal'
axios.interceptors.response.use((res) => {
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
export default axios
