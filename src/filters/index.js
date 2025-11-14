/*
 *@Description: 过滤手机号码中间4位
 *@Params phone 手机号码
 *@MethodAuthor: Liangguojiang
 *@Date: 2020-06-01 11:58:39
*/
export function formatPhone(phone) {
  const mobile = '' + phone
  return mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
/*
 *@Description: 过滤身份证中间4位
 *@Params phone 手机号码
 *@MethodAuthor: Liangguojiang
 *@Date: 2020-06-01 11:58:39
*/
export function formatIdNumber(idNumber) {
  const number = '' + idNumber
  return number.replace(/(\d{6})\d+(\d{4})/, number.length === 18 ? '$1********$2' : '$1*****$2')
}

// 去掉时间空格改成换行
export function repliceTime(str) {
  const arr = str.split(' ')
  const newStr = arr[0] + '<br/>' + arr[1]
  return newStr
}
// 格式化企业类型
export function formatCompanyType(value) {
  switch (value) {
    case '1':
      return '一人有限责任公司'
    case '2':
      return '有限责任公司（自然人投资或控股）'
    case '3':
      return '股份有限公司（非上市）'
    default:
      break
  }
}
export function filterFileType(name) {
  const value = name.toLowerCase()
  if (value.indexOf('pdf') > -1 || value.indexOf('jpg') > -1 || value.indexOf('png') > -1 || value.indexOf('jpeg') > -1) {
    return true
  } else {
    return false
  }
}

// 格式化设立类型
export function formatNameDict(type) {
  switch (type) {
    case 'company':
      return '内资企业开办'
    case 'person':
      return '个体工商户开办'
    case 'restaurant':
      return '我要开餐馆'
    case 'drink':
      return '我要开饮品店'
    case 'supermarket':
      return '我要开小超市/便利店/副食店'
    case 'canteen':
      return '我要开单位食堂'
    default:
      break
  }
}

// 格式化设立类型
export function filterFormats(type) {
  switch (type) {
    case 'restaurant':
    case 'drink':
      return '餐饮服务经营者'
    case 'supermarket':
      return '食品销售经营者'
    case 'canteen':
      return '单位食堂'
    default:
      break
  }
}

// 格式化设立类型
export function filterBizName(type) {
  switch (type) {
    case '内资企业辅助开办':
      return 'company'
    case '个体工商户辅助开办':
      return 'person'
    case '我要开餐馆':
      return 'restaurant'
    case '我要开饮品店':
      return 'drink'
    case '我要开小超市/便利店/副食店':
      return 'supermarket'
    case '我要开单位食堂':
      return 'canteen'
    case '荆州9210企业开办':
      return '9210commercial'
    case '商事一链通':
      return 'commercial'
    default:
      break
  }
}

// 根据业务名称，获取对应的页面
export function filterPageName(value) {
  switch (value) {
    case '个体工商户':
      return 'person'
    case '有限责任公司(自然人独资)':
    case '有限责任公司(自然人投资或控股)':
      return 'company'
    case '个人独资企业':
      return 'single'
    case '有限责任公司分公司(自然人投资或控股)':
      return 'branch'
    case '农民专业合作社':
      return 'cooperative'
    default:
      break
  }
}

export function setChineseField(obj) {
  // 所有市监局数据
  const data = {
    'ENTNAME': '企业名称',
    'UNISCID': '统一社会信用代码',
    'REGNO': '注册号',
    'LEREP': '经营者名称',
    'DOM': '企业通讯地址',
    'ESTDATE': '成立日期',
    'apprdate': '核准日期',
    'TEL': '企业联系电话',
    'POSTALCODE': '邮政编码',
    'EMAIL': '电子邮箱',
    'OPSCOPE': '经营范围',
    'NAME': '企业类型',
    'STATE': '企业经营状态',
    'ZCZB': '注册资本',
    'EMPNUM': '从业人数',
    'FEMAILNUM': '其中女性从业人数',
    'COLGRANUM': '高校毕业生经营者人数',
    'colempnum': '高校毕业生雇员人数',
    'RETSOLNUM': '退役士兵经营者人数',
    'RETEMPLNUM': '退役士兵雇员人数',
    'DISPERNUM': '残疾人经营者人数',
    'DISEMPLNUM': '残疾人雇员人数',
    'UNENUM': '失业人员再就业经营者人数',
    'UNEEMPLNUM': '失业人员再就业雇员人数',
    'shortname': '设立机构',
    'fundam': '资金数额',
    'idCard': '企业联络员身份证号码'
  }
  const newObj = {}
  for (const i in obj) {
    for (const j in data) {
      if (i.toLowerCase() === j.toLowerCase()) {
        newObj[data[j]] = obj[i]
        if (i.toLowerCase() === 'state') { // 映射企业经营状态
          newObj['企业经营状态'] = formatCompanyState(obj[i])
        }
      }
    }
  }
  return newObj
}

function formatCompanyState(state) {
  switch (+state) {
    case 6:
      return '开业'
    case 7:
    case 11:
      return '停业'
    default:
      return ''
  }
}
