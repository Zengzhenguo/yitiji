/* eslint-disable semi */
import api from '@/api';
import '@/permission'; // permission control
import '@/styles/font.scss'; // font css
// import tools from './utils/tools'
import '@/styles/index.scss'; // global css
import ElementUI from 'element-ui';
import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import Vue from 'vue';
import App from './App';
import './assets/theme/index.css';
import * as filters from './filters'; // global filters
import router from './router';
import store from './store';
import utils from './utils';

// import { getLocalItem, removeLocalItem } from '@/utils/index'
Vue.prototype.$utils = utils
// Vue.prototype.$tools = tools

Vue.prototype.$api = api
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.use(ElementUI)


Vue.config.productionTip = false
// const whiteList = ['/', '/401', '/404', '/idCardGuide', '/face']
// router.beforeEach((to, from, next) => {
//   document.title = to.meta.title || '湖北企业登记智慧辅助办理平台'
//   const expiryDate = +getLocalItem('expiryDate')
//   // console.log('当前时间', new Date().getTime())
//   // console.log('失效时间', expiryDate)
//   // console.log('是否失效', expiryDate < new Date().getTime())
//   if (getLocalItem('token') && expiryDate < new Date().getTime() && !whiteList.includes(to.path)) {
//     api.MessageBox.confirm('登录失效,请退出重新登录！', '温馨提示', {
//       confirmButtonText: '重新登录',
//       // showCancelButton: false,
//       type: 'warning',
//       customClass: 'Logout', // 自定义类名
//       center: true
//     }).then(() => {
//       removeLocalItem('token')
//       removeLocalItem('userInfo')
//       store.commit('login/SET_USER_INFO', null)
//       router.replace('/')
//     }).catch(() => {
//       removeLocalItem('token')
//       removeLocalItem('userInfo')
//       store.commit('login/SET_USER_INFO', null)
//       router.replace('/')
//     })
//     return
//   }
//   next()
// })

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
