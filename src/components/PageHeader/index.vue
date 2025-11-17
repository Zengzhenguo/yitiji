<template>
  <div class="page-header">
    <div class="header">
      <div class="left" :style="$route.path === '/' ? '': 'cursor:pointer;'" @click="handleGo">
        <!-- <img src="../../assets/images/logo.png" alt="" />
        <span>湖北市场监管企业登记智慧辅助办理平台</span> -->
      </div>
      <div class="right">
        <div v-if="userInfo" class="sign-out">
          <span class="name">{{ userInfo.name }}</span>
          <div class="out" @click="signOut()">退出</div>
        </div>
        <div v-else class="login" @click="login">{{ $route.query.mode==='test'?'人脸认证':'登录' }}</div>
        <!-- <div v-else class="login" @click="$router.push('/idCardGuide')">登录</div> -->
      </div>
    </div>
    <div class="header-bottom">
      <img src="../../assets/images/header_bottom_bg.png" alt="" />
    </div>
    <el-dialog
      :visible.sync="loginDialogVisible"
      width="25%"
      center
      @close="destroyInterval"
    >
      <div class="dialog">
        <div class="dialog-title">扫码{{ $route.query.mode==='test'?'认证':'登录' }}</div>
        <vue-qr style="margin-top: 29px;width: 257px;height: 242px;" :text="codeUrl" :size="200" />
        <div class="dialog-tips">请使用微信扫码{{ $route.query.mode==='test'?'认证':'登录' }}</div>
      </div>
    </el-dialog>

    <!-- test -->

     <el-button v-if="isshow_button" class="closeDiaolog" @click="close_hiddon">
      取消登录
     </el-button>

    <!-- test结束 -->
    <el-dialog
      :visible.sync="loginVisible"
      width="600px"
      center
      @close="destroyInterval"
    >
      <div class="dialog">
<!--        <div class="dialog-title" style="font-size: 18px;font-family: Source Han Sans CN;">请用二代身份证读卡，或微信扫描二维码授权登录</div>-->
        <div class="dialog-title" style="font-size: 18px;font-family: Source Han Sans CN;">请用二代身份证读卡授权登录</div>
        <div class="login-type-box">
          <div class="login-type" @click="$router.push('/idCardGuide')">
            <img style="width: 150px;height: 150px;margin:10px" src="../../assets/images/idCard.png" alt="" />
            <div class="dialog-tips">刷二代身份证</div>
          </div>
<!--          <div class="login-type">-->
<!--            <vue-qr style="margin-top: 29px;width: 175px;height: 175px;" :text="codeUrl" :size="200" />-->
<!--            <div class="dialog-tips">请使用微信扫码</div>-->
<!--          </div>-->
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vueQr from 'vue-qr'
import utils from '@/utils/index'
export default {
  components: {
    vueQr
  },
  data() {
    return {
      isshow_button:false,
      loginDialogVisible: false,
      loginVisible: false,
      codeUrl: '',
      uuid: '',
      intervalID: null
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.login.userInfo
    },
    isZww() {
      return this.$utils.getItem('origin') && this.$utils.getItem('origin').includes('湖北政务网')
    }
  },
  // mounted() {},
  created() {
    if (this.$utils.getLocalItem('userInfo')) {
      // this.userInfo = getLocalItem('userInfo')
      this.$store.commit('login/SET_USER_INFO', this.$utils.getLocalItem('userInfo'))
    }
  },
  beforeDestroy() {
    this.destroyInterval()
  },
  methods: {
    handleGo() {
      if (this.isZww) {
        return
      }
      if (this.$route.query.mode === 'test' && this.$utils.getLocalItem('tId') === '2021II-ZW-JZGXQ') {
        this.$router.replace('/quickHome?mode=test&tId=2021II-ZW-JZGXQ')
        return
      }
      if (this.$route.path !== '/') {
        this.$router.replace('/')
      }
    },
    login() {
      // 预留开发环境登录入口
      if (this.$route.query.mode === 'test' || this.isZww) {
        this.$utils.setLocalItem('mode', 'test')
        this.loginDialogVisible = true
        this.$api.getUUID().then((res) => {
          if (res.resultCode === '1') {
            this.uuid = res.data.uuid // 获取uuid
            // const codeUrl = `https://scjg.hubei.gov.cn${this.$utils.getPrefix()}/getAuthorize?uuid=${this.uuid}`
            const codeUrl = `https://rong.wetruetech.cn${this.$utils.getPrefix()}/ecGovBizHubei/#/?type=4&uuid=${this.uuid}`
            this.codeUrl = codeUrl

            this.intervalID = setInterval(this.getRusult, 5 * 1000)
            return
          }
        })
      } else {
        this.loginVisible = true
        this.$api.getUUID().then((res) => {
          if (res.resultCode === '1') {
            this.uuid = res.data.uuid // 获取uuid
            // const codeUrl = `https://scjg.hubei.gov.cn${this.$utils.getPrefix()}/getAuthorize?uuid=${this.uuid}`
            // const codeUrl = `https://rong.wetruetech.cn${this.$utils.getPrefix()}/ecGovBizHubei/#/?type=4&uuid=${this.uuid}`//这里修改了
            const codeUrl = `https://scjg.hubei.gov.cn/zhkb/ecGovBizHubei/#/?type=4&uuid=${this.uuid}`
            this.codeUrl = codeUrl
            this.intervalID = setInterval(this.getRusult, 5 * 1000)
            return
          }
        })
      }
    },
    // 获取登录结果
    getRusult() {
      console.log('this.loading', this.loading)
      this.$api.getScanCodeStatus(this.uuid).then((res) => {
        // 已扫码
        if (res.resultCode === '1' && +res.data.status === 1) {
          // utils.hideLoading()
          utils.showLoading({ text: '扫码成功...' })
          this.isshow_button =true
          // this.buttonDialogVisible = true
          return
        }
        if (res.resultCode === '1' && +res.data.status === 2) {
          this.$utils.setLocalItem('token', res.data.token)
          this.$utils.setLocalItem('expiryDate', new Date().getTime() + 1000 * 60 * 60 * 24)
          utils.hideLoading()
          utils.showSuccess('登录成功！')
          this.loginDialogVisible = false
          this.loginVisible = false
          this.isshow_button =false
          this.destroyInterval()
          this.getUserInfo(res.data.token)
        }
        // if (res.resultCode === '1' && +res.data.status === 3) {
        //   utils.hideLoading()
        //   this.loginDialogVisible = false
        //   this.loginVisible = false
        //   utils.showSuccess('取消登录，请重新登录')
        //   this.destroyInterval()
        // }
        if (+res.resultCode === 10001) {
          utils.showError('二维码已过期请重新生成新的二维码')
          this.destroyInterval()
        }
      })
    },
    getUserInfo (token) {
      utils.showLoading({ text: '正在获取用户信息...' })
      this.$api.getUserInfo().then((res) => {
        utils.hideLoading()
        if (res.resultCode === '1') {
          const userInfo = {
            'name': res.data.name || '暂无',
            'idNumber': res.data.idNumber
          }
          // 获取用户信息成功以后存储到storage和vueX中
          this.$utils.setLocalItem('userInfo', userInfo)
          this.$store.commit('login/SET_USER_INFO', userInfo)
          return
        }
        var errMsg = '发生错误，请联系管理员！'
        utils.showError(res.resultMsg || errMsg)
      })
    },
    // 退出登录
    signOut () {
      this.$utils.removeLocalItem('token')
      this.$utils.removeLocalItem('userInfo')
      this.$store.commit('login/SET_USER_INFO', null)
      this.$utils.showSuccess('退出登录成功')
      const origin = this.$utils.getItem('origin')
      sessionStorage.clear()
      // 保留来源
      this.$utils.setItem('origin', origin)
      // 退出登录清除已有bizCode
      this.$utils.removeLocalItem('bizCode')
      this.handleGo()
    },
    // 销毁定时器
    destroyInterval () {
      clearInterval(this.intervalID)
      this.intervalID = null
      // clearTimeout(this.timeoutID)
      // this.timeoutID = null
    },
    close_hiddon(){
      this.destroyInterval()
      utils.hideLoading()
      this.isshow_button =false
      history.go(0)
    }
  }
}
</script>
<style lang='scss' scoped>
.page-header {
  width: 100%;
  height: 116px;
  background: url('../../assets/images/header_top_bg.png');
  background-size: 1920px 150px;
  background-position: center;
  ::v-deep .el-dialog__body{
    padding: 25px 25px 55px;
  }
  .header {
    display: flex;
    height: 100%;
    padding: 0 83px;
    .left {
      flex: 1;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      img {
        width: 83px;
        height: 83px;
        margin-right: 12px;
      }
      span {
        font-size: 36px;
        font-weight: 500;
        color: #FFFFFF;
      }
    }
    .right {
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
      top: 0;
      width: 1526px;
      height: 134px;
      z-index:-100;
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
    .login-type-box{

      .login-type{
        display: inline-block;
        padding:0 30px;
      }
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
.closeDiaolog{
  height: 80px;
  width: 140px;
  position: absolute;
  z-index: 999999!important;
  top:60%;
  left:50%;
  border-radius: 14px;
  font-size: 18px!important;
  transform: translateX(-50%);
  color: #567dea;
  border-color: #567dea;
}
</style>
