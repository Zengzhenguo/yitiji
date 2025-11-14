<template>
  <div class="preview-pdf">
    <breadcrumb v-show="$route.query.mode !== 'test'" />
    <div class="w-1200 box">
      <div class="title">{{ $route.meta.title }}</div>
      <div class="pdf">
        <embed
          :src="$utils.getFile(path)+'#scrollbars=0&toolbar=0&statusbar=0'"
          type="application/pdf"
          style="overflow:hidden"
        />
      </div>
      <div class="btn-group text-center">
        <!-- <el-button type="primary" @click="onSubmit">暂存草稿</el-button> -->
        <el-button @click="$router.go(-1)">上一步</el-button>
        <el-button type="primary" @click="handleNextBefore">发起签名任务</el-button>
      </div>
    </div>
    <el-dialog
      class="success-dialog"
      :visible.sync="dialogVisible"
      width="506px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="top text-center">
        <img src="../../assets/images/success.png" />
        <p>提交成功</p>
        <p class="success-tips">如果<span>{{ second }}</span>S内未操作，系统将自动退出</p>
      </div>
      <div class="dialog-btn text-center">
        <!-- <el-button type="primary" @click="onSubmit">暂存草稿</el-button> -->
        <el-button class="plain" @click="handleGo('/')">返回首页</el-button>
        <el-button class="plain" @click="handleGo('/form/list')">查看办件</el-button>
        <el-button class="plain" @click="handleSign">立即签名</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogSign"
      width="500px"
      close-on-click-modal
      close-on-press-escape
      :show-close="true"
      class="sign_dialog"
    >
      <div class="dialog_wrap">
        <img src="@/assets/images/signBoxCode.png" alt="" class="ewm" />
        <div style="font-size: 16px;">请用微信扫码签名</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/index'
import { submit } from '@/api/index'
import { ZW_delAllFile } from '@/api/terminal'
import crypt from '@/utils/EncryptionAndDecryption.js'
// import { formatCompanyType } from '@/filters'
export default {
  components: { Breadcrumb },
  data() {
    return {
      ip:null,
      industryid:'',
      dialogVisible: false,
      dialogSign: false,
      path: '',
      second: 30,
      timer: null
    }
  },
  computed: {
    inidInfo(){
      return this.$store.state.indid.industryid
    },
    draftInfo() {
      return this.$store.state.draft.draftInfo
    }
  },
  watch: {
    dialogSign(val) {
      console.log(val)
      if (!val) { // 关闭弹窗，倒计时开始
        this.setTimer()
      } else {
        clearInterval(this.timer)
      }
    }
  },
  beforeRouteEnter(to, from, next) {
          if(from.path==='/'&&to.path==="/form/preview"){
            window.sessionStorage.setItem("flushStatus",'1')
          }     
    next()
},
  activated() {
    this.getIpAddress()
    clearInterval(this.timer)
    this.path = this.$route.query.path
    // 防止刷新，获取草稿详情
    if (this.$utils.getItem('draftNumber')) {
      this.$store.dispatch('draft/getDraftDetail', this.$utils.getItem('draftNumber'))
    }
        if(sessionStorage.getItem("commitStatus")==="1"&&sessionStorage.getItem("flushStatus")==="1"){
          this.dialogVisible = true
        }
  },
  methods: {
    getIpAddress(){
      fetch('https://api.ipify.org')
        .then(response => response.text())
        .then(ip => {
          console.log('公网 IP:', ip)
          if(ip!=undefined){
            this.ip = ip
          }
        })
        .catch(error => console.error('无法获取 IP：', error));
    },
    setTimer() {
      this.timer = setInterval(() => {
        if (this.second > 0) {
          this.second--
        } else {
          clearInterval(this.timer)
          this.logOut()
        }
      }, 1000)
    },
    logOut() {
      // 退出登录
      this.$router.replace('/')
      this.$utils.removeLocalItem('token')
      this.$utils.removeLocalItem('userInfo')
      this.$utils.removeLocalItem('expiryDate')
    },
    handleGo(path) {
      clearInterval(this.timer)
      this.second = 30
      this.dialogVisible = false
      this.$router.replace(path)
    },
    handleSign() {
      this.dialogSign = true
      clearInterval(this.timer)
      this.second = 30
    },
    // 发起签名之前
    handleNextBefore() {
        window.sessionStorage.setItem("commitStatus",'1')
      if (this.$route.query.type === 'commercial' || this.$route.query.type === 'commercialRegister' || this.$route.query.type === '9210commercial') {
        console.log(this.draftInfo)
        const nextPageBox = this.draftInfo.businessShow // 已选择的业务
        const engravedSeal = this.draftInfo.engravedSeal // 刻章
        const socialSecurityRegistration = this.draftInfo.socialSecurityRegistration // 社保
        const medicalInsuranceRegistration = this.draftInfo.medicalInsuranceRegistration//医保
        const taxInvoice = this.draftInfo.taxInvoice // 税务
        const bankOpenAccount = this.draftInfo.bankOpenAccount // 银行
        const nameApply = this.draftInfo.nameApply
        const address = this.draftInfo.address
        const personList = this.draftInfo.member.memberList
        const waterLectricityEtwork = this.draftInfo.waterLectricityEtwork // 水气网
        const providentFund = this.draftInfo.providentFund // 公积金
        const electricity = this.draftInfo.electricity // 电力
        const water = this.draftInfo.water // 水务
        const naturalGas = this.draftInfo.naturalGas // 天然气
        waterLectricityEtwork.isInternetRegist = waterLectricityEtwork.isInternetRegist ? 1 : 0
        waterLectricityEtwork.isNaturalGasRegist = waterLectricityEtwork.isNaturalGasRegist ? 1 : 0
        waterLectricityEtwork.isWaterRegist = waterLectricityEtwork.isWaterRegist ? 1 : 0
        let legalName, legalIdcNum, managerName, managerPhone
        personList.forEach(item => {
          item.jobs.forEach(children => {
            if (children.name === '经办人/委托代理人') {
              managerName = item.idcName
              managerPhone = item.phone
              return
            }
            if (children.name === '法定代表人') {
              legalName = item.idcName
              legalIdcNum = item.idcNumber
              return
            }
          })
        })

        const lltData = {
          // channelSource: 'pc端', // 移动端传 PC端不传
          channelToken: this.$utils.getLocalItem('token'),
          companyName: nameApply.companyName,
          companyType: nameApply.companyType,
          address: address.address,
          legalName: legalName,
          legalIdcNum: legalIdcNum,
          managerName: managerName,
          managerPhone: managerPhone,
          isProvidentFund: nextPageBox.gjjchecked ? '1' : '0', // 是否勾选公积金
          taxName: taxInvoice ? taxInvoice.ticketBuyerInformation[0].idcName : '',
          taxIdcType: taxInvoice ? taxInvoice.ticketBuyerInformation[0].idcType : '',
          taxIdcNum: taxInvoice ? taxInvoice.ticketBuyerInformation[0].idcNumber : '',
          taxPhone: taxInvoice ? taxInvoice.ticketBuyerInformation[0].phone : '',
          addressArea: address.addressArea,
          engravedSeal: engravedSeal || {},
          socialSecurityRegistration: socialSecurityRegistration || {},
          medicalInsuranceRegistration:medicalInsuranceRegistration||{},
          taxInvoice: taxInvoice || {},
          bankOpenAccount: bankOpenAccount || {},
          waterLectricityEtwork: waterLectricityEtwork || {},
          providentFund: providentFund || {},
          electricity: electricity || {},
          water: water || {},
          naturalGas: naturalGas || {}
        }
        // console.log(lltData)
        // setCommercialData({ lltData: lltData }).then(res => {
        //   if (+res.errCode === 500 || res.state === 'faulted') {
        //     return this.$utils.showError(res.errMsg)
        //   }
        if (this.$route.query.type === '9210commercial') {
          if (waterLectricityEtwork.isWaterRegist) {
            lltData.water = {
              isWaterRegist: 1,
              outlets: waterLectricityEtwork.waterRegistAddress
            }
          }
          if (waterLectricityEtwork.isNaturalGasRegist) {
            lltData.naturalGas = {
              isNaturalGasRegist: 1,
              outlets: waterLectricityEtwork.naturalGasRegistAddress
            }
          }
        }

        this.handleNext(lltData)
        // })
        return
      }
      this.handleNext()
    },
    handleNext(lltData) {
      const nameApply = this.draftInfo.nameApply // 名称申报
      const address = this.draftInfo.address
      // const scope = this.draftInfo.scope || this.$utils.getItem('scope')
      const scope = this.$utils.getItem('scope')
      console.log(scope,'scope123');
      const member = this.draftInfo.member // 人员信息+设立人员信息
      const otherInfo = this.draftInfo.otherInfo || this.$utils.getItem('otherInfo') // 其他信息
      // const industryid = this.$utils.getLocalItem("industryid");
      // const industryid = this.$utils.getLocalItem("industryid")
      const industryid = localStorage.getItem("industryid")
      if(industryid===null){
          this.$utils.showError('industryid字段为空,请重新提交')
          return
        }
      // console.log(this.$store.state.indid.industryid,'wdaaaaaa撒的撒打算a');
      // console.log(this.inidInfo);

      if (nameApply.hasRepeatWayFlag) {
        nameApply.orgWay = ''
      }

      const data = {
        lltData,
        ...nameApply,
        ...address, // 地址申报
        scope, // 经营范围
        ...member, // 人员信息
        ...otherInfo, // 其他信息
        endTime: otherInfo.validDates === '长期' ? '' : otherInfo.endTime,
        // companyType: formatCompanyType(nameApply.companyType),
        device: this.$utils.getLocalItem('device') ? this.$utils.getLocalItem('device') : '',
        oneMachineNum: this.$utils.getLocalItem('tId'), // 一体机编号
        industryType: { // 所选行业类型
          IndustryCode: nameApply.industryFormulated.split('-')[0], // 行业类型对应唯一标识
          IndustryName: nameApply.industryFormulated.split('-')[2], // 行业类型名称
          IndustryId:industryid//行业表述id
        },
        industryFormulated: nameApply.industryFormulated.split('-')[1], // 行业描述
        area: nameApply.area.join(' '),
        
        channel: this.$utils.getLocalItem('mode') === 'test' ? 'PC' : '一体机',
        channelSource: '湖北市场监督融平台',
        channelToken: this.$utils.getLocalItem('token')
      }
      if(data.useWay==="租赁"){
          let dataTime = JSON.parse(localStorage.getItem('dataTime'))
          if(!dataTime){
            return this.$utils.showError('服务异常，请联系管理员error')
          }
          data.leaseEndTime =  dataTime[1]
          data.leaseStartTime =  dataTime[0]
        }
      data.country_info =JSON.parse(localStorage.getItem('country_info')) 
        if(data.country_info===null){
          this.$utils.showError('country_info字段为空,请重新提交')
          return
        }
      if (this.$route.query.type === 'person' && !nameApply.companyName) { // 无字号注册个体户
        member.memberList.forEach(item => {
          item.jobs.forEach(val => {
            if (val.name === '主要经营者') {
              data.companyName = item.idcName
            }
          })
        })
      }
      if (this.$route.query.whatfrom === 'jointOffice') {
        const equipment = this.draftInfo.equipment // 设备设施
        const personnel = this.draftInfo.personnel // 安全管理人员和从业人员
        const uploadMaterial = this.draftInfo.uploadMaterial // 材料上传
        const business = this.draftInfo.business // 经营情况
        // 过滤已选中的
        const mainForm = business.mainForm
        const projectForm = business.projectForm.filter(item => item.isSel)
        mainForm.forEach(item => {
          item.childs = item.childs.filter(item => item.isSel)
        })
        projectForm.forEach(item => {
          item.childs = item.childs.filter(item => item.isSel)
        })
        const params = {
          economicNature: business.economicNature,
          yslbData: {
            ...personnel,
            ...equipment,
            ...uploadMaterial,
            economicNature: business.economicNature,
            mainForm,
            projectForm
          }
        }
        Object.assign(data, params)
      }
      console.log('发起任务一事联办：', data)
      this.$loading({ text: '提交申请中' })
      // 传输前对data进行加密
      // const keyPair = crypt.createKeypair()
      // const cert = crypt.createCert(keyPair.pri, keyPair.pub)
      // const encCertB64 = crypt.forge.pki.certificateToPem(cert)
      var beforeEncryptData = JSON.stringify(data)
      const envelopeData = crypt.envelopeEncrypt(beforeEncryptData)
      let selectedArea = this.$utils.getItem('selectedArea')
      submit({ envelope: envelopeData, selectedArea ,ip:this.ip}).then(async res => {
        console.log("进入submit接口");
        console.log('ip:',this.ip);
        if (+res.errCode === 500 || res.state === 'faulted') {
          this.$loading().close()
          return this.$utils.showError('提交失败，请重试！')
        }
        // 至唯机器清空本地文件
        if (this.$utils.getLocalItem('device') === 'ZW') {
          ZW_delAllFile().then(res => {})
        }
        await this.$store.dispatch('draft/deleteDraft', this.$utils.getItem('draftNumber')) // 清空该草稿箱
        if (this.$route.query.mode === 'test') {
          this.handleSign()
          return
        }
        this.dialogVisible = true
        // 提交成功
        this.$loading().close()
        sessionStorage.clear()
        // 提交成功，倒计时开始
        this.setTimer()
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.preview-pdf {
  .box {
    .title {
      text-align: center;
      padding-top: 29px;
      font-size: 28px;
      font-weight: 600;
      color: #333333;
      line-height: 40px;
    }
    .pdf {
      padding-top: 30px;
      height: 530px;
      embed {
        width: 100%;
        height: 500px;
      }
    }
    .btn-group {
      padding-top: 60px;
      padding-bottom: 60px;
      .el-button {
        width: 155px;
        height: 48px;
        padding: 0;
        box-sizing: border-box;
        text-align: center;
        line-height: 48px;
        border: 1px solid #3162E8;
        color: #3162E8;
        &:last-child {
          width: 232px;
          color: #fff;
        }
      }
    }
  }
  .success-dialog {
    ::v-deep .el-dialog__header {
      padding: 0;
    }
    .top {
      img {
        width: 86px;
        height: 86px;
        margin-top: 18px;
      }
      p {
        font-size: 28px;
        font-weight: 600;
        color: #333333;
        padding-top: 16px;
        padding-bottom: 30px;
        &.success-tips {
          font-size: 14px;
          font-weight: normal;
          span {
            color: red;
          }
        }
      }
    }
    .dialog-btn {
      padding-bottom: 25px;
      .plain {
        color: #3162E8;
        border-color: #3162E8;
      }
    }
  }
  .sign_dialog {
    .dialog_wrap{
      text-align: center;
      padding-bottom: 30px;
    }
    .ewm {
      width: 300px;
      margin-bottom: 15px;
    }
  }
}
</style>
