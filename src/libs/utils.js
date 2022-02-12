import Cookies from 'js-cookie'
import config from '@/config'

const { cookieExpires } = config

export const TOKEN_KEY = 'token'

export const setToken = token => {
  Cookies.set(TOKEN_KEY, token, {
    expires: cookieExpires || 1
  })
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

// 除
export function mod (a, b) {
  let decimal = 0
  let al = 0
  let bl = 0
  if (a.toString().includes('.')) {
    al = a.toString().split('.')[1].length
  }
  if (b.toString().includes('.')) {
    bl = b.toString().split('.')[1].length
  }
  decimal = al > bl ? al : bl
  return (a * decimal) / (b * decimal)
}
