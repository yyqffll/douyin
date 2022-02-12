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
})
export default axios
