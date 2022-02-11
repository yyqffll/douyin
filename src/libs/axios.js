import axios from 'axios'
axios.interceptors.response.use((res) => {
  const {
    data
  } = res
  return data
})
export default axios
