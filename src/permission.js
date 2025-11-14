/*
 * @Author: your name
 * @Date: 2021-11-12 09:10:24
 * @LastEditTime: 2022-07-29 10:01:49
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /ec-gov-biz-hubei-pc 2/src/permission.js
 */
import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import utils, { getLocalItem, removeLocalItem } from '@/utils/index'
import { showError } from '@/utils/index'
import { MessageBox } from 'element-ui'
import {PAGE_TEXT_TITLE} from "@/utils/transformType"
import store from '@/store'
import { title } from './config'
NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['/', '/401', '/404', '/idCardGuide', '/face', '/test', '/marketEntity', '/oneIntegratedLicense','/quickEntry', '/quickHome', '/quickEntryFormEcq','/selfDeclaration','/idCardGuideOther']
const archivesList = ['/personprintDocInfoSelfDeclaration','/EnterpriseInformationSelfDeclaration']
router.beforeEach((to, from, next) => {
  // 页面加载动画
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title) // 如果不传入，默认显示湖北省企业开办智慧平台
  // 白名单放行
  if (whiteList.includes(to.path)) {
    next()
    NProgress.done()
  } else { // 非白名单
    // 获取过期时间
    const expiryDate = +getLocalItem('expiryDate')
    // 没有token，直接跳转登录
    if (!getLocalItem('token')) {
      if (getLocalItem('mode') === 'test') {
        showError('请先进行人脸认证操作')
        return
      }
      showError('请点击右上角按钮或按提示进行登录操作')
      if(archivesList.includes(to.path)){
        let title ="请使用微信扫码登录"
        let path = to.path.substring(1)
        if(PAGE_TEXT_TITLE.hasOwnProperty(path)){
          title =  PAGE_TEXT_TITLE[path]
        }
        // showError("请按提示进行登录操作")
        // next({ path: '/idCardGuideOther', replace: true ,query:{
        //   LoginTitle:title
        // }})
      }else{
        next({ path: '/idCardGuide', replace: true })
      }
      NProgress.done()
    } else if (getLocalItem('token') && expiryDate < new Date().getTime()) { // 有token且token已过期
      MessageBox.confirm('登录失效,请退出重新登录！', '温馨提示', {
        confirmButtonText: '重新登录',
        // showCancelButton: false,
        type: 'warning',
        customClass: 'Logout', // 自定义类名
        center: true
      }).then(() => {
        removeLocalItem('token')
        removeLocalItem('userInfo')
        store.commit('login/SET_USER_INFO', null)
        router.replace('/idCardGuide')
      }).catch(() => {
        removeLocalItem('token')
        removeLocalItem('userInfo')
        store.commit('login/SET_USER_INFO', null)
        // router.replace('/')
      })
      return
    } else {
      next()
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
