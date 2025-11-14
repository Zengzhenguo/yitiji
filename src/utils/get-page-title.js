import defaultSetting from '@/config'

const title = defaultSetting.title || '湖北企业登记智慧辅助办理平台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
