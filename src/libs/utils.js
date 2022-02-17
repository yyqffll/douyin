import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import config from '@/config'

const { cookieExpires } = config

export const TOKEN_KEY = 'token'

export const ID_KEY = 'id'

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

export const setId = id => {
  Cookies.set(ID_KEY, id, {
    expires: cookieExpires || 1
  })
}

export const getId = () => {
  const id = Cookies.get(ID_KEY)
  if (id) return id
  else return false
}

export const encrypt = (word) => {
  if (word instanceof Object) {
    word = JSON.stringify(word)
  }
  const key = CryptoJS.enc.Utf8.parse(config.key)
  const encryptedObj = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(word), key,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    },
  )
  return encryptedObj.toString()
}

export const decrypt = (word) => {
  const key = CryptoJS.enc.Utf8.parse(config.key)
  const decrypt = CryptoJS.AES.decrypt(word, key,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.ZeroPadding,
    },
  )
  const decString = CryptoJS.enc.Utf8.stringify(decrypt).toString()
  return decString
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

export function convert (num) {
  return num / (1024 * 1024)
}

export function sTom (time) {
  const t = Math.round(time)
  if (t < 60) {
    return `00:${t > 9 ? t : '0' + t}`
  } else {
    const m = Math.floor(t / 60)
    const s = t % 60
    return `${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`
  }
}
