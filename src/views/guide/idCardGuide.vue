<template>
  <div>
    <page-header />
    <div class="camera-guide">
      <div class="title">请将身份证放置在读卡器上</div>
      <img src="../../assets/images/idcard_guide.gif" alt="" />
      <div class="btn-group">
        <el-button type="primary" @click="goBack">取消</el-button>
      </div>
      <el-dialog :visible.sync="showDialog" width="598px" close-on-click-modal close-on-press-escape :show-close="false">
        <div class="dialog-qrcode text-center">
          <div class="dialog-title">页面即将会在<span style="color: red;">{{ second }}</span>秒后自动退出，也可以点立即击退出按钮退出重试</div>
          <el-button class="auth-btn" @click="goBack">立即退出</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import { loadIdCard, stopLoadIdCard, MD_GetCardinfo, MD_OpenDevice, MD_CloseDevice, ZW_initIdCard, ZW_Authenticate, ZW_getIdCardInfo } from '@/api/terminal'
import PageHeader from '@/components/PageHeader/index'
export default {
  name: '',
  components: { PageHeader },
  data() {
    return {
      second: 30,
      showDialog: false,
      timer: null
      // destroy: false // 页面是否已经销毁
    }
  },
  mounted() {
    this.clearTimer()
    setTimeout(() => {
      this.getId()
    }, 1000)
  },
  beforeDestroy() {
    if (!this.$utils.getLocalItem('device')) { // 无设备值则是浪潮机器
      stopLoadIdCard()
    }
  },
  methods: {
    clearTimer() {
      clearInterval(this.timer)
    },
    getId() {
        const device = this.$utils.getLocalItem('device')
      if (device === 'MD') { // 美鼎的身份证信息读取
        // 打开读卡器
        MD_OpenDevice().then(res => {
          if (!+res.retCode) {
            // 读取信息
            MD_GetCardinfo().then(res => {
              if (!+res.retcode) { // 读卡成功
                this.$utils.setItem('userInfo', res)
                this.$router.push('/face')
              } else {
                this.$confirm('请确认身份证已放至读卡区', '温馨提示', {
                  confirmButtonText: '已放好',
                  showCancelButton: false,
                  closeOnPressEscape: false,
                  closeOnClickModal: false
                }).then(() => {
                  // 如果没读到信息，则关闭读卡器再执行读卡操作
                  MD_CloseDevice().then(res => {
                    if (!+res.retcode) { // 关闭读卡器成功，再次执行读卡操作
                      this.getId()
                    }
                  })
                })
              }
            })
          } else {
            this.$utils.showError('打开读卡设备失败，请退出重试！')
          }
        }).catch(() => {
          this.$utils.showError('打开读卡设备失败，请退出重试！')
        })
      } else if (device === 'ZW' || device === 'HDY') {
        // 读卡初始
        ZW_initIdCard().then(res => {
          if (res.flag === 500) {
            this.$utils.showError(res.message)
            this.$confirm('请确认身份证已放至读卡区', '温馨提示', {
              confirmButtonText: '已放好',
              showCancelButton: false,
              closeOnPressEscape: false,
              closeOnClickModal: false
            }).then(() => {
              // 如果没读到信息，则关闭读卡器再执行读卡操作
              this.getId()
            })
            return
          }
          // 读卡认证
          ZW_Authenticate().then(res => {
            if (res.flag === 500) {
              this.$utils.showError(res.message)
              this.$confirm('请确认身份证已放至读卡区', '温馨提示', {
                confirmButtonText: '已放好',
                showCancelButton: false,
                closeOnPressEscape: false,
                closeOnClickModal: false
              }).then(() => {
                // 如果没读到信息，则关闭读卡器再执行读卡操作
                this.getId()
              })
              return
            }
            ZW_getIdCardInfo().then(res => {
              if (res.flag === 500) {
                this.$utils.showError(res.message)
                this.$confirm('请确认身份证已放至读卡区', '温馨提示', {
                  confirmButtonText: '已放好',
                  showCancelButton: false,
                  closeOnPressEscape: false,
                  closeOnClickModal: false
                }).then(() => {
                  // 如果没读到信息，则关闭读卡器再执行读卡操作
                  this.getId()
                })
                return
              }
              this.$utils.setItem('userInfo', res.data)
              this.$router.push('/face')
            })
          })
        })
      }
      else if (device === 'ZW1' ) {
        // 读卡初始
        ZW_initIdCard().then(res => {
          debugger
          if (res.resultFlag)  {
            this.$utils.showError(res.message)
            this.$confirm('请确认身份证已放至读卡区', '温馨提示', {
              confirmButtonText: '已放好',
              showCancelButton: false,
              closeOnPressEscape: false,
              closeOnClickModal: false
            }).then(() => {
              // 如果没读到信息，则关闭读卡器再执行读卡操作
              this.getId()
            })
            return
          }
          // 读卡认证
          ZW_Authenticate().then(res => {
            // if (res.flag === 500) {
            //   this.$utils.showError(res.message)
            //   this.$confirm('请确认身份证已放至读卡区', '温馨提示', {
            //     confirmButtonText: '已放好',
            //     showCancelButton: false,
            //     closeOnPressEscape: false,
            //     closeOnClickModal: false
            //   }).then(() => {
            //     // 如果没读到信息，则关闭读卡器再执行读卡操作
            //     this.getId()
            //   })
            //   return
            // }
            ZW_getIdCardInfo().then(res => {
              debugger
              // if (res.flag === 500) {
              //   this.$utils.showError(res.message)
              //   this.$confirm('请确认身份证已放至读卡区', '温馨提示', {
              //     confirmButtonText: '已放好',
              //     showCancelButton: false,
              //     closeOnPressEscape: false,
              //     closeOnClickModal: false
              //   }).then(() => {
              //     // 如果没读到信息，则关闭读卡器再执行读卡操作
              //     this.getId()
              //   })
              //   return
              //

              this.$utils.setItem('userInfoOld', res.data)
              this.$utils.setItem('userInfo', res.resultContent)
              this.$router.push('/face')
            })
          })
        })
      }
      else {
        loadIdCard().then(res => {
          if (res.success) {
            stopLoadIdCard().then(() => {
              this.$utils.setItem('userInfo', res.obj)
              this.$router.push('/face')
            })
          } else {
            this.showError()
          }
        }).catch(() => {
          this.showError()
        })
      }
    },
    showError() {
      this.showDialog = true
      this.$utils.showError('身份证识别失败，请退出页面重新进入重试！')
      this.timer = setInterval(() => {
        this.second--
        if (this.second === 0) {
          this.goBack()
        }
      }, 1000)
      stopLoadIdCard()
    },
    goBack() {
      this.clearTimer()
      this.$router.replace('/')
    }
  }
}
</script>

<style scoped lang="scss">
.camera-guide {
  width: 868px;
  margin: 0 auto;
  ::v-deep .el-dialog__header {
    padding: 0;
  }
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  .title {
    font-size: 28px;
    font-weight: 600;
    color: #333333;
    padding-top: 50px;
    padding-bottom: 40px;
    text-align: center;
  }
  img {
    width: 868px;
    height: 563px;
  }
  .btn-group {
    padding-top: 60px;
    padding-bottom: 20px;
    text-align: center;
    .el-button {
      width: 155px;
      height: 48px;
      padding: 0;
      box-sizing: border-box;
      text-align: center;
      line-height: 48px;
      border: 1px solid #3162E8;
      color: #fff;
    }
  }
  .dialog-qrcode {
    padding: 45px;
    .dialog-title {
      width: 350px;
      margin: 0 auto;
      font-size: 20px;
      font-weight: bold;
      color: #333333;
      line-height: 40px;
      padding-bottom: 35px;
    }
    img {
      display: block;
      width: 326px;
      height: 325px;
      margin: 0 auto;
    }
    .auth-btn {
      width: 155px;
      height: 48px;
      margin: 35px auto 0;
      color:#3162E8;
      border: 1px solid #3162E8;
    }
  }
}
</style>
