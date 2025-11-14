import Vue from 'vue'
import { VueJsonp } from 'vue-jsonp'
Vue.use(VueJsonp)

// 对外暴露封装的jsonp 方法
export default function vueJsonp({ url, data }) {
  return new Promise((resolve, reject) => {
    Vue.prototype.$jsonp(url, data).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
