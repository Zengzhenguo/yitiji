import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import('@/views/home/index'),
    // redirect: '/form/handleNotice',
    meta: {
      title: '首页'
    }
  },
  {
    path: '/license/first',
    component: () => import('@/views/license/firstLicense')
  },
  {
    path: '/license/secend',
    component: () => import('@/views/license/secendLicense')
  },
  {
    path: '/quickEntry',
    name: '办理须知',
    component: () => import('@/views/home/quickEntry'),
    meta: { title: '办理须知' }
  },
  // 湖北政务网鄂城区特色服务入口
  {
    path: '/quickEntryFormEcq',
    name: '办理须知',
    component: () => import('@/views/home/quickEntryFormEcq'),
    meta: { title: '办理须知' }
  },
  {
    path: '/quickHome',
    name: 'quickHome',
    component: () => import('@/views/home/quickHome'),
    meta: { title: '首页' }
  },
  {
    path: '/report',
    redirect: '/report/base',
    component: () => import('@/views/common/index'),
    children: [
      {
        path: 'base',
        name: '企业年报',
        component: () => import('@/views/report/base'),
        meta: { title: '企业年报' }
      },
      {
        path: 'fillInfo',
        name: '填报须知',
        component: () => import('@/views/report/fillInfo'),
        meta: { title: '填报须知' }
      },
      {
        path: 'person',
        name: 'ReportPerson',
        component: () => import('@/views/report/person'),
        meta: { title: '个体工商户公示信息填报', noCashed: true }
      },
      // {
      //   path: 'personOtherInfo',
      //   name: 'ReportPersonOtherInfo',
      //   component: () => import('@/views/report/personOtherInfo'),
      //   meta: { title: '个体工商户公示信息填报', noCashed: true }
      // },
      {
        path: 'company',
        name: '基本信息',
        component: () => import('@/views/report/companyMessage'),
        meta: { title: '基本信息' }
      },
      {
        path: 'shareholderInfor',
        name: '股东信息',
        component: () => import('@/views/report/shareholderInfor'),
        meta: { title: '股东信息' }
      },
      {
        path: 'assetInfo',
        name: '资产信息',
        component: () => import('@/views/report/assetInfo'),
        meta: { title: '资产信息' }
      },
      {
        path: 'optionalInfo',
        name: '选填信息',
        component: () => import('@/views/report/optionalInfo'),
        meta: { title: '选填信息' }
      },
      {
        path: 'single',
        name: 'ReportSingleBase',
        component: () => import('@/views/report/single'),
        meta: { title: '基本信息', noCashed: true }
      },
      {
        path: 'singleProperty',
        name: 'ReportSingleProperty',
        component: () => import('@/views/report/singleProperty'),
        meta: { title: '资产状况和社保信息', noCashed: true }
      },
      {
        path: 'singleOtherInfo',
        name: 'ReportSingleOtherInfo',
        component: () => import('@/views/report/singleOtherInfo'),
        meta: { title: '选填信息', noCashed: true }
      },
      {
        path: 'branch',
        name: 'ReportBranchBase',
        component: () => import('@/views/report/branch'),
        meta: { title: '基本信息', noCashed: true }
      },
      {
        path: 'branchProperty',
        name: 'ReportBranchProperty',
        component: () => import('@/views/report/branchProperty'),
        meta: { title: '资产状况和社保信息', noCashed: true }
      },
      {
        path: 'branchOtherInfo',
        name: 'ReportBranchOtherInfo',
        component: () => import('@/views/report/branchOtherInfo'),
        meta: { title: '选填信息', noCashed: true }
      },
      {
        path: 'cooperative',
        name: 'ReportCooperativeBase',
        component: () => import('@/views/report/cooperative'),
        meta: { title: '基本信息', noCashed: true }
      },
      {
        path: 'cooperativeProperty',
        name: 'ReportCooperativeProperty',
        component: () => import('@/views/report/cooperativeProperty'),
        meta: { title: '资产状况和社保信息', noCashed: true }
      },
      {
        path: 'cooperativeOtherInfo',
        name: 'ReportCooperativeOtherInfo',
        component: () => import('@/views/report/cooperativeOtherInfo'),
        meta: { title: '选填信息', noCashed: true }
      }
    ]
  },
  {
    path: '/form',
    redirect: '/form/handleNotice',
    component: () => import('@/views/common/layout'),
    children: [
      {
        path: 'handleNotice',
        name: '办理须知',
        component: () => import('@/views/form/handleNotice'),
        meta: { title: '办理须知' }
      },
      {
        path: 'businessHandling',
        name: '业务办理',
        component: () => import('@/views/form/businessHandling'),
        meta: { title: '业务办理' }
      },
      {
        path: 'nameApply',
        name: '名称申报',
        component: () => import('@/views/form/nameApply'),
        meta: { title: '名称申报' }
      },
      {
        path: 'noNameApply',
        name: '无字号注册登记',
        component: () => import('@/views/form/noNameApply'),
        meta: { title: '无字号注册登记' }
      },
      {
        path: 'address',
        name: 'Address',
        component: () => import('@/views/form/address'),
        meta: { title: '经营住所申报' }
      },
      {
        path: 'scope',
        name: 'Scope',
        component: () => import('@/views/form/scope'),
        meta: { title: '经营范围申报' }
      },
      {
        path: 'member',
        name: 'Member',
        component: () => import('@/views/form/member'),
        meta: { title: '股东和管理人员填报' }
      },
      {
        path: 'member-self-employed',
        name: 'member-self-employed',
        component: () => import('@/views/form/member-self-employed'),
        meta: { title: '相关经营者申报' }
      },
      {
        path: 'otherInfo',
        name: 'OtherInfo',
        component: () => import('@/views/form/otherInfo'),
        meta: { title: '其他基础信息' }
      },
      {
        path: 'condition',
        name: 'Condition',
        component: () => import('@/views/form/condition'),
        meta: { title: '经营情况申报' }
      },
      {
        path: 'preview',
        name: 'Preview',
        component: () => import('@/views/form/preview'),
        meta: { title: '表单预览' }
      },
      {
        path: 'previewDocInfo',
        name: 'previewDocInfo',
        component: () => import('@/views/form/previewDocInfo'),
        meta: { title: '营业执照表单预览' }
      },
      {
        path: 'previewDocInfoPerson',
        name: 'previewDocInfoPerson',
        component: () => import('@/views/form/previewDocInfoPerson'),
        meta: { title: '企业档案预览' }
      },
      {
        path: 'list',
        name: '个人空间',
        component: () => import('@/views/jobList/list'),
        meta: { title: '个人空间' }
      },
      {
        path: 'business',
        name: '情形选择',
        component: () => import('@/views/form/business'),
        meta: { title: '情形选择' }
      },
      {
        path: 'personnel',
        name: '食品安全管理人员和从业人员申报',
        component: () => import('@/views/form/personnel'),
        meta: { title: '食品安全管理人员和从业人员申报' }
      },
      {
        path: 'equipment',
        name: '食品安全设备设施申报',
        component: () => import('@/views/form/equipment'),
        meta: { title: '食品安全设备设施申报' }
      },
      {
        path: 'uploadMaterial',
        name: '申请材料上传',
        component: () => import('@/views/form/uploadMaterial'),
        meta: { title: '申请材料上传' }
      },
      {
        path: 'taxAdministration',
        name: '预约税务登记',
        component: () => import('@/views/form/taxAdministration'),
        meta: { title: '预约税务登记' }
      },
      {
        path:'medicalInsurance',
        name:'预约医保业务',
        component: () => import('@/views/form/medicalInsurance'),
        meta: { title: '预约医保业务' }
      },
      {
        path: 'socialSecurity',
        name: '预约社保业务',
        component: () => import('@/views/form/socialSecurity'),
        meta: { title: '预约社保业务' }
      },
      {
        path: 'bankAccount',
        name: '办理银行开户',
        component: () => import('@/views/form/bankAccount'),
        meta: { title: '办理银行开户' }
      },
      {
        path: 'seal',
        name: '预约刻章印章',
        component: () => import('@/views/form/seal'),
        meta: { title: '预约刻章印章' }
      },
      // 公积金
      {
        path: 'accumulationFund',
        name: '公积金预约登记',
        component: () => import('@/views/form/accumulationFund'),
        meta: { title: '公积金预约登记' }
      },
      {
        path: '/form/utilityForm',
        name: '水电气网填报',
        component: () => import('@/views/form/utilityForm'),
        meta: { title: '水电气网填报' }
      },
      // 电力申报
      {
        path: 'electricityAllowed',
        name: '电力报装信息申报',
        component: () => import('@/views/form/electricityAllowed'),
        meta: { title: '电力报装信息申报' }
      },
      // 水务登记
      {
        path: 'waterRegister',
        name: '水务预约申报',
        component: () => import('@/views/form/waterRegister'),
        meta: { title: '水务预约申报' }
      },
      // 燃气登记
      {
        path: 'gasRegister',
        name: '天燃气预约申报',
        component: () => import('@/views/form/gasRegister'),
        meta: { title: '天燃气预约申报' }
      },

      // 直接预约刻章
      {
        path: 'IdentityAuthorization',
        name: '身份授权',
        component: () => import('@/views/form/IdentityAuthorization'),
        meta: { title: '身份授权' }
      },
      // 直接预约刻章
      {
        path: 'subscribeSeal',
        name: '预约刻章印章',
        component: () => import('@/views/form/subscribeSeal'),
        meta: { title: '预约刻章印章' }
      },
      // 直接预约银行开户
      {
        path: 'subscribeBank',
        name: '预约银行开户',
        component: () => import('@/views/form/subscribeBank'),
        meta: { title: '预约银行开户' }
      },
      // 一业一证
      {
        path: 'handleGuide',
        name: '办理指南',
        component: () => import('@/views/form/handleGuide'),
        meta: { title: '办理指南' }
      },
      {
        path: 'applicantInfo',
        name: '申请人基本信息',
        component: () => import('@/views/form/applicantInfo'),
        meta: { title: '申请人基本信息' }
      },
      {
        path: 'materialsUpload',
        name: '申请材料上传',
        component: () => import('@/views/form/materialsUpload'),
        meta: { title: '申请材料上传' }
      },
      {
        path: 'yyyzList',
        name: '办件查询',
        component: () => import('@/views/jobList/yyyzList'),
        meta: { title: '办件查询' }
      }
    ]
  },
  // 十堰市场主体业务页
  {
    path: '/marketEntity',
    name: '市场主体服务“一链通”',
    component: () => import('@/views/form/marketEntity'),
    meta: { title: '市场主体服务“一链通”' }
  },
  {
    path: '/marketMedia',
    name: '网上中介超市',
    component: () => import('@/views/form/marketMedia'),
    meta: { title: '网上中介超市' }
  },
  {
    path: '/oneIntegratedLicense',
    name: '一业一证专区',
    component: () => import('@/views/form/oneIntegratedLicense'),
    meta: { title: '一业一证专区' }
  },
  {
    path: '/aEnterpriseCertificate',
    name: '一企一证专区',
    component: () => import('@/views/form/aEnterpriseCertificate'),
    meta: { title: '一企一证专区' }
  },
  {
    path: '/companyLogoutLicense',
    name: '简易注销专区',
    component: () => import('@/views/form/companyLogoutLicense'),
    meta: { title: '简易注销专区' }
  },
  {
    path: '/printList',
    name: '营业执照打印',
    component: () => import('@/views/jobList/newPrintList'), // printList test-print
    meta: { title: '营业执照打印' }
  },
  {
    path: '/myPrintList',
    name: '自动化营业执照打印',
    component: () => import('@/views/jobList/MyPrintList.vue'), // printList test-print
    meta: { title: '自动化营业执照打印' }
  },
  // {
  //   path: '/newPrintList',
  //   name: '营业执照打印',
  //   component: () => import('@/views/jobList/newPrintList'), // printList test-print
  //   meta: { title: '新版营业执照打印' }
  // },
  {
    path: '/printImg',
    name: '打印许可证',
    component: () => import('@/views/jobList/printImg'),
    meta: { title: '打印许可证' }
  },
  {
    path: '/printLicense',
    name: '打印许可证',
    component: () => import('@/views/jobList/printLicense'),
    meta: { title: '打印许可证' }
  },
  {
    path: '/printXNLicense',
    name: '打印许可证',
    component: () => import('@/views/jobList/prinXNLicence'),
    meta: { title: '打印许可证' }
  },
  {
    path: '/pdfPreview',
    name: '打印许可证',
    component: () => import('@/views/jobList/pdfPreview'),
    meta: { title: '打印许可证' }
  },
  {
    path: '/printDoc',
    name: '企业信息档案查询',
    component: () => import('@/views/jobList/printDoc'),
    meta: { title: '企业信息档案查询' }
  },
  {
    path: '/personprintDocInfo',
    name: '市场主体信息档案查询',
    component: () => import('@/views/jobList/personprintDocInfo'),
    meta: { title: '市场主体信息档案查询' }
  },
  {
    path: '/personprintDocInfoTest',
    name: '市场主体信息档案查询',
    component: () => import('@/views/jobList/personprintDocInfoTest'),
    meta: { title: '市场主体信息档案查询' }
  },
  {
    path: '/personprintDocInfoSelfDeclaration',
    name: '企业档案查询',
    component: () => import('@/views/jobList/personprintDocInfoSelfDeclaration'),
    meta: { title: '企业档案查询' }
  },
  {
    path: '/EnterpriseInformationSelfDeclaration',
    name: '企业基本信息查询',
    component: () => import('@/views/jobList/EnterpriseInformationSelfDeclaration'),
    meta: { title: '企业基本信息查询' }
  },
  {
    path: '/printDocInfo',
    name: '企业信息档案查询',
    component: () => import('@/views/jobList/printDocInfo'),
    meta: { title: '企业信息档案查询' }
  },
  {
    path: '/officeBox/progressDetails',
    name: '办件详情',
    component: () => import('@/views/jobList/detail'),
    meta: { title: '办件详情' }
  },
  {
    path: '/cameraGuide',
    name: 'CameraGuide',
    component: () => import('@/views/guide/cameraGuide'),
    meta: { title: '操作指引' }
  },
  {
    path: '/idCardGuide',
    name: 'IdCardGuide',
    component: () => import('@/views/guide/idCardGuide'),
    meta: { title: '操作指引' }
  },
  {
    path: '/idCardGuideOther',
    name: 'idCardGuideOther',
    component: () => import('@/views/guide/idCardGuideOther'),
    meta: { title: '操作指引' }
  },
  {
    path: '/face',
    name: 'Face',
    component: () => import('@/views/face/index'),
    meta: { title: '操作指引' }
  },
  {
    path: '/selfDeclaration',
    name: 'selfDeclaration',
    component: () => import('@/views/selfDeclaration/index'),
    meta: { title: '自助企业档案查询平台' }
  },
  {
    path: '/ArchiveDetail',
    name: '企业基本信息查询',
    component: () => import('@/views/form/ArchiveInfo'),
    meta: { title: '企业基本信息查询' }
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/test/index'),
    meta: { title: '测试' }
  },
  {
    path: '/404',
    name: '404',
    meta: {
      hideHead: true // 是否隐藏头部
    },
    component: () => import('@/views/errorPage/404')
  },
  // {
  //   path: '/chief',
  //   name: '湖北政务服务网',
  //   component: () => import('@/views/Chief/Chief.vue'),
  //   meta: { title: '湖北政务服务网' }
  // },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
