import utils from '@/utils/index'
import notify from '@/utils/notify.js'
import request from '@/utils/request'
import { MessageBox } from 'element-ui'
import fly from 'flyio'
// const baseApiUrl = window.location.origin
const baseApiUrl = 'https://q.g4b.cn/zhkb'
let curArea = {}
if (utils.getLocalItem('curArea')) {
  curArea = utils.getLocalItem('curArea')
}
// console.log(token)
// if (process.env.NODE_ENV === 'development' && !token) {
//   window.localStorage.setItem('token', '4a82ee37-e74e-4e3a-9f15-36a2e8060fff') // fdab436e-00b4-4ba3-a343-6995f40e0e97
// }

// 请求拦截器
fly.interceptors.request.use(request => {
  request.baseURL = utils.getPrefix()
  request.headers['Content-Type'] = 'application/json'
  request.headers['token'] = utils.getLocalItem('token')

  if (process.env.NODE_ENV === 'development') {
    console.group(`${request.method} 请求 ${request.url} 成功`)
    console.log(request)
    console.groupEnd()
  }

  // alert('token=' + window.localStorage.getItem('token'))
  return request
})

// 返回拦截器
fly.interceptors.response.use((response) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`${response.request.url} 返回成功`)
    console.log(response.data)
    console.groupEnd()
  }
  return response.data
}, error => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`返回失败`)
    console.log(error)
    console.groupEnd()
  }
  utils.hideLoading()
  // Notification.error({title: '发生错误', message: '网络繁忙，请稍后再试！'})
  return error
})

const startJob = params => fly.post('/open-platform/g4bOpenRPA/startJob', params)// 开放平台-发起工作
const uploadFile = params => fly.post('/open-platform/g4bOpenRPA/uploadFile', params)// 开放平台-上传文件
const uploadFileKey = params => fly.post('/open-platform/rest/uploadFile?alias=agentCertificate', params) // 开放平台-上传文件带token
const getFileList = params => fly.get('/mydoc-service/user/attachment/list', params) // 获取我的文件
const getUUID = () => fly.get('/user-platform/rest/getUUID') // 获取uuid
const getScanCodeStatus = uuid => fly.get(`/user-platform/rest/getScanCodeStatus?uuid=${uuid}`) // 获取登录状态
const updateScanCodeStatus = params => fly.post('/user-platform/rest/updateScanCodeStatus', params) // 更新登录状态

// const getTokenByUUID = uuid => fly.get(`/user-platform/rest/getTokenByUUID?uuid=${uuid}`) // 获取登录结果
const getUserInfo = () => fly.post('/user-platform/rest/getUserInfo') // 获取用户信息

export default {
  ...notify,
  MessageBox,
  baseApiUrl,
  startJob,
  uploadFile,
  uploadFileKey,
  getFileList,
  getUUID,
  getScanCodeStatus,
  updateScanCodeStatus,
  getUserInfo
}
// 获取行政区划
export function getDist(data) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData: data,
      job: 'HuBei_DistCode'
    }
  })
}
export function getStreet(distCode) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData: {
        distCode
      },
      job: 'HuBei_Get_Street'
    }
  })
}
// 企业名称查重
export function recheckName(data) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData: data,
      job: 'HUBEI_ENT_NAME_CHECK'
    }
  })
}
// 企业名称查重（省局）
export function recheckNameSJ(data) {
  return request({
    url: '/acceptance_platform/povincialBureau/nameCheck',
    method: 'POST',
    data
  })
}

// 敏感词检测
export function sensitiveWord(SensitiveWord) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData: {
        SensitiveWord
      },
      job: 'HUBEI_SENSITIVE_WORD_CHECK'
    }
  })
}
// 获取经营范围
export function getScope(data) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData: data || {},
      job: 'HUBEI_ENTERPRISE'
    }
  })
}
// 获取门类（省局）
export function getScopeClassSJ(code) {
  return request({
    url: '/acceptance_platform/povincialBureau/queryDictionary',
    method: 'POST',
    data: {
      code: code || 'CA05'
    }
  })
}
// 获取经营范围三级分类
export function getthreeClassSJ(data) {
  return request({
    url: '/acceptance_platform/povincialBureau/opscopesearch/keyword',
    method: 'POST',
    data: data
  })
}
// 获取大类、经营范围（省局）
export function getScopeCategoSJ(bigClass) {
  return request({
    url: '/acceptance_platform/povincialBureau/queryCatego',
    method: 'POST',
    data: {
      value: bigClass
    }
  })
}
// 搜索经营范围（省局）
export function queryBusinessScopeSJ(data) {
  return request({
    url: '/acceptance_platform/povincialBureau/queryBusinessScope',
    method: 'POST',
    data
  })
}

// 获取行业类型
export function getIndustry(data) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData: data || {},
      job: 'HUBEI_INDUSTRY'
    }
  })
}

// 获取行业描述
export function getDesc(IndustryDescriptionKeyword) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData: {
        IndustryDescriptionKeyword
      },
      job: 'HUBEI_INDUSTRY_DESCRIPTION'
    }
  })
}
// 获取行业描述（省局）
export function getDescSJ(keyWord) {
  return request({
    url: '/acceptance_platform/povincialBureau/queryIndustryRepresenta',
    method: 'POST',
    data: {
      name: keyWord
    }
  })
}

// 预览PDF,企业开办、个体工商户开办HUBEI_START_SIGN_PREVIEW,一事联办HUBEI_YSLB_PREVIEW
export function preview(inData, whatform) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData,
      job: whatform === 'jointOffice' ? 'HUBEI_YSLB_PREVIEW' : 'HUBEI_START_SIGN_PREVIEW'
    }
  })
}
// 预览PDF2
export function preview2(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData,
      job: 'HUBEI_START_SIGN_INDIVIDUAL_PREVIEW'
    }
  })
}

// 创建业务流水号
export function createJobQueue() {
  return request({
    // url: '/open-platform/jobQueue/createJobQueue',//修改了
    url: '/open-platform/jobQueue/createJobQueue',
    method: 'POST',
    data: {
      'alias': 'HB_QYKB_JOB_QUEUE',
      'jobPackage': {
        'HB_QYKB_DRAFT': {
          'inData': {}
        }
      }
    }
  })
}

// 获取上传文件uuid
export function getFileUUID(ident) {
  return request({
    url: '/open-platform/jobQueue/' + ident,
    method: 'GET'
  })
}

// 重置轮询接口
export function uploadGetUUID(ident) {
  return request({
    url: '/open-platform/jobQueue/createJobQueue',
    method: 'POST',
    data: {
      'alias': 'HB_QYKB_JOB_QUEUE',
      'queueIdent': ident,
      'jobPackage': {
        'HB_QYKB_DRAFT': {
          'inData': { // 清空数据
            type: '', // 清空类型
            files: [] // 重置单个数据，单个数据使用数组存储,多个数据使用files[0]这个对象存储数据，保持数据一致性
            // filesObj: {} // 重置多个数据，多个数据使用对象存储，对象内容自行定义
          }
        }
      }
    }
  })
}

// 获取章程模板
export function getConstitutionPDF(type) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      job: 'HUBEI_CREATE_CONSTITUTIONPDF',
      inData: {
        type
      }
    }
  })
}

// 智能添加经营范围
export function getSmartScope(BusinessText) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      job: 'HUBEI_ENTERPRISE_CLASSIFICATION',
      inData: {
        BusinessText
      }
    }
  })
}
// 获取身份证信息（ocr）
export function getIdCardInfo(image) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      job: 'ID_CARD_DISCERN',
      inData: { idcType: '身份证', image }
    }
  })
}
// 获取bizCode(项目暂停,交付)/bizbox-service/bizConfig/getBizCode
export function getBizCode() {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      job: 'EC_BIZBOX_GET_BIZCODE',
      inData: {
        // bizName: '',
        // bizHandleUrl: ''
      }
    }
  })
}
// 保存草稿
export function saveDraft(draftNumber, companyName, bizName, businessType, draftData, number) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      job: 'EC_BIZBOX_DRAFT_SAVE',
      inData: {
        userToken: utils.getLocalItem('token'),
        bizPushTime: (parseInt(new Date().getTime() / 1000)).toString(),
        bizName,
        bizStateName: '草稿',
        bizCode: utils.getLocalItem('bizCode'),
        name: companyName,
        zgdw: '',
        businessType,
        draftData,
        draftNumber: draftNumber || '',
        number: number
      }
    }
  })
}
// 获取草稿详情
/**
 * @param {String} draftNumber 订单号
 */
export function getDraftDetail(draftNumber) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      job: 'EC_BIZBOX_DRAFT_DETAIL',
      inData: {
        draftNumber
      }
    }
  })
}
// 删除草稿
/**
 * @param {String} draftNumber 订单号
 */
export function deleteDraft(draftNumber) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      job: 'EC_BIZBOX_DRAFT_DELETE',
      inData: {
        draftNumber
      }
    }
  })
}
// 修改办件
export function editDothing(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      job: 'HUBEI_DELETEINFO_QUERY',
      inData
    }
  })
}

// 提交审核
export function submit(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData,
      job: 'HUBEI_ENT_APPLY'
    }
  })
}
// 获取机构名称
export function getOrganization(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData,
      job: 'HUBEI_QYKB_DATA'
    }
  })
}
// 获取打印列表
export function getPrintList(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData,
      job: curArea.listName
    }
  })
}
// 获取轮询结果
export function getLicenseInfo(serialNo, isLegalReprese,creditCode) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData: {
        serialNo,
        isLegalReprese,
        creditCode,
      },
      job: curArea.licenseInfo
    }
  })
}
// 打印结果上传
export function uploadResult(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData,
      job: curArea.resultName
    }
  })
}

// 获取基本信息(5d62c8ae8ff44a439abf499cddbfe99d)
export function getBaseData() {
  return request({
    url: '/open-platform/jobQueue/5d62c8ae8ff44a439abf499cddbfe99d',
    method: 'GET',
    headers: {
      token: 'fdab436e-00b4-4ba3-a343-6995f40e0e97'
    }
  })
}

// 获取湖北许可营业执照查询
export function getXNLicenseInfo(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'post',
    data: {
      inData,
      job: 'HUBEI_LICENSE_PDF'
    }
  })
}
// 获取湖北企业信息档案打印
export function getPrintPdfInfo(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'post',
    data: {
      inData,
      job: 'HUBEI_ARCHIVE_PDF'
    }
  })
}
// 获取二维码
export function getQRcode(data) {
  return request({
    url: '/license/getLicenseElcQrid',
    method: 'post',
    data: data
  })
}
// 采集商事一链通数据
export function setCommercialData(inData) {
  return request({
    url: '/acceptance_platform/company/saveCompanyInfo',
    method: 'post',
    data: {
      inData: inData
    }
  })
}
// 获取网点列表
export function getOutletsList(inData) {
  if (utils.getLocalItem('tId') === '2021II-ZW-JZGXQ' && utils.getLocalItem('mode') !== 'test') {
    inData.areaCode = '421000'
  }
  return request({
    url: '/acceptance_platform/accountNum/queryOutletsList',
    method: 'post',
    data: inData
  })
}
// 获取公积金网点列表
export function getProvidentFundOutletsList(inData) {
  return request({
    url: '/acceptance_platform/accountNum/queryProvidentFundBankOutletsList',
    method: 'post',
    data: inData
  })
}

// 获取不动产信息
export function getImmovableInfo(inData, area,number) {
  return request({
    url: '/acceptance_platform/bizNum/queryImmovableInfo',
    method: 'post',
    data: {
      certificateHolderCode: inData,
      area: area,
      certificateNumber:number
    }
  })
}
//校验是否是一人公司
export function checkIfOnePerson(inData) {
  return request({
    url: '/acceptance_platform/bizNum/checkIfOnePerson',
    method: 'post',
    data: inData
  })
}
// 基于证照标识信息获取服务
export function GetCertificateDataByCertificateID(inData) {
  return request({
    url: '/acceptance_platform/shiyan/GetCertificateDataByCertificateID',
    method: 'post',
    data: inData
  })
}
// 证照缩略图获取服务
export function GetCertificateImageByCertificateID(inData) {
  return request({
    url: '/acceptance_platform/shiyan/GetCertificateImageByCertificateID',
    method: 'post',
    data: inData
  })
}
//校验是否是老赖
export function checkIfLaoLai(inData) {
  return request({
    url: '/acceptance_platform/bizNum/checkIfLaoLai',
    method: 'post',
    data: inData
  })
}
//校验黑名单
export function checkIfBlack(inData) {
  return request({
    url: '/acceptance_platform/bizNum/checkIfBlack',
    method: 'post',
    data: inData
  })
}
//经营范围黑名单
export function getDisableBusinessScope(inData) {
  return request({
    url: '/acceptance_platform/bizNum/queryDisableBusinessScope',
    method: 'post',
    data: inData
  })
}
// 获取上传材料列表
export function getBusinessLicenseList(category) {
  return request({
    url: '/acceptance_platform/businessLicenseConfig/queryBusinessLicenseConfig',
    method: 'post',
    data: {
      category: category
    }
  })
}

// 根据统一社会信用代码查询企业信息
export function getCompanyInfo(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      job: 'HUBEI_CREDITCODE_QUERY',
      inData
    }
  })
}

// 提交一业一证信息
export function setYYYZInfo(data) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      job: 'HUBEI_SAVELICENSE',
      inData: {
        yyyzData: data
      }
    }
  })
}
// 查询一业一证信息
export function queryLicenseList(data) {
  return request({
    url: '/acceptance_platform/businessLicenseApplyOrder/queryLicenseApplyOrderByToken',
    method: 'POST',
    data
  })
}

// 查询一业一证信息详情
export function getLicenseDetail(data) {
  return request({
    url: '/acceptance_platform/businessLicenseApplyOrder/queryLicenseApplyOrderByTokenDetail',
    method: 'POST',
    data
  })
}

// 校验详细经营地址
export function verifyStreetAdress(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData,
      job: 'HUBEI_ADDRESS_QUERY'
    }
  })
}

// 校验详细经营范围
export function verifyScope(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData,
      job: 'HUBEI_LIMIT_SCOPE'
    }
  })
}

// 提交注销公司信息
export function setLogoutCompanyInfo(data) {
  return request({
    url: '/acceptance_platform/logoutCompany/saveLogoutCompanyInfo',
    method: 'POST',
    data
  })
}

// 查询提交注销公司列表
export function queryLogoutCompanyList(data) {
  return request({
    url: '/acceptance_platform/logoutCompany/queryLogoutCompanyInfoByToken',
    method: 'POST',
    data
  })
}

// 查询提交注销公司详情
export function queryLogoutCompanyDetail(data) {
  return request({
    url: '/acceptance_platform/logoutCompany/queryLogoutCompanyInfoByTokenDetail',
    method: 'POST',
    data
  })
}

// 查询中介服务
export function queryIntermediaryInfo(data) {
  return request({
    url: '/acceptance_platform/intermediaryInfo/queryIntermediaryInfoCategory',
    method: 'POST',
    data
  })
}

// 查询中介服务详情
export function queryIntermediaryInfoDetail(data) {
  return request({
    url: '/acceptance_platform/intermediaryInfo/queryIntermediaryInfoList',
    method: 'POST',
    data
  })
}

// 查询水电气网服务商列表
export function queryWaterLectricityEtworkList(indata) {
  if (utils.getLocalItem('tId') === '2021II-ZW-JZGXQ' && utils.getLocalItem('mode') !== 'test') {
    indata.areacode = '421000'
  }
  return request({
    url: '/acceptance_platform/accountNum/queryWaterLectricityEtworkAddressList',
    method: 'POST',
    data: indata
  })
}
// 年报
// 查询企业信息
export function queryCompanyInfo(data) {
  return request({
    url: '/acceptance_platform/annualReport/queryAnnualReport',
    method: 'POST',
    data
  })
}

// 过滤企业信息
export function filterCompanyInfo(data) {
  return request({
    url: '/acceptance_platform/annualReport/filterAnnualReport',
    method: 'POST',
    data
  })
}

// 联络员ID校验
export function checkID(inData) {
  return request({
    url: `/open-platform/g4bOpenRPA/startJob`,
    method: 'POST',
    data: {
      inData,
      job: 'CHECK_LIAISON_MAN_ID'
    }
  })
}

// 校验表单数据
export function checkOrderData(ident) {
  return request({
    url: `/open-platform/g4bOpenRPA/startJob`,
    method: 'POST',
    data: {
      inData: {
        ident
      },
      job: 'HUBEI_NB_VERIFY_ORDER_DATA'
    }
  })
}

// 根据ident获取订单信息
export function getOrderInfo(ident) {
  return request({
    url: `/open-platform/g4bOpenRPA/job/${ident}`,
    method: 'GET'
  })
}

// 保存年报订单信息
export function saveReportInfo(data) {
  return request({
    url: `/acceptance_platform/annualReport/saveCompanyInfo`,
    method: 'POST',
    data
  })
}

// 获取年报订单信息
export function getReportInfo(ident) {
  return request({
    url: `/acceptance_platform/annualReport/queryCompanyInfo/${ident}`,
    method: 'GET'
  })
}

// 获取年报信息
export function queryAnnualReportInfo(ident) {
  return request({
    url: `/acceptance_platform/annualReport/queryAnnualReportInfo/${ident}`,
    method: 'GET'
  })
}

// 个体户提交年报，旧HuBei_NBQY/GTH/TWcheck/
export function personReportApply(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData,
      job: 'HUBEI_ANNUAL_REPORT_APPLY'
    }
  })
}

// 企业提交年报，旧HuBei_NBQY/TWcheck/
export function companyReportApply(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData,
      job: 'HUBEI_ANNUAL_QY_REPORT_APPLY'
    }
  })
}

// 草稿详情
export function draftDetail(draftNumber) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData: { draftNumber },
      job: 'EC_BIZBOX_DRAFT_DETAIL'
    }
  })
}


// 个人独资年报提交
export function singleReportApply(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData,
      job: 'HUBEI_ANNUAL_GRDZ_REPORT_APPLY'
    }
  })
}

// 分公司年报提交
export function branchReportApply(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData,
      job: 'HUBEI_ANNUAL_FGS_REPORT_APPLY'
    }
  })
}

// 农民专业合作社年报提交
export function cooperativeReportApply(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData,
      job: 'HUBEI_ANNUAL_NCZYHZS_REPORT_APPLY'
    }
  })
}

// 可以提交的年报年限
export function canSumbitYearReport(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data: {
      inData,
      // job: 'HUBEI_ANNUAL_YEAR_QUERY_API'
      job: 'HUBEI_NIANBAO_YEAR_QUERY'
    }
  })
}

// 可信地址库
export function trustAddress(data) {
  return request({
    url: '/acceptance_platform/addressLibrary/queryAddressLibraryByNum',
    method: 'POST',
    data
    // : {
    //   inData
    // }
  })
}
// 打印执照校验经办人  /acceptance_platform/bizNum/checkManagerInfo
export function trustAgent(data) {
  return request({
    url: '/acceptance_platform/bizNum/checkManagerInfo',
    method: 'POST',
    data
    // : {
    //   inData
    // }
  })
}
// 打照埋点接口  /acceptance_platform/takeRecord/saveTakeRecord
export function saveTakeRecord(data) {
  return request({
    url: '/acceptance_platform/takeRecord/saveTakeRecord',
    method: 'POST',
    data
    // : {
    //   inData
    // }
  })
}
// 查询公积金管理机构列表接口  /acceptance_platform/accountNum/queryAccountList
export function queryAccountList(data) {
  return request({
    url: '/acceptance_platform/accountNum/queryAccountList',
    method: 'POST',
    data
    // : {
    //   inData
    // }
  })
}

// 获取签署箱boxId
export function getBoxId(bizNum) {
  return request({
    url: '/signbox/envelopSign/getByBizNum',
    method: 'GET',
    params: { bizNum }
  })
}

// 获取签名PDF
export function getSignPdf(boxId) {
  return request({
    url: '/signbox/envelopSign/getSignPdf',
    method: 'POST',
    data: {
      boxId,
      type: '2'
    }
  })
}

// 获取鄂城区标准地址
export function trustAddressFromEcq(data) {
  return request({
    url: '/acceptance_platform/realEstate/queryRealEstate',
    method: 'POST',
    data
  })
}

// 获取湖北政务网用户信息
export function queryUserInfoFromHbZw(uuid) {
  return request({
    url: '/acceptance_platform/queryInfo',
    method: 'GET',
    params: { uuid }
  })
}

// 硚口区禁用地址校验
export function checkDisableAddress(data) {
  return request({
    url: '/acceptance_platform/bizNum/queryDisableAddress',
    method: 'POST',
    data: {
      address: data.address,
      area: data.area
    }
  })
}
// 浠水地址库搜索
export function xiShuiAddress(keyWord) {
  return request({
    url: '/acceptance_platform/xishui/queryAddress',
    method: 'POST',
    data: {
      address: keyWord
    }
  })
}
// 十堰查询电子证照库
export function SYRetrieval(data) {
  return request({
    url: '/acceptance_platform/shiyan/getPhoto',//这个是正确接口
    // url: '/acceptance_platform/shiyan/getPhotos',
    method: 'POST',
    data: data
  })
}
// 查询屏蔽的企业名称
export function queryDisableCompanyName(data) {
  return request({
    url: '/acceptance_platform/bizNum/queryDisableCompanyName',
    method: 'POST',
    data: data
  })
}
// 查询屏蔽的行业表述
export function queryDisableIndustryDescription(data) {
  return request({
    url: '/acceptance_platform/bizNum/queryDisableIndustryDescription',
    method: 'POST',
    data: data
  })
}


// 个人信息档案查询（生成pdf的)
export function Personal_informationSearch(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data:{
      inData,
      // job:'HUBEI_TEST_ZX_ARCHIVIST_FILE_DOWNLOAD'//测试
      job:'HUBEI_PRODUCE_ZX_ARCHIVIST_FILE_DOWNLOAD'
    }
  })
}
// 个人信息档案查询（生成目录的)
export function Personal_directorySearch(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data:{
      inData,
      // job:'HUBEI_TEST_ZX_ARCHIVIST_FILE_QUREY'//测试
      job:'HUBEI_PRODUCE_ZX_ARCHIVIST_FILE_QUREY'//线上
    }
  })
}
// 个人信息档案查询（生成具体的pdf)
export function Personal_directory_pdf(inData) {
  return request({
    url: '/open-platform/g4bOpenRPA/startJob',
    method: 'POST',
    data:{
      inData,
      // job:'HUBEI_TEST_ZX_ARCHIVIST_FILE_DOWNLOAD'//测试
      job:'HUBEI_PRODUCE_ZX_ARCHIVIST_FILE_DOWNLOAD'//线上
    }
  })
}
export function CommitError(data) {
  return request({
    url: '/acceptance_platform/faultFeedback/create',
    method: 'POST',
    data
  })
}

  export function getArchivesInformation(inData) {
    return request({
      url: '/open-platform/g4bOpenRPA/startJob',
      method: 'POST',
      data:{
        inData,
        job:'HUBEI_PRODUCE_ZX_ENTERPRISE_INFO_QUREY'//线上
        // job:'HUBEI_TEST_ZX_ENTERPRISE_INFO_QUREY'
      }
    })
  }
