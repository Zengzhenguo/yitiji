// 封装jsonp,使其返回一个promise,
import OriginJsonp from 'jsonp'
import utils from './index'
// 对外暴露封装的jsonp 方法
export default function jsonp({ url, data, option }) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    if (data && data.jsonpCallback) {
      window[data.jsonpCallback] = data => {
        if (data) {
          resolve(data)
        }
        reject(data)
      }
    }
    if (utils.getLocalItem('device') === 'MD') {
      console.log(data, 'data')
      resolve(data)
    }
    OriginJsonp(url, option)
  })
}

// url参数拼接
export function param(data) {
  let url = ''
  for (var k in data) {
    const value = data[k] === undefined ? '' : data[k]
    url += '&' + k + '=' + encodeURIComponent(value)
  }

  return url ? url.substring(1) : ''
}
