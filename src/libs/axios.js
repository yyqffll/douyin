import axios from 'axios'
axios.interceptors.response.use((res) => {
  const {
    data
  } = res
  if (data.success) {
    return data
  }
})
export default axios
