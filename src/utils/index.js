import { Message, Loading } from 'element-ui'
/**
 * Created by PanJiaChen on 16/11/18.
 */
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * getUserInfo
 * 获取用户账户信息，如传入一个 key，则返回该 key 的值，反之返回所有
 *
 * @param key {string}
 * @returns {object}
 */
// export function getUserInfo(key) {
//   let userInfo = window.localStorage.getItem('userInfo')

//   userInfo = userInfo ? JSON.parse(userInfo) : {}

//   return key ? userInfo[key] : userInfo
// }
/**
 * getRegExp
 * 获取正则表达式
 *
 * @param type {string}
 * @returns {string}
 */
export function getRegExp(type) {
  switch (type) {
    case 'mobile':
      return /^1[3-9]\d{9}$/

    case 'mobile-code':
      return /^\d{6}$/

    case 'phone':
      return /(^\d{3}-\d{8}$)|(^\d{4}-\d{7}$)/

    case 'credit-code':
      return /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/

    case 'id':
      return /(^\d{15}$)|(^\d{17}[xX0-9]$)/

    case 'email':
      return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

    case 'specialPhone':
      return /^1([3458][0-9]{9}|(7[2-9]{1})[0-9]{8})/
    case 'houseNumber':
      return /\d+号/
    case 'ems':
      return /^[1-9]\d{5}$/
    default:
      return ''
  }
}

export function getTypeName(type) {
  switch (type) {
    case 'mobile':
      return '手机号码'

    case 'mobile-code':
      return '手机验证码'

    case 'phone':
      return '联系电话'

    case 'telephone':
      return '固定电话'

    case 'credit-code':
      return '统一社会信用代码'

    case 'id':
      return '身份证号'

    case 'email':
      return '电子邮箱'

    case 'specialPhone':
      return '电子邮箱'
    case 'houseNumber':
      return '房号'
    case 'ems':
      return '邮政编码'
    default:
      return ''
  }
}

function checkStrLenth(str) {
  var len = 0// 字符串长度
  for (var i = 0; i < str.length; i++) {
    var charStr = str.charAt(i)
    if (/^[\u0000-\u00ff]$/.test(charStr)) { // 一个字节
      len += 1
    } else {
      len += 3
    }
  }
  return len
}

export function validateField(type) {
  if (type === 'phone') {
    return (rule, value, callback) => {
      // 既不是固话，也不是手机
      if (!getRegExp('mobile').test(value.trim()) && !getRegExp('telephone').test(value.trim())) {
        return callback(new Error(`${getTypeName(type)}格式不正确！`))
      }

      callback()
    }
  }
  if (type === 'specialPhone') {
    return (rule, value, callback) => {
      // 限制170、171的无需实名虚拟号
      if (!getRegExp('specialPhone').test(value.trim())) {
        return callback(new Error('该手机号段不符合申请要求，请重新输入!'))
      }

      callback()
    }
  }
  if (type === 'houseNumber') {
    return (rule, value, callback) => {
      if (checkStrLenth(value.trim()) < 9) {
        return callback(new Error('地址不能小于或等于8个字符'))
      }
      // if (!getRegExp('houseNumber').test(value.trim())) {
      //   return callback(new Error('地址需包含门牌号码'))
      // }

      callback()
    }
  }
  if (type === 'ems') {
    return (rule, value, callback) => {
      // 邮政格式不正确
      if (!getRegExp('ems').test(value.trim()) && !getRegExp('ems').test(value.trim())) {
        return callback(new Error(`${getTypeName(type)}格式不正确！`))
      }

      callback()
    }
  }
  return (rule, value, callback) => {
    if (!getRegExp(type).test(value.trim())) {
      return callback(new Error(`${getTypeName(type)}格式不正确！`))
    }

    callback()
  }
}
/**
 * getFile
 * 开放平台文件目录组成
 *
 * @param file {string}
 * @returns {undefined}
 */
export function getFile(file) {
  // console.log('file', file)
  // console.log('http://120.78.187.18/approve/uploaded_files/' + file)
  const host = location.host.indexOf('localhost') > -1 ? 'https://test.g4b.cn' : window.location.origin
  if (file.indexOf('http') > -1) {
    return file
  } else {
    return `${host + getPrefix()}/open-platform/${file}`
  }
  // {window.location.origin}
}
// 显示错误信息
export function showError(message) {
  Message({
    message,
    type: 'error'
  })
  // Message.error(
  //   {
  //     title: '温馨提醒',
  //     message
  //   }
  // )
}
export function showWarn(message) {
  Message({
    message,
    type: 'warning'
  })
}
export function showSuccess(message) {
  Message({
    message,
    type: 'success'
  })
  // Notification(
  //   {
  //     title: '温馨提醒',
  //     type: 'success',
  //     message
  //   }
  // )
}
// 防抖
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result
  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function() {
    context = this
    args = arguments
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

let loadingInstance

// 加载
const showLoading = function (options = {}) {
  // console.log('使用$Loading时的配置', options)
  loadingInstance = Loading.service({
    text: options.text || options.title || '加载中...', // 显示在加载图标下方的加载文案
    fullscreen: options.fullscreen || true, // 全屏遮罩,如果为true时遮罩会插入至 body 上
    lock: options.lock || true, // 是否锁定屏幕的滚动
    body: options.body || true, // 遮罩是否插入至 DOM 中的 body 上
    spinner: options.spinner || 'el-icon-loading', // 自定义加载图标类名
    customClass: options.customClass// Loading 的自定义类名
  })
}
const hideLoading = function () {
  if (loadingInstance) {
    loadingInstance.close()
  }
}

// 格式化日期
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export function getItem(key) {
  const str = sessionStorage.getItem(key)
  if (isJSON(str)) {
    return JSON.parse(str)
  } else {
    return str
  }
}
export function setItem(key, val) {
  if (typeof val === 'object') {
    val = JSON.stringify(val)
  }
  return sessionStorage.setItem(key, val)
}

export function removeItem(key) {
  return sessionStorage.removeItem(key)
}

export function getLocalItem(key) {
  const str = localStorage.getItem(key)
  if (isJSON(str)) {
    return JSON.parse(str)
  } else {
    return str
  }
}
export function setLocalItem(key, val) {
  if (typeof val === 'object') {
    val = JSON.stringify(val)
  }
  return localStorage.setItem(key, val)
}

export function removeLocalItem(key) {
  return localStorage.removeItem(key)
}
function isJSON(str) {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) { // 普通字符串
      // console.log('error：' + str + '!!!' + e)
      return false
    }
  }
  // console.log('It is not a string!')
}
function regExp(type, value) {
  switch (type) {
    case 'phone':
      return /^1[3-9]\d{9}$/.test(value)
    case 'idCard':
      return /(^\d{15}$)|(^\d{17}[xX0-9]$)/.test(value)
    case 'houseNumber':
      return /\d+号/.test(value)
    default:
      break
  }
}
// 转换高拍仪返回的base64图片路径，不带后缀，不过请求的时候请求的是jpg
export function base64ToFile(data) {
  // 将base64 的图片转换成file对象上传 atob将ascii码解析成binary数据
  const binary = window.atob(data)
  const mime = 'JPG'
  const array = []
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i))
  }
  const fileData = new Blob([new Uint8Array(array)], {
    type: mime
  })

  const file = new File([fileData], `${new Date().getTime()}.JPG`, { type: mime })

  return file
}

// 获取图片base64
function getImageBase64(url) {
  return new Promise(resolve => {
    const img = new Image()
    img.src = window.location.origin + getPrefix() + '/open-platform/' + url
    // img.crossOrigin = ''
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      const dataURL = canvas.toDataURL().replace('data:image/png;base64,', '')
      resolve(dataURL)
    }
  })
}
/**
 * imgToBase64
 * 获取图片 base64
 *
 * @param file {file object}
 * @returns {Promise}
 */
export async function imgToBase64 (file) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = e => {
      const imgFile = e.target.result
      resolve(imgFile)
    }
  })
}

/**
 * imgToCompressed
 * 图片压缩
 * 原理就是把图片宽度、高度调小
 *
 * @param file {file object | file base64}
 * @param {width, height}：压缩图片宽高
 * @returns {Promise}
 */
export async function imgToCompressed (file, {
  width,
  height
}) {
  if (typeof file === 'object') {
    file = await imgToBase64(file)
  }

  return new Promise(resolve => {
    var image = new Image()
    image.src = file

    image.onload = () => {
      const _width = image.width
      const _height = image.height
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      let data = ''
      if (width && width > _width) {
        width = _width
        height = _height
      } else {
        // 等比例缩放
        width = width || Math.floor(_width * height / _height)
        height = height || Math.floor(width * _height / _width)
      }

      canvas.width = width
      canvas.height = height

      context.drawImage(image, 0, 0, width, height)
      data = canvas.toDataURL('image/jpeg').replace('data:image/jpeg;base64,', '')

      resolve(data)
    }
  })
}
export function isTest() {
  // 除本地和test.g4b都认为是生产环境,融平台会把域名统一转成rong.wetruetech.cn,只能通过test标识区分测试环境
  return location.host.includes('localhost') || location.host.includes('test.g4b.cn') || location.href.includes('/zhkb/test/')
}
export function getPrefix() {
  return isTest() ? '/zhkb' : '/zhkb'
}
// 获取平台代码
export function getBizCode() {
  // return isTest() ? '5ba28d1070cd427db82ffdda7fb8daec' : '9d0f9a0c5d9f44969c5e69c25bd8c4ba'
  const testCode = { // 测试环境
    person: '20b5940f637e4099a3e3f85f2dd478d7', // 个体工商户年报Code
    company: '5ba28d1070cd427db82ffdda7fb8daec', // 内资企业年报Code
    single: '27ee09859f69441ea9359942696d7490', // 个人独资年报Code
    branch: '1c7284293c65489eaf380d7d3a9473f7', // 分公司年报Code
    cooperative: '1ae36e28d3b74d67b62e109ef3ce8661' // 农村专业合作社Code
  }
  const proCode = { // 生产环境
    person: '8c3ece53528147ff84e1f5c0d9e21462',
    company: '9d0f9a0c5d9f44969c5e69c25bd8c4ba',
    single: 'aba85d565d3d4c3f8251babf68ef5a91',
    branch: '99894b2425f2482182a8fa87771cdf3c',
    cooperative: '4a7cce794d5f4081886a82861c6cff88'
  }
  return isTest() ? testCode : proCode
}

/*
* 格式化身份证号
* 参数:
*   IdCard: [String] 身份证号码
*   type: [Number] 1/2/3
* 返回：
*   type：1 => birthday [String] 出生日期
*   type：2 => sex [Number] 性别
*   type：3 => age [Number] 年龄
*/
function formatIdCard (IdCard, type) {
  if (type === 1) {
    // 获取出生日期
    const birthday = IdCard.substring(6, 10) + '-' + IdCard.substring(10, 12) + '-' + IdCard.substring(12, 14)
    return birthday
  }
  if (type === 2) {
    // 获取性别
    if (parseInt(IdCard.substr(16, 1)) % 2 === 1) {
      return '1' // 男
    } else {
      return '2' // 女
    }
  }
  if (type === 3) {
    // 获取年龄
    var ageDate = new Date()
    var month = ageDate.getMonth() + 1
    var day = ageDate.getDate()
    var age = ageDate.getFullYear() - IdCard.substring(6, 10) // 年份计算的年龄
    if (+IdCard.substring(10, 12) > month || (+IdCard.substring(10, 12) === month && +IdCard.substring(12, 14) > day)) {
      // 生日没到，年龄-1
      age--
    }
    if (age <= 0) {
      age = 1
    }
    return age
  }
}
/*
* 校验身份证号码格式
* 参数:
*   value: [String] 身份证号码
* 返回：
*   flag => [Boolean] 检验结果
*/
function validIdcNumber (value) {
  const city = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北 ', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外 ' }
  // let tip = ''
  let pass = true
  if (!value || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value)) {
    // tip = '身份证号格式错误'
    pass = false
  } else if (!city[value.substr(0, 2)]) {
    // tip = '地址编码错误'
    pass = false
  } else if (value.substr(0, 6) === '810000' || value.substr(0, 6) === '820000' || value.substr(0, 6) === '830000') {
    // tip = '810000、820000、830000，为港澳台居民居住证证件类型号码，请修改证件类型'
    pass = false
  } else {
    // 18位身份证需要验证最后一位校验位
    if (value.length === 18) {
      const value1 = value.split('')
      // ∑(ai×Wi)(mod 11)
      // 加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      // 校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
      var sum = 0
      var ai = 0
      var wi = 0
      for (var i = 0; i < 17; i++) {
        ai = value1[i]
        wi = factor[i]
        sum += ai * wi
      }
      let value2 = parseInt(value.substr(17, 1))
      if (isNaN(value2)) {
        value2 = value.substr(17, 1)
      }
      if (parity[sum % 11] !== value2) {
        // tip = '校验位错误'
        pass = false
      }
    }
  }
  if (!pass) {
    return false
  }
  return true
}

// 滚动到固定地方
export function scrollView(object, _this) {
  for (const i in object) {
    let dom = _this.$refs[i]
    // 这里是针对遍历的情况（多个输入框），取值为数组
    if (Object.prototype.toString.call(dom) !== '[object Object]') {
      dom = dom[0]
    }
    // 第一种方法（包含动画效果）
    dom.$el.scrollIntoView({ // 滚动到指定节点
      // 值有start,center,end，nearest，当前显示在视图区域中间
      block: 'center',
      // 值有auto、instant,smooth，缓动动画（当前是慢速的）
      behavior: 'smooth'
    })
    break // 因为我们只需要检测一项,所以就可以跳出循环了
  }
}

export default {
  isTest,
  getPrefix,
  getTypeName,
  validateField,
  getRegExp,
  getFile,
  showError,
  showWarn,
  showSuccess,
  formatDate,
  getItem,
  setItem,
  removeItem,
  getLocalItem,
  setLocalItem,
  removeLocalItem,
  formatNumber,
  showLoading,
  hideLoading,
  debounce,
  regExp,
  base64ToFile,
  getImageBase64,
  imgToCompressed,
  getBizCode,
  formatIdCard,
  validIdcNumber,
  scrollView
}
