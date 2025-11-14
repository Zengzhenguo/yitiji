import Cookies from 'js-cookie'

const TokenKey = 'token'
const UserInfoKey = 'userInfo'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUserInfo(userInfo) {
  return Cookies.set(UserInfoKey, userInfo)
}

export function getUserInfo() {
  return Cookies.get(UserInfoKey)
}

export function removeUserInfo() {
  return Cookies.remove(UserInfoKey)
}

// export function getLocalItem(key) {
//   const str = localStorage.getItem(key)
//   if (isJSON(str)) {
//     return JSON.parse(str)
//   } else {
//     return str
//   }
// }

// export function setLocalItem(key, val) {
//   if (typeof val === 'object') {
//     val = JSON.stringify(val)
//   }
//   return localStorage.setItem(key, val)
// }

// export function removeLocalItem(key) {
//   return localStorage.removeItem(key)
// }
// function isJSON(str) {
//   if (typeof str === 'string') {
//     try {
//       var obj = JSON.parse(str)
//       if (typeof obj === 'object' && obj) {
//         return true
//       } else {
//         return false
//       }
//     } catch (e) {
//       console.log('error：' + str + '!!!' + e)
//       return false
//     }
//   }
//   console.log('It is not a string!')
// }
