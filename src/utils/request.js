/*
 * @Author: your name
 * @Date: 2021-11-12 09:12:42
 * @LastEditTime: 2022-08-31 16:08:42
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /ec-gov-biz-hubei-pc 2/src/utils/request.js
 */
import axios from 'axios'
import { MessageBox, Loading } from 'element-ui'
import router from '../router'
import { getLocalItem, removeLocalItem, showError, getPrefix } from './index'
import store from '../store'
// create an axios instance
const service = axios.create({
  baseURL: getPrefix(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000 // request timeout
})

service.interceptors.request.use(
  config => {
    config.headers = {
      token: getLocalItem('token') || config.headers.token, // 给token重新赋值
      ...config.headers
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)
// response interceptor
service.interceptors.response.use(
  response => {
    const data = response.data
    if (data.errCode === '403' && store.state.login.flag) { // 接口403且允许弹窗拦截
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录2', '', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'Logout', // 自定义类名
        center: true
      }).then(() => {
        removeLocalItem('token')
        removeLocalItem('userInfo')
        store.commit('login/SET_USER_INFO', null)
        // 拦截过以后不能再次拦截
        store.commit('login/SET_FLAG', false)
        if (getLocalItem('mode') === 'test') {
          console.log('mode')
          return
        }
        router.replace('/')
      }).catch(() => {
        // 点击取消重新开启拦截
        store.commit('login/SET_FLAG', true)
      })
      return response.data
    } else if (data.state === 'successful' || data.resultMsg === '成功' || data.errMsg === '成功' || data.errCode === '1' || data.resultCode === '1' || +data.flag === 200 || +data.code === 200 || +data.code === 0) { // 获取数据成功
      return response.data
    } else if (data.envelope) {
      return response.data
    } else {
      console.log(data)
      if (data.errMsg) {
        showError(data.errMsg)
      } else if (data.message) {
        showError(data.message)
      } else {
        showError('发生错误，请联系管理员！')
      }
      return response.data
    }
  },
  error => { // 可以不写catch
    Loading.service().close()
    showError('网络繁忙，请稍后再试！')
    return Promise.reject(error)
  }
)
export default service
