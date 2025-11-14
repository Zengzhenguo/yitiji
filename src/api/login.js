/*
 * @Author: your name
 * @Date: 2021-11-12 09:10:24
 * @LastEditTime: 2021-11-17 12:25:27
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \ec-gov-biz-hubei-terminal\src\api\login.js
 */
import request from '@/utils/request'
export function login(data) {
  return request({
    url: '/user-platform/rest/loginRealManAccount',
    method: 'POST',
    data
  })
}
