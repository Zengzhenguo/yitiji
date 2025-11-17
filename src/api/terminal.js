import jsonp from '@/utils/jsonp'
import Qs from 'qs'
import vueJsonp from '@/utils/vueJsonp'
import gpy_request from '@/utils/gpy_request'
// const baseURL = 'http://127.0.0.1:7999/'
// const MD_baseURL = 'http://127.0.0.1:8080/api/'
const baseURL = 'https://q.g4b.cn/zhkb'
const MD_baseURL = 'https://q.g4b.cn/zhkb'
// 身份证信息读取
export function loadIdCard() {
  return jsonp({
    url: baseURL + 'inteGration/hardwareControl/api/idcard',
    data: {
      timeout: 60,
      jsonpCallback: 'flightHandler'
    }
  })
}

// 停止身份证信息读取
export function stopLoadIdCard() {
  return jsonp({
    url: baseURL + 'inteGration/hardwareControl/api/stopIdcard',
    data: {
      jsonpCallback: 'flightHandler'
    }
  })
}

// 打开高拍仪
export function openSnCamera(data) {
  return jsonp({
    url: baseURL + 'inteGration/hardwareControl/api/openSnCamera',
    data: {
      picFormat: 'JPG',
      ...data,
      jsonpCallback: 'flightHandler'
    }
  })
}

// 关闭高拍仪
export function closeSnCamera() {
  return jsonp({
    url: baseURL + 'inteGration/hardwareControl/api/closeSnCamera',
    data: {
      jsonpCallback: 'flightHandler'
    }
  })
}

// 高拍仪拍照
export function snCameraBeginSnap() {
  return jsonp({
    url: baseURL + 'inteGration/hardwareControl/api/snCameraBeginSnap',
    data: {
      jsonpCallback: 'flightHandler'
    }
  })
}

// 打印
export function printPaper(data) {
  return jsonp({
    url: baseURL + 'inteGration/hardwareControl/api/printNew',
    data: {
      ...data,
      jsonpCallback: 'flightHandler'
    }
  })
}
// 活体校验
export function face(data) {
  return jsonp({
    url: 'http://127.0.0.1:1234',
    data: {
      ...data,
      times: 60,
      jsonpCallback: 'flightHandler'
    }
  })
}
// 打印营业执照
// export function print(data) {
//   return jsonp({
//     url: `http://127.0.0.1:9988?${data}`,
//     data: {
//       jsonpCallback: 'flightHandler'
//     }
//   })
// }
export function print(data) {
  return jsonp({
    url: `http://127.0.0.1:9988`,
    data: {
      ...data,
      jsonpCallback: 'flightHandler'
    }
  })
}

// 美鼎读卡设备

// 打开设备
export function MD_OpenDevice() {
  return vueJsonp({
    url: MD_baseURL + 'OpenDevice',
    data: {
      Port: '100',
      Baud: '0'
    }
  })
}

// 关闭读卡器
export function MD_CloseDevice() {
  return vueJsonp({
    url: MD_baseURL + 'CloseDevice'
  })
}

// 读二代证信息
export function MD_GetCardinfo() {
  return vueJsonp({
    url: MD_baseURL + 'ReadMsg'
  })
}

// 获取高拍仪数量
export function MD_GetDeviceCount() {
  return gpy_request({
    url: 'http://127.0.0.1:8888/GetDeviceCount',
    method: 'GET'
  })
}

// 打开高拍仪
export function MD_StartPreview() {
  return gpy_request({
    url: 'http://127.0.0.1:8888/StartPreview',
    method: 'GET',
    params: {
      dev_idx: 0,
      res_id: 0,
      pixfmt: 'pixfmt'
    }
  })
}

// 轮询拍照
export function MD_getframe() {
  return gpy_request({
    url: 'http://127.0.0.1:8888/getFrame',
    method: 'GET'
  })
}

// 获取当前图片
export function MD_getPic() {
  return gpy_request({
    url: 'http://127.0.0.1:8888/getPic',
    method: 'GET',
    params: {
      savepath: `D://Test.jpg`,
      quality: 80
    }
  })
}
// 纠偏
export function MD_EnableDeskImage(enable) {
  return gpy_request({
    url: `http://127.0.0.1:8888/EnableDeskImage?enable=${enable}`,
    method: 'GET'
  })
}
// 关闭高拍仪
export function MD_StopPreview() {
  return gpy_request({
    url: 'http://127.0.0.1:8888/StopPreview',
    method: 'GET',
    params: {
      dev_idx: 0
    }
  })
}

// 美鼎打印
// export function MD_print(type, base64) {
//   return gpy_request({
//     url: 'http://127.0.0.1:8172/PrintApi',
//     method: 'POST',
//     data: {
//       Fun: type,
//       Name: base64
//     }
//   })
// }
// http://localhost:9999/InitComm  初始化
// http://localhost:9999/Authenticate  卡认证
// http://localhost:9999/getUserInfo  读取身份信息
// http://localhost:9999/CloseComm  关闭读卡器

// 至唯读卡初始化
export function ZW_initIdCard() {
  return gpy_request({
    // url: 'http://127.0.0.1:9999/InitComm',
    url: 'http://127.0.0.1:18889/api/connect',
    method: 'GET'
  })
}
// 至唯卡认证
export function ZW_Authenticate() {
  return gpy_request({
    // url: 'http://127.0.0.1:9999/Authenticate',
    url: 'http://127.0.0.1:18889/api/getStatus',
    // method: 'GET'
    method: 'POST'
  })
}
// 至唯读取身份信息
// export function ZW_getIdCardInfo() {
//   return gpy_request({
//     url: 'http://127.0.0.1:18889/api/readCert',
//     // url: 'http://127.0.0.1:9999/getUserInfo',
//     // method: 'GET'
//     method: 'POST'
//   })
// }
export function ZW_getIdCardInfo() {
  return gpy_request({
    url: 'http://127.0.0.1:18889/api/readCert',
    method: 'GET',
    params: { _t: Date.now() } // ← 强制刷新
  })
}
// 至唯关闭读卡器
export function ZW_CloseComm() {
  return gpy_request({
    // url: 'http://127.0.0.1:9999/CloseComm',
    url: 'http://127.0.0.1:18889/api/disconnect',
    // method: 'GET'
    method: 'POST'
  })
}

// 至唯读取本地图片base64
export function ZW_getImgBase64() {
  return gpy_request({
    url: 'http://127.0.0.1:9999/getImgBase64',
    method: 'GET'
  })
}

// 删除至唯本地图片
export function ZW_delAllFile() {
  return gpy_request({
    url: 'http://127.0.0.1:9999/delAllFile ',
    method: 'GET'
  })
}
// 至唯打印
export function ZW_print(data) {
  data = Qs.stringify(data)
  return gpy_request({
    url: 'http://localhost:8080/Printer/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

// 汉德院打印
export function HDY_print(data) {
  return gpy_request({
    url: 'http://localhost:9999/print',
    method: 'GET',
    data
  })
}
