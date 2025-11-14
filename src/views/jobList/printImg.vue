<template>
  <div class="list-page">
    <page-header />
    <breadcrumb title="打印证照" />
    <div class="title">{{ $route.query.companyName }}</div>
    <!-- <div class="preview">
      <pdf
        :src="printPDF"
        type="application/pdf"
        style="overflow:hidden"
      />
    </div> -->
    <div style=" text-align: center;">
      <embed
        :src="printPDF+'#scrollbars=0&toolbar=0&statusbar=0'"
        type="application/pdf"
        style="overflow:hidden;width:70%;height:550px;"
      />
    </div>
    <div class="tips">
      <el-button
        type="primary"
        style="width: 80px; margin: 20px 0 30px;"
        @click="handlePrint"
      >打印</el-button>
      <!--startprint-->
      <!-- <img ref="printImg" class="printImg-img" :src="printPDF" /> -->
      <!--endprint-->
    </div>
    <el-dialog
      :visible.sync="showDialog"
      width="506px"
      close-on-click-modal
      close-on-press-escape
      :show-close="false"
    >
      <div class="dialog-wrap text-center">
        <img v-if="type" src="../../assets/images/success.png" alt="" />
        <my-loading v-else width="56" height="56" :src="loadingImg" />
        <div class="desc" :style="type ? 'padding-bottom: 20px;' : ''">
          {{ type ? "打印完成，请取走文件" : "正在打印中，请不要离开" }}
        </div>
        <div v-if="type && device != 'MD'" class="print-tips">
          如果<span>{{ second }}</span>S内未操作，系统将自动退出
        </div>
        <div v-if="type" class="btn-group" style="padding: 20px 0 56px;">
          <el-button type="primary" @click="handleGoHome">返回首页</el-button>
          <el-button @click="logOut">立即退出</el-button>
        </div>
      </div>
    </el-dialog>
    <div>
      <iframe id="fullScreenPDF" class="fullScreenPDF" :src="printPDF" frameborder="0" width="0" height="0"></iframe>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/index'
import PageHeader from '@/components/PageHeader/index'
import loadingImg from '@/assets/images/loading_blue.png'
import { getPrefix } from '@/utils/index'
import { printPaper } from '@/api/terminal'
export default {
  components: {
    Breadcrumb,
    PageHeader
  },
  data() {
    return {
      loadingImg,
      printImg: this.$route.query.url,
      showDialog: false,
      type: 0
    }
  },
  computed: {
    printPDF() {
      return location.origin + getPrefix() + '/open-platform/' + this.printImg
    }
  },
  created() {
    console.log(this.$route.query.url)
  },
  methods: {
    handlePrint() {
      // const bdhtml = window.document.body.innerHTML
      // window.document.body.innerHTML = `<img ref="printImg" class="printImg-img" src="${
      //   this.printPDF
      // }" />` // 把需要打印的指定内容赋给body.innerHTML
      // window.print() // 调用浏览器的打印功能打印指定区域
      // window.location.reload()
      // window.document.body.innerHTML = bdhtml // 重新给页面内容赋值；
      // return false
      this.$loading({ text: '正在打印，请稍后' })
      const data = {
        tranType: '3',
        filePath: this.printPDF
        // fileExtent:'pdf' ,
        // fileContent: ''
      }
      //       this.type = 0
      //       this.showDialog = true
      const device = this.$utils.getLocalItem('device')
      if (device === 'MD') {
        setTimeout(() => {
          document.getElementById('fullScreenPDF').contentWindow.print()
          this.$loading().close()
        }, 500)
        console.log('device')
        setTimeout(() => {
          this.showDialog = true
          this.type = 0
        }, 2000)
        setTimeout(() => {
          this.type = 1
          this.$loading().close()
        }, 8000)
      } else {
        printPaper(data).then(res => {
          this.$loading().close()
          if (+res.code === 10000) {
            // const userInfo = this.$utils.getLocalItem('userInfo')
            // const result = {
            //   companyName: printData.companyName,
            //   creditCode: printData.creditCode,
            //   name: userInfo.name,
            //   cerNo: userInfo.idNumber,
            //   image: userInfo.facePic,
            //   print_list: this.printList
            // }
            // uploadResult(result).then(() => {
            // this.type = 1
            // this.showDialog = true
            //   this.setTimer()
            // })
          } else {
            this.$utils.showError(res.msg)
          }
        })
        // .catch(res => {
        //   this.showDialog = false
        //   this.$utils.showError(res.msg)
        // })
      }
    },
    setTimer() {
      this.timer = setInterval(() => {
        if (this.second > 0) {
          this.second--
        } else {
          this.clearTimer()
          this.logOut()
        }
      }, 1000)
    },
    clearSignTimer() {
      clearInterval(this.signTimer)
    },
    clearTimer() {
      clearInterval(this.timer)
      this.second = 30
    },
    handleGoHome() {
      this.clearTimer()
      this.$router.replace('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.list-page {
  ::v-deep .el-dialog__header {
    padding: 0;
  }
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  .w-1000 {
    width: 1000px;
    margin: 0 auto;
  }
  .sign_dialog {
    .dialog_wrap {
      text-align: center;
      padding: 30px 0 30px 0;
      .ewm {
        width: 300px;
        margin-bottom: 15px;
      }
    }
  }

  .title {
    text-align: center;
    padding-top: 29px;
    padding-bottom: 19px;
    font-size: 28px;
    font-weight: 600;
    color: #333333;
    line-height: 40px;
  }
  .tips {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 14px;
    color: #7f7e7e;
    padding-top: 15px;
    .printImg-img {
      width: 800px;
      height: 650px;
      display: block;
    }
  }
}
.preview {
  width: 86px;
  height: 105px;
  margin: 15px 10px 5px 0;
  border-radius: 5px;
  border: 1px solid #dcdfe6;
  &:hover {
    cursor: pointer;
    border-color: #c0c4cc;
    // opacity: .8;
  }
  .pdf {
    width: 100%;
    height: 100%;
  }
}
</style>
