<!--
 * @Author: your name
 * @Date: 2022-02-17 10:35:34
 * @LastEditTime: 2022-08-25 09:57:40
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /ec-gov-biz-hubei-pc/src/views/home/quickHome.vue
-->
<template>
  <div class="home-page">
    <page-header />
    <main>
      <div class="top">
        <div>AI辅助开办，智能秒批</div>
        <div>一表填报，智能辅助，轻松打照</div>
      </div>
      <div class="center">
        <div class="liBox" :style="homeList.length < 4 ? 'justify-content: center;': ''">
          <div v-for="(item, index) in homeList" :key="index" class="liMain">
            <li class="liInfo" @click="nextPage(item)">
              <img :class="homeList.length > 5 ? 'five' : ''" :src="item.src" alt="" />
              <div class="event-module">
                <div :class="item.titile.length > 10 ? 'event-title' : ''">{{ item.titile }}</div>
                <div>{{ item.describe }}</div>
              </div>
            </li>
          </div>
        </div>
      </div>
      <div class="bottom">
        <span>添加微信小程序”荆州企业开办9210特色服务”小程序</span>
        <span style="margin-left: 210px">，也可以办理和查询业务</span>
        <img src="../../assets/images/mini_code_jz.png" alt="" />
      </div>
    </main>
    <footer>
      <div class="footer">
        <span>主办单位：荆州市市场监督管理局</span>
        <span style="margin-left:15px">技术支持单位：武汉网融信息科技有限公司</span>
        <span style="margin-left:140px">鄂ICP备17030875号-3 </span>
        <span v-if="isShow" style="margin-top: 15px;">支持单位：崇阳县工商银行崇阳支行</span>
      </div>
    </footer>

    <!-- 操作指引 -->
    <helpGuide />
  </div>
</template>

<script>
// import listImg1 from '../../assets/images/img1.png'
import listImg2 from '../../assets/images/img2.png'
import listImg3 from '../../assets/images/img3.png'
// import listImg4 from '../../assets/images/img4.png'
// import listImg9 from '../../assets/images/img9.png'
import { getBaseData } from '@/api'
// import listImg5 from '../../assets/images/img5.png'
// import listImg6 from '../../assets/images/img6.png'
// import listImg7 from '../../assets/images/img7.png'
// import listImg8 from '../../assets/images/img8.png'
// import listImg10 from '../../assets/images/img10.png'
import listImg11 from '../../assets/images/img11.png'
// import listImg12 from '../../assets/marketEntity/bg1.png'
// import listImg13 from '../../assets/images/img13.png'
import PageHeader from '@/components/PageHeader/index'
import helpGuide from '@/components/helpGuide'
export default {
  components: {
    PageHeader,
    helpGuide
  },
  data() {
    return {
      provice: '', // 机器所在省
      city: '', // 机器所在市
      district: '', // 机器所在区
      tId: '', // 机器唯一编号
      homeList: [],
      businessList: [
        // {
        //   src: listImg1,
        //   titile: '内资企业辅助开办',
        //   describe: '企业名称申报+设立登记联办',
        //   path: '/form/handleNotice',
        //   type: 'company'
        // },
        {
          src: listImg2,
          titile: '个体工商户辅助开办',
          describe: '个体工商户简易开办',
          path: '/form/handleNotice',
          type: 'person'
        },
        // {
        //   src: listImg10,
        //   titile: '市场主体服务"一链通"',
        //   describe: '商事确认制+企业全生命周期服务',
        //   path: '/marketEntity',
        //   type: 'commercial'
        // },
        // {
        //   src: listImg5,
        //   titile: '我要开餐馆',
        //   describe: '注册登记+经营许可证一事联办',
        //   path: '/form/handleNotice',
        //   type: 'restaurant'
        // },
        // {
        //   src: listImg6,
        //   titile: '我要开饮品店',
        //   describe: '注册登记+经营许可证一事联办',
        //   path: '/form/handleNotice',
        //   type: 'drink'
        // },
        // {
        //   src: listImg7,
        //   titile: '我要开小超市/便利店/副食店',
        //   describe: '注册登记+经营许可证一事联办',
        //   path: '/form/handleNotice',
        //   type: 'supermarket'
        // },
        // {
        //   src: listImg8,
        //   titile: '我要开单位食堂',
        //   describe: '注册登记+经营许可证一事联办',
        //   path: '/form/handleNotice',
        //   type: 'canteen'
        // },
        {
          src: listImg11,
          titile: '荆州9210企业开办',
          describe: '照章户税社水电气网“一网通办”',
          path: '/form/handleNotice',
          type: '9210commercial'
        },
        {
          src: listImg3,
          titile: '办件查询',
          describe: '办理状态、办件草稿查询',
          path: '/form/list',
          type: 'jobList'
        }
        // {
        //   src: listImg4,
        //   titile: '营业执照打印',
        //   describe: '查询、打印执照和相关文书',
        //   path: '/printList',
        //   type: 'printList'
        // },
        // {
        //   src: listImg9,
        //   titile: '企业信息档案查询',
        //   describe: '自助打印企业档案',
        //   // path: 'http://scjg.hubei.gov.cn/JR-web/oauth/login_files.html',
        //   path: '/printDocInfo',
        //   type: 'printDoc'
        // },
        // {
        //   src: listImg9,
        //   titile: '许可证打印',
        //   describe: '自助打印许可证',
        //   path: '/printXNLicense',
        //   type: 'printLicense'
        // },
        // {
        //   src: listImg13,
        //   titile: '企业年报',
        //   describe: '企业年报',
        //   path: '/report',
        //   type: 'report'
        // }
      ]
    }
  },
  computed: {
    // 是否显示支持单位
    isShow: function() {
      if (this.$utils.getLocalItem('curArea').district === '崇阳县') {
        return true
      }
      return false
    }
  },
  async created() {
    if (process.env.NODE_ENV === 'development') {
      // window.localStorage.setItem('userInfo', JSON.stringify({ 'name': '李召唤', 'idNumber': '440882199204176528' }))
      // window.localStorage.setItem('token', 'a8e37886-3cee-497f-8a6d-bf643993d14d')
      // window.localStorage.setItem('expiryDate', new Date().getTime() + 1000 * 60 * 60 * 2400)
    }
    const query = this.$route.query
    if (query) {
      if (query.tId) {
        this.$utils.setLocalItem('tId', query.tId)
      } else {
        this.$utils.setLocalItem('tId', '2021II-ZW-JZGXQ')
      }
      if (query.device) {
        this.$utils.setLocalItem('device', query.device)
      }
      if (query.mode) {
        this.$utils.setLocalItem('mode', query.mode)
      }
      this.$utils.setItem('origin', '湖北政务网荆州9210特色服务专区')
    }
    try {
      const res = await getBaseData()
      const baseInfo = res.outData.jobPackage.HB_QYKB_DRAFT.inData
      // 基础数据存储
      this.$utils.setLocalItem('baseInfo', baseInfo)
      // 固定菜单
      this.homeList = this.businessList
      // 获取当前地区数据
      let curArea = Object.values(baseInfo.areaInfo).filter(item => item.tId.indexOf(this.$utils.getLocalItem('tId')) !== -1)
      if (!curArea.length) curArea = [baseInfo.areaInfo['十堰经济技术开发区']]
      this.$utils.setLocalItem('curArea', curArea[0])
      // 重构首页菜单（hideMenu为需要隐藏的菜单）
    //   for (let i = this.businessList.length - 1; i >= 0; i--) {
    //     const item = this.businessList[i]
    //     if (this.$utils.getLocalItem('device') === 'MD' && item.type === 'company') {
    //       this.businessList.splice(i, 1)
    //     }
    //     if (curArea[0].hideMenu.includes(item.type)) {
    //       this.businessList.splice(i, 1)
    //       this.homeList = this.businessList
    //     }
    //   }
    } catch (error) {
      this.$utils.showError('获取基本信息失败，请检查网络！')
    }
  },
  methods: {
    nextPage(item) {
      if (item.path.includes('http')) {
        location.href = item.path
      } else {
        // if (this.$utils.getLocalItem('curArea').district !== '郧阳区' && item.type === 'printDoc') {
        //   location.href = 'http://scjg.hubei.gov.cn/JR-web/oauth/login_files.html'
        //   return
        // }
        this.$router.push({ path: item.path, query: { ...this.$route.query, type: item.type, bizName: item.titile }})
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.home-page {
  width: 100%;
  min-height: 100vh;
  background: url('../../assets/images/homePage_bg.png') no-repeat;
  background-size: 100% auto;
  background-position: left bottom;
  overflow: auto;
  ::v-deep .el-dialog__body{
    padding: 25px 25px 55px;
  }
  header {
    width: 100%;
    height: 100px;
    background: url('../../assets/images/header_top_bg.png');
    background-size: 1920px 150px;
    background-position: center;
    .header {
      display: flex;
      .left {
        padding-top: 22px;
        flex: 1;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        img {
          width: 50px;
          height: 50px;
          margin-right: 12px;
        }
        span {
          font-size: 26px;
          font-weight: 500;
          color: #FFFFFF;
        }
      }
      .right {
        padding-top: 20px;
        display: flex;
        align-items: center;
        .sign-out{
          display: flex;
          flex-direction: row;
          .name{
            font-size: 16px;
            color: #fff;
            height: 40px;
            line-height: 40px;
            margin-right: 20px;
          }
          .out{
            width: 99px;
            height: 40px;
            text-align: center;
            line-height: 40px;
            background: #fff;
            border-radius: 4px;
            font-size: 16px;
            color: #3162E8;
            cursor: pointer;
            user-select:none;
            &:active {
              background: #9abdff;
            }
          }
        }
        .login {
          width: 99px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          background: #fff;
          border-radius: 4px;
          font-size: 16px;
          color: #3162E8;
          cursor: pointer;
          user-select:none;
          &:active {
            background: #9abdff;
          }
        }
      }
    }
    .header-bottom {
      position: relative;
      width: 1250px;
      margin: 0 auto;
      img {
        position: absolute;
        left: 2px;
        top: 28px;
        width: 1526px;
        height: 134px;
      }
    }
  }
  main{
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    flex-direction: column;
    text-align: center;
    .top{
      margin-top: 30px;
      div:first-child{
        color: #464646;
        font-size:40px;
        font-family: PingFangHK-Semibold, PingFangHK;
        font-weight: 600;
        margin-bottom: 13px;
      }
      div:last-child{
        color: #464646;
        font-size:22px;
        font-family: PingFangHK-Regular, PingFangHK;
      }
    }
    .center{
      width: 1600px;
      margin: 30px auto 0;
      display: flex;
      justify-content: center;
      // padding-left: 80px;
      .liBox {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        .liMain {
          background: #fff;
          box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.08);
          margin-right: 60px;
          margin-bottom: 10px;
          .liInfo {
            list-style-type:none;
            cursor: pointer;
            img{
              width: 334px;
              height: 170px;
              &.five {
                width: 280px;
                height: 134px;
              }
            }
            .event-module{
              margin-top: 20px;
              div:first-child{
                color: #333333;
                font-size:26px;
                font-family: PingFangHK-Medium, PingFangHK;
                font-weight: 550;
                margin-bottom: 10px;
              }
              .event-title {
                font-size: 20px !important;
              }
              div:last-child{
                color:#666666;
                font-size:18px;
                font-family: PingFangHK-Regular, PingFangHK;
                margin-bottom: 27px;
              }
            }
          }
        }
        .liMain:nth-child(4n) {
          margin-right: 0;
        }
        .liMain:last-child{
          margin-right: 0;
        }
      }
    }
    .bottom{
      position: absolute;
      bottom: 100px;
      width: 980px;
      margin-top: 100px;
      height: 89px;
      line-height: 89px;
      padding: 0 35px;
      border-radius: 48px;
      border: 1px solid #3162E8;
      font-size: 20px;
      font-weight: 500;
      color: #025BFF;
      transform: translateX(-50%);
      left: 50%;
      img{
        position: absolute;
        width: 200px;
        height: 200px;
        top: -80px;
        left: 510px;
      }
    }
  }
  footer{
    position: absolute;
    left: 383px;
    right: 383px;
    bottom: 15px;
    text-align: center;
    .footer{
      display: flex;
      flex-wrap: wrap;
      span{
        font-size: 20px;
        color: #7F7E7E;
      }
    }
  }
  .dialog{
    width: 100%;
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    flex-direction: column;
    text-align: center;
    .dialog-title{
      font-size: 26px;
      font-family: SourceHanSansSC-Bold, SourceHanSansSC;
      font-weight: bold;
      color: #464646;
    }
    .dialog-tips{
      margin-top: 17px;
      font-size: 18px;
      font-family: PingFangHK-Medium, PingFangHK;
      font-weight: 550;
      color: #3162E8;
    }
  }
}
</style>
