
import request from '@/utils/request'
// 附件上传
export function uploadFile(data) {
  return request({
    url: '/open-platform/g4bOpenRPA/uploadFile',
    method: 'POST',
    data
  })
}
