import { Message, MessageBox } from 'element-ui'
import store from '../store'
// 显示错误信息
export function showError(message) {
  Message.error(message)
}
// 显示成功信息
export function showSuccess(message) {
  Message({
    type: 'success',
    message
  })
}
/*
 *@Description:
 *@Params:
 *@MethodAuthor: Liangguojiang
 *@Date: 2020-05-29 11:05:05
*/
export function validateForm(formName, _this) {
  return new Promise(resolve => {
    _this.$refs[formName].validate((valid) => resolve(valid))
  })
}
// 清除校验和表单内容
export function clearForm(formName, _this) {
  _this.$refs[formName].clearValidate()
  _this.$refs[formName].resetFields()
}
// 清除校验
export function clearValidate(formName, _this) {
  _this.$refs[formName].clearValidate()
}
export function warnTips() {
  MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '', {
    confirmButtonText: '重新登录',
    cancelButtonText: '取消',
    type: 'warning',
    customClass: 'Logout', // 自定义类名
    center: true
  }).then(() => {
    store.dispatch('user/logOut')
  })
}
/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
export default {
  showError,
  showSuccess,
  clearValidate,
  validateForm,
  clearForm,
  warnTips,
  deepClone
}
