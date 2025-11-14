/* eslint-disable no-unused-vars */
import { getLocalItem, setLocalItem } from '@/utils'
const form = {
  level: 0, // 冠名级别
  hasLevel: false, // 企业名称是否带行政级别
  industryFormulated: '', // 行业表述
  companyType: '', // 公司类型
  orgWay: '有限公司', // 组织方式
  area: '', // 行政区划文字，以空格隔开，eg: 湖北省 十堰市 XXX区
  number: '', // 企业字号
  companyName: '', // 公司名称
  areaCode: '', // 行政区划代码
  visitors: false, // 是否设立监事会
  directors: false, // 是否设立董事会
  visitorsTime: '3', // 监事会任职年限
  directorsTime: '3', // 董事会任职年限
  // area: '', // 行政区划
  // areaCode: '420300', // 行政区划代码
  // companyName: '', // 公司名称
  address: '', // 经营住所
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
  instructions: '', // 房屋使用证明
  addressConsistent: false, // 生产经营地与经营住所一致
  producAddress: '', // 生产地址
  productArea: '', // 生产地址行政区划
  productAreaCode: '', // 生产地址行政区划代码
  capital: '', // 注册资本
  employeesCount: '', // 从业人数
  licenseCount: 1, // 营业执照数量
  memberList: [{
    idcName: '', // 人员姓名或企业名称
    idcType: '', // 证件号码
    idcNumber: '', // 证件号码
    legalName: '', // 法人姓名
    legalIdType: '', // 法人证件类型
    legalIdNumber: '', // 法人证件号码
    front: '', // 自然人身份证人像面
    back: '', // 自然人身份证背面
    licensePic: '', // 法人营业执照照片
    outletsPhone: '', // 自然人或法人移动电话
    investors: false, // 是否投资人
    investorsList: [{ // 投资人列表
      way: '', // 自然人或法人出资方式
      money: '' // 自然人或法人出资金额,支持小数点后3位
    }],
    time: '', // 自然人或法人出资时间
    jobs: [{ // 自然人人员职务
      id: '', // 职务名称ID
      name: '', // 职务名称(显示项)
      ways: '', // 任免方式
      institutions: '', // 任免机构
      waysList: [], // 该职务任免方式选项
      institutionsList: [] // 该职务任免机构选项
    }]
  }], // 人员列表
  scope: [ // 经营范围(对象数组)
    {
      'BusinessName': '会计, 审计及税务服务', // 经营范围中文
      'BusinessCode': 'L01072003001', // 经营范围code
      'LicenseType': 0, // 经营范围类型 0:一般经营范围 1： 后置经营范围 2： 前置经营范围
      'active': true
    }
  ]
}
const companyType = [
  {
    label: '一人有限责任公司',
    value: '1',
    orgForm: [
      { label: '有限公司', value: '有限公司' },
      { label: '有限责任公司', value: '有限责任公司' }
    ]
  },
  {
    label: '有限责任公司（自然人投资或控股）',
    value: '2',
    orgForm: [
      { label: '有限公司', value: '有限公司' },
      { label: '有限责任公司', value: '有限责任公司' }
    ]
  },
  // {
  //   label: '股份有限公司',
  //   value: '3',
  //   orgForm: [
  //     { label: '股份公司', value: '股份公司' },
  //     { label: '股份有限公司', value: '股份有限公司' },
  //     { label: '股份有限责任公司', value: '股份有限责任公司' }
  //   ]
  // },
  {
    label: '个体工商户',
    value: '8',
    orgForm: [
      { label: '俱乐部', value: '0' },
      { label: '酒店', value: '1' },
      { label: '酒吧', value: '2' },
      { label: '旅店', value: '3' },
      { label: '农家院', value: '4' },
      { label: '农场', value: '5' },
      { label: '影楼', value: '6' },
      { label: '工作室', value: '7' },
      { label: '队', value: '8' },
      { label: '超市', value: '9' },
      { label: '网店', value: '10' },
      { label: '家庭农场', value: '11' },
      { label: '部', value: '12' },
      { label: '店', value: '13' },
      { label: '铺', value: '14' },
      { label: '馆', value: '15' },
      { label: '坊', value: '16' },
      { label: '场', value: '17' },
      { label: '经营部', value: '18' },
      { label: '门市部', value: '19' },
      { label: '大药房', value: '20' },
      { label: '药房', value: '21' },
      { label: '药店', value: '22' },
      { label: '厅', value: '23' },
      { label: '行', value: '24' },
      { label: '房', value: '25' },
      { label: '社', value: '26' },
      { label: '亭', value: '27' },
      { label: '网咖', value: '28' },
      { label: '处', value: '29' },
      { label: '厂', value: '30' },
      { label: '咖啡厅', value: '31' },
      { label: '咖啡店', value: '32' },
      { label: '中心', value: '33' },
      { label: '饭店', value: '34' },
      { label: '饭堂', value: '35' },
      { label: '吧', value: '36' },
      { label: '商行', value: '37' },
      { label: '商店', value: '38' },
      { label: '浴池', value: '39' },
      { label: '诊所', value: '40' },
      { label: '门诊部', value: '41' }
    ]
  }
]
// 政治面貌
const politics = ['中共党员', '中共预备党员', '共青团员', '民革会员', '民盟盟员', '民建会员', '民进会员', '民工党党员', '致公党党员', '九三学社社员', '台盟会员', '无党派民主人士', '群众'] //
// 文化程度
const education = ['研究生', '大学本科', '大学专科和专科学校', '中等专业学校', '技工学校', '高中', '初中', '小学']
// 民族
const nations = [
  '汉族', '蒙古族', '回族', '藏族', '维吾尔族', '苗族', '彝族', '壮族', '布依族', '朝鲜族', '满族', '侗族', '瑶族', '白族', '土家族',
  '哈尼族', '哈萨克族', '傣族', '黎族', '僳僳族', '佤族', '畲族', '高山族', '拉祜族', '水族', '东乡族', '纳西族', '景颇族', '柯尔克孜族', '土族',
  '达斡尔族', '仫佬族', '羌族', '布朗族', '撒拉族', '毛南族', '仡佬族', '锡伯族', '阿昌族', '普米族', '↵塔吉克族', '怒族', '乌孜别克族', '俄罗斯族',
  '鄂温克族', '德昂族', '保安族', '裕固族', '京族', '塔塔尔族', '独龙族', '鄂伦春族', '赫哲族', '门巴族', '珞巴族', '基诺族', '外国血统中国籍人', '其他'
]
// 过滤job内容
export function filterJobData() {
  const tId = getLocalItem('tId')
  switch (tId) {
    case '2020II-500120573': // 郧阳
      if (!getLocalItem('provice')) {
        setLocalItem('provice', '湖北省')
        setLocalItem('city', '十堰市')
        setLocalItem('district', '郧阳区')
      }
      return {
        applyName: 'HUBEI_YUNYANG_ENT_APPLY',
        listName: 'HUBEI_YUNYANG_LICENSE_INFO',
        resultName: 'HUBEI_YUNYANG_LICENSE_PRINTED_ARCHIVE',
        companyData: [
          {
            label: '冠市名',
            children: [
              { value: '十堰', label: '十堰' },
              { value: '十堰市', label: '十堰市' }
            ]
          },
          {
            label: '冠省名',
            children: [
              { value: '湖北', label: '湖北' },
              { value: '湖北十堰', label: '湖北十堰' },
              { value: '湖北十堰市', label: '湖北十堰市' },
              { value: '湖北省', label: '湖北省' },
              { value: '湖北省十堰', label: '湖北省十堰' },
              { value: '湖北省十堰市', label: '湖北省十堰市' }
            ]
          }

        ],
        personData: [{
          label: '冠区/县名',
          children: [
            { value: '郧阳区', label: '郧阳区' }
          ]
        }]
      }
    case '2020II-500120565': // 十堰经济技术开发区
      if (!getLocalItem('provice')) {
        setLocalItem('provice', '湖北省')
        setLocalItem('city', '十堰市')
        setLocalItem('district', '十堰经济技术开发区')
      }
      return {
        applyName: 'HUBEI_SY_ENT_APPLY',
        listName: 'HUBEI_SY_LICENSE_INFO',
        resultName: 'HUBEI_SY_LICENSE_PRINTED_ARCHIVE',
        companyData: [
          {
            label: '冠市名',
            children: [
              { value: '十堰', label: '十堰' },
              { value: '十堰市', label: '十堰市' }
            ]
          },
          {
            label: '冠省名',
            children: [
              { value: '湖北', label: '湖北' },
              { value: '湖北十堰', label: '湖北十堰' },
              { value: '湖北十堰市', label: '湖北十堰市' },
              { value: '湖北省', label: '湖北省' },
              { value: '湖北省十堰', label: '湖北省十堰' },
              { value: '湖北省十堰市', label: '湖北省十堰市' }
            ]
          }
        ],
        personData: [{
          label: '冠区/县名',
          children: [
            { value: '十堰经济技术开发区', label: '十堰经济技术开发区' }
          ]
        }]
      }
    case '2020II-500120567': // 恩施市
      if (!getLocalItem('provice')) {
        setLocalItem('provice', '湖北省')
        setLocalItem('city', '恩施土家族苗族自治州')
        setLocalItem('district', '恩施市')
      }
      return {
        applyName: 'HUBEI_ENSHI_ENT_APPLY',
        listName: 'HUBEI_ENSHI_LICENSE_INFO',
        resultName: 'HUBEI_ENSHI_LICENSE_PRINTED_ARCHIVE',
        companyData: [
          {
            label: '冠市名',
            children: [
              { value: '恩施州', label: '恩施州' },
              { value: '恩施自治州', label: '恩施自治州' },
              { value: '恩施州恩施市', label: '恩施州恩施市' },
              { value: '恩施自治州恩施市', label: '恩施自治州恩施市' }
            ]
          },
          {
            label: '冠省名',
            children: [
              { value: '湖北', label: '湖北' },
              { value: '湖北恩施州', label: '湖北恩施州' },
              { value: '湖北恩施自治州', label: '湖北恩施自治州' },
              { value: '湖北省', label: '湖北省' },
              { value: '湖北省恩施州', label: '湖北省恩施州' },
              { value: '湖北省恩施自治州', label: '湖北省恩施自治州' }
            ]
          }
        ],
        personData: [{
          label: '冠区/县名',
          children: [
            { value: '恩施', label: '恩施' },
            { value: '恩施市', label: '恩施市' }
          ]
        }]
      }
    default:
      return {
        applyName: 'HUBEI_SY_ENT_APPLY',
        listName: 'HUBEI_SY_LICENSE_INFO',
        resultName: 'HUBEI_SY_LICENSE_PRINTED_ARCHIVE',
        companyData: [
          {
            label: '冠市名',
            children: [
              { value: '十堰', label: '十堰' },
              { value: '十堰市', label: '十堰市' }
            ]
          },
          {
            label: '冠省名',
            children: [
              { value: '湖北', label: '湖北' },
              { value: '湖北十堰', label: '湖北十堰' },
              { value: '湖北十堰市', label: '湖北十堰市' },
              { value: '湖北省', label: '湖北省' },
              { value: '湖北省十堰', label: '湖北省十堰' },
              { value: '湖北省十堰市', label: '湖北省十堰市' }
            ]
          }
        ],
        personData: [{
          label: '冠区/县名',
          children: [
            { value: '十堰经济技术开发区', label: '十堰经济技术开发区' }
          ]
        }]
      }
  }
}
// 名称 经营范围禁用关键字
// eslint-disable-next-line no-sparse-arrays
const disabledKeyList_scope = ['理财', '资产管理', '虚拟货币', '虚拟资产', '加密货币', '加密资产',, '金融', '贷', '融资担保', '股权交易', '典当', '融资租赁', '商业保理', '地方资产管理', '交易所', '交易中心', '理财', '财富管理', '股权众筹', '资金互助', '信用互助', '元宇宙', '区块链', '虚拟货币', 'P2P', '征信修复', '信用修复', '征信铲单', '征信洗白', '清除不良信用记录', '银行', '保险', '证券公司', '基金管理', '信托', '财务公司', '股权众筹', '汽车金融', '货币经纪', '征信', '交易中心', '交易所', '商业保理', '小额贷款', '互联网保险', '支付', '外汇', '生物质成型燃料销售', '生物质燃料加工', '报废汽车回收', '报废机动车拆解', '危险废物经营（溶剂油）', '医院', '诊所', '医疗机构', '再生资源回收', '金属回收', '废旧物资回收', '互联网上网服务', '化工产品生产、销售', '危险化学品生产, 销售', '化妆品生产, 销售', '食品生产', '医疗器械生产、销售', '药品生产、销售', '烟花爆竹生产、销售', '家禽、家畜、牲畜养殖', '牲畜饲养', '家禽饲养', '矿产资源开采', '虚拟货币', '虚拟资产', '加密资产', '加密货币', '区块链商城', '区块链游戏', '汽车新车销售', '汽车旧车销售', '二手车经销', '砂, 石销售', '电动自行车销售', '助动自行车, 代步车及零配件销售', '电动三轮车, 电动四轮车销售', '煤炭及制品销售']

const disabledKeyList_cName = ['医院', '诊所', '医疗机构', '再生资源回收', '金属回收', '废旧物资回收', '互联网上网服务', '化工产品生产、销售', '危险化学品生产、销售', '化妆品生产、销售', '食品生产', '医疗器械生产, 销售', '药品生产, 销售', '烟花爆竹生产、销售', '家禽', '家畜', '牲畜养殖', '牲畜饲养', '家禽饲养', '发展', '实业', '中国', '国家', '国际', '投资', '投资咨询', '融资租赁', '商业保理', '小额贷款', '金融', '资产管理', '理财', '网贷', '网络借贷', 'P2P', '互联网保险', '支付', '外汇（汇兑, 结售汇, 货币兑换）', '基金管理', '担保', '电子烟零售', '电子烟批发', '电子烟及电子烟用烟碱进出口', '电子烟及电子烟用烟碱生产']

const isHasDisabledKey = function (str, type = 'scope') {
  let flag = false
  let key = ''
  if (typeof str === 'object') {
    str = JSON.stringify(str)
  } else if (typeof str !== 'string') {
    str = String(str)
  }
  // const res = disabledKeyList.some(item => str.includes(item))
  if (type === 'cName') {
    console.log(disabledKeyList_cName)
    disabledKeyList_cName.filter(item => {
      if (str.includes(item)) {
        flag = true
        key = item
        return true
      }
    })
  } else {
    disabledKeyList_scope.map(item => {
      if (str.includes(item)) {
        flag = true
        key = item
        return true
      }
    })
  }

  console.log(flag, key)
  return {
    flag,
    key
  }
}

// 硚口区固定的刻章网店
export const qkSealList = [
  {
    outletsName: '湖北楚锦特证文化发展有限公司',
    outletsAddr: '(地址：武汉市硚口区下铁路大厂141号7、8、9栋)',
    outletsContactPerson: '暂无',
    outletsPhone: '15271883373'
  },
  {
    outletsName: '武汉零点宝玺印章有限公司',
    outletsAddr: '(地址：武汉市硚口区古田北区203栋1层3号)',
    outletsContactPerson: '暂无',
    outletsPhone: '18971243806'
  },
  {
    outletsName: '武汉市硚口区施辉文刻字社',
    outletsAddr: '(地址：武汉市硚口区长堤街217号（新143号）)',
    outletsContactPerson: '暂无',
    outletsPhone: '13971026875'
  },
  {
    outletsName: '武汉市红红速达印章有限公司',
    outletsAddr: '(地址：武汉市硚口区硚口路185号1层附1号)',
    outletsContactPerson: '暂无',
    outletsPhone: '15172206984'
  },
  {
    outletsName: '玺运帮贸易（武汉）有限公司',
    outletsAddr: '(地址：武汉市硚口区古田二路长丰北垸特一号（武汉蓝焰物流基地）电商中心4楼西416室)',
    outletsContactPerson: '暂无',
    outletsPhone: '13018006575'
  },
  {
    outletsName: '武汉市硚口区精瑞刻字中心',
    outletsAddr: '(地址：武汉市硚口区解放大道331号)',
    outletsContactPerson: '暂无',
    outletsPhone: '13207107811'
  },
  {
    outletsName: '武汉若愚速达商贸有限公司',
    outletsAddr: '(地址：武汉市硚口区古田四路和解放大道交叉口联发·九都府第6幢17层4号)',
    outletsContactPerson: '暂无',
    outletsPhone: '15926206482'
  },
  {
    outletsName: '武汉市硚口晶仪刻字社',
    outletsAddr: '(地址：硚口区解放大道92号附7号)',
    outletsContactPerson: '暂无',
    outletsPhone: '13554268145'
  },
  {
    outletsName: '武汉市硚口区保林刻字部',
    outletsAddr: '(地址：武汉市硚口区崇仁路88号附2号)',
    outletsContactPerson: '暂无',
    outletsPhone: '18186115293'
  }
]

export default {
  companyType,
  politics,
  education,
  nations,
  form,
  filterJobData,
  isHasDisabledKey
}