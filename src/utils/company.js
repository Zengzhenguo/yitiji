export const data = {
  // level: '', // 冠名级别(中文)
  // hasLevel: false, // 企业名称是否带行政级别
  industryFormulated: '', // 行业表述
  companyType: '', // 公司类型
  orgWay: '', // 组织方式
  area: '', // 行政区划文字，以空格隔开，eg: 湖北省 咸宁市 XXX区
  areaCode: '421200', // 行政区划代码
  number: '', // 企业字号
  visitors: false, // 是否设立监事会
  directors: false, // 是否设立董事会
  visitorsTime: '3', // 监事会任职年限
  directorsTime: '3', // 董事会任职年限
  companyName: '', // 公司名称
  useAddress: true, // 是否使用住所（经营住所）自主申报
  rightNumber: '', // 产权证号
  rightSize: '', // 产权面积
  addressArea: '', // 经营住所行政区划
  addressAreaCode: '', // 经营住所行政区划code
  address: '', // 经营住所详细地址
  addressAreaStreet: '', // 经营住所所在街道
  addressAreaStreetCode: '', // 经营住所街道编号
  nature: '', // 场所性质
  useWay: '', // 使用方式
  ownerName: '', // 房屋业主姓名
  ownerPhone: '', // 房屋业主电话
  promise: false, // 本人承诺自主申报经营地址符合法律法规相关要求
  endTime: '', // 截止日期
  validDates: '', // 经营有效期
  computedWays: '', // 核算方式
  industryType: { // 所选行业类型
    IndustryCode: '', // 行业类型对应唯一标识
    IndustryName: '' // 行业类型名称
  },
  instructions: [], // 房屋使用证明
  addressConsistent: false, // 生产经营地与经营住所一致
  productAddress: '', // 生产地址
  productInstructions: [], // 生产地址房屋使用证明
  productAreaStreet: '', // 生产地址所在街道
  productAreaStreetCode: '', // 生产地址街道编号
  productArea: '', // 生产地址行政区划
  productAreaCode: '', // 生产地址行政区划代码
  currency: '', // 币种
  capital: '', // 注册资本
  employeesCount: '', // 从业人数
  licenseCount: 1, // 营业执照数量
  memberList: [{
    idcName: '', // 人员姓名或企业名称
    idcType: '', // 证件类型
    idcNumber: '', // 证件号码（自然人：证件号码 法人：统一社会信用代码）
    idAddress: '', // 自然人证件地址
    legalName: '', // 法人姓名
    legalIdType: '', // 法人证件类型
    legalIdNumber: '', // 法人证件号码
    front: '', // 自然人身份证人像面
    back: '', // 自然人身份证背面
    licensePic: '', // 法人营业执照照片
    phone: '', // 自然人或法人移动电话
    investors: false, // 是否投资人
    type: '', // 股东类型（自然人股东、法人股东）
    investorsList: [{ // 投资人列表
      way: '', // 自然人或法人出资方式
      currency: '人民币', // 出资币种
      money: '' // 自然人或法人出资金额,支持小数点后3位
    }],
    time: '', // 自然人或法人出资时间
    jobs: [{ // 自然人人员职务
      id: '', // 职务名称ID
      name: '', // 职务名称(显示项)
      ways: '', // 任免方式
      nationality: '中国', // 国籍
      institutions: '', // 任免机构
      waysList: [], // 该职务任免方式选项
      institutionsList: [] // 该职务任免机构选项
    }]
  }], // 人员列表
  scope: [ // 经营范围(对象数组)
    {
      BusinessName: '会计、审计及税务服务', // 经营范围中文
      BusinessCode: 'L01072003001', // 经营范围code
      LicenseType: 0, // 经营范围类型 0:一般经营范围 1： 后置经营范围 2： 前置经营范围
      active: true
    }
  ]
}
