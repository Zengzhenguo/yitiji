export default {
  // level: '', // 冠名级别(中文)
  // hasLevel: false, // 企业名称是否带行政级别
  industryFormulated: '', // 行业表述
  companyType: '', // 公司类型
  orgWay: '', // 组织方式
  area: '', // 行政区划文字，以空格隔开，eg: 湖北省 咸宁市 XXX区
  areaCode: '421200', // 行政区划代码
  number: '', // 企业字号
  companyName: '', // 公司名称
  useAddress: true, // 是否使用住所（经营住所）自主申报
  rightNumber: '', // 产权证号
  rightSize: '', // 产权面积
  addressArea: '', // 经营住所行政区划
  addressAreaStreet: '', // 经营住所所在街道
  addressAreaStreetCode: '', // 经营住所街道编号
  addressAreaCode: '', // 经营住所行政区划code
  address: '', // 经营住所详细地址
  nature: '', // 场所性质
  useWay: '', // 使用方式
  ownerName: '', // 房屋业主姓名
  ownerPhone: '', // 房屋业主电话
  isNetwork: false, // 是否使用网络地址
  networkAddress: [
    {
      name: '平台名称',
      site: '平台网址'
    }
  ],
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
  productArea: '', // 生产地址行政区划
  productAreaCode: '', // 生产地址行政区划代码
  productAreaStreet: '', // 生产地址所在街道
  productAreaStreetCode: '', // 生产地址街道编号
  currency: '', // 币种
  capital: '', // 注册资本
  employeesCount: '', // 从业人数
  licenseCount: 1, // 营业执照数量
  memberOrgWay: '', // 组成形式 个人经营或者家庭经营
  memberList: [{
    idcName: '测试', // 人员姓名
    idcType: '身份证', // 证件类型
    idcNumber: '123123123', // 证件号码
    idAddress: '1231231', // 证件地址
    front: '13123.jpg', // 自然人身份证人像面
    back: '213.png', // 自然人身份证背面
    phone: '134111111', // 移动电话
    politics: '中共党员', // 政治面貌
    education: '本科', // 文化程度
    nationality: '中国', // 国籍
    nation: '', // 民族
    sex: '', // 性别
    jobs: [{ // 自然人人员职务
      id: '', // 职务名称ID
      name: '主要经营者' // 职务名称(显示项)
    },
    { // 自然人人员职务
      id: '', // 职务名称ID
      name: '参与经营者' // 职务名称(家庭经营才会有)
    },
    { // 自然人人员职务
      id: '', // 职务名称ID
      name: '经办人/委托代理人' // 职务名称(显示项)
    }]
  }], // 人员列表
  scope: [ // 经营范围(对象数组)
    {
      BusinessName: '会计、审计及税务服务', // 经营范围中文
      LicenseType: 0, // 经营范围类型 0:一般经营范围 1： 后置经营范围 2： 前置经营范围
      active: true
    }
  ]
}
