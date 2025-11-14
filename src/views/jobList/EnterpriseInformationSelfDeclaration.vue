<template>
  <div class="list-page">
    <!-- <breadcrumb /> -->
    <div class="title">{{ $route.meta.title }}</div>
    <div class="tips">
      <span>可通过统一社会信用代码或者企业名称查询下载</span>
    </div>
    <el-form ref="form" label-position="left" class="w-1000 form" :model="form" :rules="rules" label-width="94px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="企业名称" prop="companyName">
            <el-input v-model="form.companyName" placeholder="请输入要查询的企业名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="统一社会信用代码" prop="creditCode" label-width="184px">
            <el-input v-model="form.creditCode"  placeholder="企业的统一社会信用代码" maxlength="18" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属机构" prop="regorg">
            <el-select v-model="form.regorg" style="width:100%" placeholder="请选择所属机构">
              <el-option v-for="item in orgList" :key="item.code" :value="item.code" :label="item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="btn-group text-center" label-width="0">
        <!-- <el-button type="primary" @click="onSubmit">暂存草稿</el-button> -->
        <!-- <el-button @click="$router.push(`/selfDeclaration?tId=${$utils.getLocalItem('tId')}`)">上一步</el-button> -->
        <el-button @click="$router.go(-1)">上一步</el-button>
        <el-button @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="qrcodeDialog" width="598px" close-on-click-modal close-on-press-escape :show-close="false">
      <div class="dialog-qrcode text-center">
        <div class="dialog-title">请法定代表人/主要经营者，搜索“湖北市场监督融平台”微信小程序，或扫描下方二维码，找到授权委托申请，完成电子签名</div>
        <img src="../../assets/images/auth_qrcode.png" alt="" />
        <el-button class="auth-btn" @click="qrcodeDialog = false">完成授权</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogSign" width="500px" close-on-click-modal close-on-press-escape :show-close="true" class="sign_dialog">
      <div class="dialog_wrap">
        <img :src="qrcodeImg" alt="" class="ewm" />
        <div style="font-size: 16px;">请用电子营业执照小程序扫码认证,过程中请不要关掉弹窗</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/index'
import loadingImg from '@/assets/images/loading_blue.png'
import { getPrintPdfInfo ,getOrganization ,Personal_informationSearch,Personal_directorySearch,getArchivesInformation} from '@/api/index'
import PageHeader from '@/components/PageHeader/index'
import printImg from '@/assets/images/xkzImg1.png'
import request from '@/utils/request.js'
import crypt from '@/utils/EncryptionAndDecryption.js'
export default {
  components: {
    Breadcrumb,
    PageHeader
  },
  data() {
    const { validateField } = this.$utils
    return {
      orgList: [],
      printImg,
      search: false, // 是否已经查询
      showDialog: false, // 显示加载弹窗
      qrcodeDialog: false, // 显示二维码弹窗
      dialogSign: false, // 签名弹窗
      signTimer: null, // 签名定时器
      ident: '', // 轮询ident
      type: 1, // 弹窗类型，0：loading 1：成功
      loadingImg, // loading图片
      printData: null, // 打印数据
      conum: '1', // 营业执照数量，默认1
      second: 0,
      timer: null,
      form: {
        role: '',
        companyName: '', // 单位名称
        phone: '', // 领取人电话
        legalPerson: '', // 法人名称
        legalPersonCerNo: '', // 法人证件号
        agentName: '', // 代理人姓名
        agentCerNo: '', // 代理人身份证
        creditCode: '', // 企业的统一社会信用代码
        promise: false,
        regorg:''//所属机构
      },
      rules: {
        regorg: [
          { required: true, message: "请选择所属机构", trigger: "change" }
        ],
        companyName: [
          { required: true, message: '请填写单位名称', trigger: 'change' }
        ],
        creditCode: [
          { required: false, message: '请填写企业的统一社会信用代码', trigger: 'change' }
        ],
      },
      printList: [],
      printList1: [
        { companyName: '咸安区荀彧餐饮店', name: '食品经营许可证', num: 1, status: 0 },
        { companyName: '咸安区荀彧餐饮店', name: '食品经营许可证(副本)', num: 1, status: 0 }],
      imgUrl_is: '',
      imgUrl_vice: '',
      curArea: {},
      qrcodeImg: '',
      qrid: '',
      
    }
  },
  watch: {
    // dialogSign(val) {
    //   if (!val) {
    //     this.clearSignTimer()
    //   }
    // }
  },
  created() {
    this.clearTimer()
    this.getOrgan()
    // this.clearSignTimer()
  },
  mounted() {
    if (this.$utils.getLocalItem('curArea')) {
      this.curArea = this.$utils.getLocalItem('curArea')
    }
  },
  beforeDestroy() {
    this.clearTimer()
    // this.clearSignTimer()
  },
  methods: {
    getOrgan() {
      const data = {
        function: 'query_machine_data',
        arg:{
            '一体机码': this.$utils.getLocalItem('tId')
        }
      }
      getOrganization(data).then((res) => {
        this.$loading().close();
        if (res.state === 'successful') {
           this.orgList = res.outData.data.行政区划
          if(this.orgList.length !== 0) {
            this.form.regorg = this.orgList[0].code
          }
        } else {
          
        }
      })
    },
    hanldePrintImg(url) {
      this.$router.push({
        path: '/printImg',
        query: {
          url: url,
          companyName: this.form.companyName
        }
      })
    },
    // clearSignTimer() {
    //   clearInterval(this.signTimer)
    // },
    handleChangeType(val) {
      const userInfo = this.$utils.getLocalItem('userInfo')
      if (val === '法定代表人') {
        this.form.agentName = ''
        this.form.agentCerNo = ''
        this.form.legalPerson = userInfo.name
        this.form.legalPersonCerNo = userInfo.idNumber
      } else {
        this.form.legalPerson = ''
        this.form.legalPersonCerNo = ''
        this.form.agentName = userInfo.name
        this.form.agentCerNo = userInfo.idNumber
      }
    },
    handleSearch() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 法人，username必须是法人
          if(!this.form.companyName){
         return this.$utils.showError('请填写企业名称')
        }
      this.searchData()
        } else {
          this.$utils.showError('请按提示填写必填项')
        }
      })
    },
    searchData() {
      this.$loading({ text: '查询时间较长，请耐心等待' })
      
        let data = {
        "一体机码":localStorage.getItem("tId"),
        regorg:this.form.regorg,
        uniscid: this.form.creditCode,
        entname:this.form.companyName ///这里传的是公司名字
      }
      getArchivesInformation(data).then(res=>{
        this.$loading().close()
        console.log(res,'res');
        if(res.outData.data){
          this.$store.commit('archive/SET_ARCHIVE_INFO',res.outData.data)
          // this.$store.commit('pdfList/SET_PDf_INFO',res.outData)
        // console.log(res.outData,'res');
        this.$router.push({
              path: '/ArchiveDetail',
              })
        }else{
        this.$loading().close()
          return this.$utils.showError('查询失败，请重试')
        }
      })
      // let data = {
      //   "一体机码":localStorage.getItem("tId"),
      //   regorg:this.form.regorg,
      //   uniscid: this.form.creditCode,
      // }
      // Personal_directorySearch(data).then(res=>{
      //   this.$loading().close()
      //   if(res.outData.access_token&&res.outData.data){
      //     this.$store.commit('pdfList/SET_PDf_INFO',res.outData)
      //   console.log(res.outData,'res');
      //   this.$router.push({
      //         path: '/form/previewDocInfo',
      //         })
      //   }else{
      //   this.$loading().close()
      //     return this.$utils.showError('查询失败，请重试')
      //   }
      // })





      //这是之前的得到pdf的接口
      // let data = {
      //   "一体机码":localStorage.getItem("tId"),
      //   regorg:this.form.regorg,
      //   uniscid: this.form.creditCode,
      // }
      // Personal_informationSearch(data).then(res=>{
      //   if(res.outData.data){
      //     this.$router.push({
      //         path: '/form/previewDocInfo',
      //         query: { 
      //           Pdf:res.outData.data //这里是返回的地址
      //         }
      //       })
      //   }else{
      //     this.$utils.showError(res.outData.errMsg)
      //   }
      // })



    },
    setTimer() {
      this.timer = setInterval(() => {
        if (this.second < 300) {
          this.second++
          this.getLicenseResult()
        } else {
          this.clearTimer()
        }
      }, 1000)
    },
    clearTimer() {
      clearInterval(this.timer)
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
      .ewm{
        width: 300px;
        margin-bottom: 15px;
      }
    }
  }

  .title {
    text-align: center;
    padding-top: 29px;
    font-size: 28px;
    font-weight: 600;
    color: #333333;
    line-height: 40px;
    margin-top: 200px;//这里修改了
  }
  .tips {
    display: flex;
    height: 30px;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #7F7E7E;
    padding-top: 15px;
    img {
      width: 22px;
      height: 22px;
      margin-right: 4px;
    }
  }
  .form {
    padding-top: 36px;
    ::v-deep .el-select,.el-cascader {
      width: 100%;
      height: 43px;
      input {
        height: 43px;
      }
    }
    ::v-deep .el-input {
      height: 43px;
      input {
        height: 43px;
      }
    }
    ::v-deep .el-form-item__label {
      font-size: 16px;
      font-weight: 600;
    }
    .promise {
      width: 340px;
      margin: 0 auto;
    }
    .radio {
      height: 43px;
      .el-radio {
        min-width: 60px;
        height: 43px;
        padding: 0 20px;
        line-height: 43px;
        margin-right: 0;
        text-align: center;
        ::v-deep .el-radio__label {
          padding: 0;
        }
      }
      ::v-deep .el-radio__input {
        display: none;
      }
      ::v-deep .is-checked {
        background: #3162E8;
      }
      ::v-deep .el-radio__input.is-checked+.el-radio__label {
          color: #fff;
      }
    }
    .btn-group {
      padding-top: 30px;
      &.dialog-btn {
        padding-bottom: 20px;
      }
      .el-button {
        width: 100px;
        height: 48px;
        padding: 0;
        box-sizing: border-box;
        text-align: center;
        line-height: 48px;
        border: 1px solid #3162E8;
        color: #3162E8;
      }
    }
  }
  .dialog-wrap {
    padding-top: 76px;
    img {
      width: 86px;
      height: 86px;
    }
    .desc {
      font-size: 28px;
      font-weight: 600;
      color: #333333;
      padding-top: 59px;
      padding-bottom: 92px;
    }
    .print-tips {
      span {
        color: red;
      }

    }
  }
  .dialog-qrcode {
    padding: 45px;
    .dialog-title {
      font-size: 28px;
      font-weight: bold;
      color: #333333;
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
