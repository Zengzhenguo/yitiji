/*
 * @Author: your name
 * @Date: 2021-11-12 09:10:24
 * @LastEditTime: 2022-02-15 10:15:39
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \ec-gov-biz-hubei-terminal\src\utils\gpy_request.js
 */
import axios from 'axios'
import { Loading } from 'element-ui'
import { showError } from './index'
// create an axios instance
const service = axios.create({
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000 // request timeout
})
// response interceptor
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => { // 可以不写catch
    Loading.service().close()
    showError('网络繁忙，请稍后再试！')
    return Promise.reject(error)
  }
)
export default service
