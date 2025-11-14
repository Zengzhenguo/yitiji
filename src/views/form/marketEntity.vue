<template>
  <div class="home-page">
    <page-header />
    <breadcrumb />
    <main>
      <div class="top">
        <div>市场主体服务“一链通”</div>
        <div>市场主体全生命周期“一链通”审批服务</div>
      </div>
      <div class="center">
        <el-row class="business-type" :gutter="36">
          <el-col :span="6" class="type-item">
            <div class="sldj">设立登记</div>
          </el-col>
          <el-col :span="6" class="type-item">
            <div class="jyxk">经营许可</div>
          </el-col>
          <el-col :span="6" class="type-item">
            <div class="jyfz">经营发展</div>
          </el-col>
          <el-col :span="6" class="type-item">
            <div class="zxdj">注销登记</div>
          </el-col>
        </el-row>
        <!-- <div class="business-type">
          <div class="sldj">设立登记</div>
          <div class="jyxk">经营许可</div>
          <div class="jyfz">经营发展</div>
          <div class="zxdj">注销登记</div>
        </div> -->
        <el-row class="business-content" :gutter="36">
          <el-col :span="6">
            <div class="content-item" @click="toNext()">
              <div class="content-bg">
                <img src="../../assets/marketEntity/bg1.png" alt="" />
                <div class="bg-tips tips1">设立登记</div>
              </div>
              <div class="content-title">商事主体确认登记</div>
              <div class="content-text">照章户税社“一网通办”</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div v-if="curArea.district!=='房县' && curArea.district!=='竹溪县' && curArea.district!=='竹山县' && curArea.district!=='郧阳区' && curArea.district!=='郧西县'" class="content-item" @click="toOneIntegratedLicense()">
              <div class="content-bg">
                <img src="../../assets/marketEntity/bg2.png" alt="" />
                <div class="bg-tips tips2">经营许可</div>
              </div>
              <div class="content-title">一业一证</div>
              <div class="content-text">行业综合许可证</div>
            </div>
            <div class="content-item" @click="toyqyz()">
              <div class="content-bg">
                <img src="../../assets/marketEntity/bg3.png" alt="" />
                <div class="bg-tips tips2">证照联办</div>
              </div>
              <div class="content-title">一企一证</div>
              <div class="content-text">同步办理营业执照和经营许可证</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="content-item" @click="toQuickBusiness('seal')">
              <div class="content-bg">
                <img src="../../assets/marketEntity/bg12.png" alt="" />
                <div class="bg-tips tips3">公章刻制</div>
              </div>
              <div class="content-title">公章刻制</div>
              <div class="content-text">政策解读、一键复制、申请兑现</div>
            </div>
            <div class="content-item" @click="toQuickBusiness('bank')">
              <div class="content-bg">
                <img src="../../assets/marketEntity/bg11.png" alt="" />
                <div class="bg-tips tips3">银行开户</div>
              </div>
              <div class="content-title">银行开户</div>
              <div class="content-text">政策解读、一键复制、申请兑现</div>
            </div>
            <!-- <div class="content-item">
              <div class="content-bg">
                <img src="../../assets/marketEntity/bg4.png" alt="" />
                <div class="bg-tips tips3">政企互动</div>
              </div>
              <div class="content-title">“三管家”服务</div>
              <div class="content-text">企业管家、项目管家、环保管家</div>
            </div> -->
            <div v-if="curArea.district!=='房县' && curArea.district!=='竹溪县' && curArea.district!=='竹山县' && curArea.district!=='郧阳区' && curArea.district!=='郧西县'" class="content-item" @click="toMarketMedia()">
              <div class="content-bg">
                <img src="../../assets/marketEntity/bg5.png" alt="" />
                <div class="bg-tips tips3">中介服务</div>
              </div>
              <div class="content-title">网上中介服务</div>
              <div class="content-text">“一站式”中介咨询和服务</div>
            </div>
            <!-- <div class="content-item">
              <div class="content-bg">
                <img src="../../assets/marketEntity/bg6.png" alt="" />
                <div class="bg-tips tips3">政策兑现</div>
              </div>
              <div class="content-title">惠企政策</div>
              <div class="content-text">政策解读、一键复制、申请兑现</div>
            </div> -->
          </el-col>
          <el-col :span="6">
            <div class="content-item" @click="toCancellation()">
              <div class="content-bg">
                <img src="../../assets/marketEntity/bg7.png" alt="" />
                <div class="bg-tips tips4">企业退出</div>
              </div>
              <div class="content-title">简易注销</div>
              <div class="content-text">适用未开业或无债权债务企业</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="bottom">
        <span>添加微信小程序”湖北市场监管融平台”小程序</span>
        <span style="margin-left: 210px">，也可以办理和查询业务</span>
        <img src="../../assets/images/mini_code.png" alt="" />
      </div>
    </main>
    <footer>
      <div class="footer">
        <span>主办单位：湖北省市场监督管理局</span>
        <span style="margin-left:15px">技术支持单位：武汉网融信息科技有限公司</span>
        <span style="margin-left:140px">鄂公网安备42010602000665号 鄂ICP备05011090号-1 政府网站标识码：4200000093</span>
      </div>
    </footer>
  </div>
</template>

<script>
import { getBaseData } from '@/api'
import PageHeader from '@/components/PageHeader/index'
import Breadcrumb from '@/components/Breadcrumb/index'
export default {
  components: {
    PageHeader,
    Breadcrumb
  },
  data() {
    return {
      provice: '', // 机器所在省
      city: '', // 机器所在市
      district: '', // 机器所在区
      tId: '', // 机器唯一编号
      homeList: [],
      businessList: [
      ]
    }
  },
  computed: {
    curArea() {
      return this.$utils.getLocalItem('curArea')
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
      if (query.src) {
        const token = 'a2247a4c-5bb4-40c9-b2a9-7ea8cbdabb41'
        const userInfo = { 'name': '王海鹏', 'idNumber': '42080419840816111X' }
        const expiryDate = '1637659902561'
        this.$utils.setLocalItem('token', token)
        this.$utils.setLocalItem('expiryDate', expiryDate)
        this.$utils.setLocalItem('userInfo', userInfo)
        this.$store.commit('login/SET_USER_INFO', userInfo)
        this.$utils.setLocalItem('tId', '2020II-500120565')
      }
      if (query.tId) {
        this.$utils.setLocalItem('tId', query.tId)
      }
      if (query.device) {
        this.$utils.setLocalItem('device', query.device)
      }
    }
    try {
      const res = await getBaseData()
      const baseInfo = res.outData.jobPackage.HB_QYKB_DRAFT.inData
      // 基础数据存储
      this.$utils.setLocalItem('baseInfo', baseInfo)
      // 获取当前地区数据
      let curArea = Object.values(baseInfo.areaInfo).filter(item => item.tId.indexOf(this.$utils.getLocalItem('tId')) !== -1)
      if (!curArea.length) curArea = [baseInfo.areaInfo['十堰经济技术开发区']]
      this.$utils.setLocalItem('curArea', curArea[0])
      // 重构首页菜单（hideMenu为需要隐藏的菜单）
      for (let i = this.businessList.length - 1; i >= 0; i--) {
        const item = this.businessList[i]
        if (curArea[0].hideMenu.includes(item.type)) {
          this.businessList.splice(i, 1)
          this.homeList = this.businessList
        }
      }
    } catch (error) {
      this.$utils.showError('获取基本信息失败，请检查网络！')
    }
  },
  methods: {
    toNext() {
      this.$router.push({ path: '/form/handleNotice', query: { type: 'commercial', bizName: '商事主体确认登记' }})
    },
    // 一企一证
    toyqyz() {
      this.$router.push({ path: 'aEnterpriseCertificate', query: { type: 'aEnterpriseCertificate', bizName: '一企一证' }})
    },
    // 一业一证
    toOneIntegratedLicense() {
      this.$router.push({ path: 'oneIntegratedLicense', query: { type: 'oneIntegratedLicense', bizName: '一业一证' }})
    },
    // 快捷办理
    toQuickBusiness(type) {
      if (type === 'seal') {
        this.$router.push({ path: '/form/subscribeSeal' })
      }
      if (type === 'bank') {
        this.$router.push({ path: '/form/subscribeBank' })
      }
      // this.$router.push({ path: '/form/IdentityAuthorization', query: { type: type }})
    },
    // 简易注销
    toCancellation() {
      this.$router.push({ path: 'companyLogoutLicense', query: { type: 'simpleCancellation', bizName: '简易注销' }})
    },
    // 中介服务
    toMarketMedia() {
      this.$router.push({ path: 'marketMedia', query: { type: 'simpleCancellation', bizName: '中介服务' }})
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
  position: relative;
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
    // border-top:1px solid #C4C4C4;
    // margin-top: 20px;
    position:relative;
    .top{
      margin-top: 30px;
      div:first-child{
        color: #464646;
        font-size:32px;
        font-family: PingFangHK-Semibold, PingFangHK;
        font-weight: 600;
        margin-bottom: 13px;
      }
      div:last-child{
        color: #464646;
        font-size:16px;
        font-family: PingFangHK-Regular, PingFangHK;
      }
    }
    .center{
      width: 1200px;
      margin: 30px auto 260px;
      .business-type{
        // display: flex;
        // flex-wrap: wrap;
        // justify-content: center;
        .type-item{
          height: 59px;
          line-height:59px;
          font-size: 18px;
          font-weight: 550;
        }
        .sldj{
          width: 246px;
          color: #496DFC;
          background:url('../../assets/marketEntity/type1.png') no-repeat ;
          background-size: cover;
        }
        .jyxk{
          width: 246px;
          color: #F9A51E;
          background:url('../../assets/marketEntity/type2.png') no-repeat ;
          background-size: cover;
        }
        .jyfz{
          width: 246px;
          color: #F16C6D;
          background:url('../../assets/marketEntity/type3.png') no-repeat ;
          background-size: cover;
        }
        .zxdj{
          width: 246px;
          color: #53C191;
          background:url('../../assets/marketEntity/type4.png') no-repeat ;
          background-size: cover;
        }
      }
      .business-content{
        // display: flex;
        // flex-wrap: wrap;
        // justify-content: center;
        margin-top: 24px;
        .el-col{
          // border-right:2px solid #D5DCE1;
        }
        .content-item{
          width: 246px;
          height: 229px;
          box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.08);
          opacity: 1;
          margin-bottom: 30px;
          .content-bg{
            width: 246px;
            position: relative;
            img{
              width: 248px;
              height: 127px;
            }
            .bg-tips{
              width: 75px;
              height: 26px;
              position:absolute;
              right: 0;
              top: 0;
              z-index: 2;
              font-size: 12px;
              font-family: Source Han Sans CN;
              font-weight: 500;
              line-height: 24px;
              color: #FFFFFF;
              background-size: cover;
              &.tips1{
                background: url('../../assets/marketEntity/tips1.png') no-repeat;
              }
              &.tips2{
                background: url('../../assets/marketEntity/tips2.png') no-repeat;
              }
              &.tips3{
                background: url('../../assets/marketEntity/tips3.png') no-repeat;
              }
              &.tips4{
                background: url('../../assets/marketEntity/tips4.png') no-repeat;
              }
            }
          }
          .content-title{
            font-size: 18px;
            font-family: Source Han Sans CN;
            font-weight: 550;
            line-height: 31px;
            color: #333333;
            margin-top: 15px;
            text-align: center;
          }
          .content-text{
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            line-height: 24px;
            color: #666666;
            margin-top: 5px;
            text-align: center;
          }
        }
      }
      // padding-left: 80px;
    //   .liBox {
    //     display: flex;
    //     flex-wrap: wrap;
    //     justify-content: center;
    //     .liMain {
    //       background: #fff;
    //       box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.08);
    //       margin-right: 60px;
    //       margin-bottom: 10px;
    //       .liInfo {
    //         list-style-type:none;
    //         cursor: pointer;
    //         img{
    //           width: 334px;
    //           height: 170px;
    //           &.five {
    //             width: 280px;
    //             height: 134px;
    //           }
    //         }
    //         .event-module{
    //           margin-top: 20px;
    //           div:first-child{
    //             color: #333333;
    //             font-size:26px;
    //             font-family: PingFangHK-Medium, PingFangHK;
    //             font-weight: 550;
    //             margin-bottom: 10px;
    //           }
    //           .event-title {
    //             font-size: 20px !important;
    //           }
    //           div:last-child{
    //             color:#666666;
    //             font-size:18px;
    //             font-family: PingFangHK-Regular, PingFangHK;
    //             margin-bottom: 27px;
    //           }
    //         }
    //       }
    //     }
    //     .liMain:nth-child(4n) {
    //       margin-right: 0;
    //     }
    //     .liMain:last-child{
    //       margin-right: 0;
    //     }
    //   }
    }
    .bottom{
      position: absolute;
      bottom: 100px;
      width: 967px;
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
        left: 465px;
      }
    }
  }
  footer{
    position: absolute;
    left: 83px;
    right: 83px;
    bottom: 30px;
    text-align: center;
    .footer{
      display: flex;
      span{
        font-size: 20px;
        color: #7F7E7E;
        &:nth-child(2) {
          flex: 1;
        }
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
