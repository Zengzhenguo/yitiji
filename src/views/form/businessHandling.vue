<template>
  <div class="address-form">
    <!-- <page-header /> -->
    <breadcrumb v-show="$route.query.mode !== 'test'" />
    <div class="box">
      <div class="title">{{ "请选择所需办理业务" }}</div>
      <el-form
        ref="form"
        label-position="left"
        class="form"
        :model="form"
        :rules="rules"
        label-width="94px"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="登记注册" label-width="274px">
              <el-checkbox disabled checked label="名称申报" border />
              <el-checkbox disabled checked label="设立登记" border />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item v-if="type==='commercial' || type==='commercialRegister'" label="商事确认一链通" label-width="274px">
              <el-checkbox v-model="form.gzchecked" label="公章刻制" border />
              <el-checkbox v-model="form.sbchecked" label="社保登记" border />
              <el-checkbox v-model="form.swchecked" label="税务登记" border />
              <el-checkbox v-model="form.yhchecked" label="银行开户" border />
              <el-checkbox v-model="form.gjjchecked" label="公积金" border />
              
              <template v-if="this.$utils.getLocalItem('tId') === '2021II-500040013'||this.$utils.getLocalItem('tId') === '2021II-ZW-SYZX'">
              <el-checkbox v-model="form.ylchecked" label="医保登记" border />
              </template>
              
              <template v-if="this.$utils.getLocalItem('tId') === '2020II-ZW-SYDJK'">
                <el-checkbox v-model="form.ylchecked" label="医保登记" border />
                <el-checkbox v-model="form.waterchecked" label="水务登记 " border />
                <el-checkbox v-model="form.dlchecked" label="电力登记 " border />
                <el-checkbox v-model="form.rqchecked" label="燃气登记 " border />
                <el-checkbox v-model="waterLectricityEtwork.isInternetRegist" label="网络登记" border />
              </template>
              <template v-if="this.$utils.getLocalItem('tId') === '2020II-500120573'||this.$utils.getLocalItem('tId') === '2020II-500000003'">
                <el-checkbox v-model="form.waterchecked" label="水务登记 " border />
                <el-checkbox v-model="form.dlchecked" label="电力登记 " border />
                <el-checkbox v-model="form.rqchecked" label="燃气登记 " border />
                <el-checkbox v-model="waterLectricityEtwork.isInternetRegist" label="网络登记" border />
                
              </template>
              <template v-if="this.$utils.getLocalItem('curArea').district === '十堰经济开发区' && !isHBZWW">
                <el-checkbox v-model="form.waterchecked" label="水务登记 " border />
                <el-checkbox v-model="form.dlchecked" label="电力登记 " border />
                <el-checkbox v-model="form.rqchecked" label="燃气登记 " border />
              </template>
              <div v-if="this.$utils.getLocalItem('curArea').city === '十堰市'" style="color:#b25568;">（以上环节可并联办理，承诺办结时限:0.1个工作日）</div>
            </el-form-item>
            <el-form-item v-if="type==='9210commercial'" label="9210一键办" label-width="274px">
              <el-checkbox v-model="form.gzchecked" label="公章刻制" border />
              <el-checkbox v-model="form.sbchecked" label="社保登记" border />
              <el-checkbox v-model="form.swchecked" label="税务登记" border />
              <el-checkbox v-model="form.yhchecked" label="银行开户" border />
              <el-checkbox v-model="form.gjjchecked" label="公积金" border />
            </el-form-item>
            <el-form-item v-if="type==='9210commercial'" label="" label-width="274px">
              <el-checkbox v-model="waterLectricityEtwork.isWaterRegist" label="水务登记" border />
              <el-checkbox v-model="form.dlchecked" label="电力登记" border />
              <el-checkbox v-model="waterLectricityEtwork.isNaturalGasRegist" label="燃气登记" border />
              <el-checkbox v-model="waterLectricityEtwork.isInternetRegist" label="网络登记" border />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="btn-group text-center" label-width="0">
          <!-- <el-button @click="handleSaveDraft(true)">暂存草稿</el-button> -->
          <el-button @click="$router.go(-1)">上一步</el-button>
          <el-button type="primary" @click="handleNext">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import PageHeader from '@/components/PageHeader/index'
import Breadcrumb from '@/components/Breadcrumb/index'
import { preview } from '@/api/index'
export default {
  components: {
    // PageHeader,
    Breadcrumb
  },
  data() {
    return {
      checked: true,
      type: null,
      baseInfo: null,
      curArea: null,
      form: {
        gzchecked: false,
        swchecked: false,
        sbchecked: false,
        yhchecked: false,
        gjjchecked: false,
        sdqwchecked: false,
        waterchecked: false,
        dlchecked: false,
        rqchecked: false,
        ylchecked:false
      },
      waterLectricityEtwork: {
        // isMedicalService:false,
        // MedicalService:'',
        isWaterRegist: false,
        waterRegistAddress: '',
        isNaturalGasRegist: false,
        naturalGasRegistAddress: '',
        isInternetRegist: false,
        internetRegistAddress: ''
      },
      rules: {}
    }
  },
  computed: {
    draftInfo() {
      return this.$store.state.draft.draftInfo
    },
    // 是否是湖北政务网一链通进入
    isHBZWW() {
      return this.$utils.getItem('origin') === '湖北政务网一链通'
    }
  },
  activated() {
    this.type = this.$route.query.type
    // 获取草稿详情
    if (this.$utils.getItem('draftNumber')) {
      this.$store
        .dispatch('draft/getDraftDetail', this.$utils.getItem('draftNumber'))
        .then(async res => {
          if (res.businessShow) {
            this.form = res.businessShow
          }
          if (res.waterLectricityEtwork) {
            this.waterLectricityEtwork = res.waterLectricityEtwork
          }
        })
    }
  },
  methods: {
    clearValidate() {
      this.$refs['form'].clearValidate()
    },
    // 保存草稿
    handleSaveDraft(showTips = false) {
      return new Promise((resolve, reject) => {
        const data = {
          ...this.draftInfo, // 原有数据
          businessType: '2',
          businessShow: this.form, // 现在数据覆盖原有数据
          waterLectricityEtwork: this.waterLectricityEtwork,
          showTips // 是否显示提示
        }
        this.$store
          .dispatch('draft/saveDraft', data)
          .then(() => {
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    async handleNext() {
      // 06-17 硚口区商事主体登记功能调整 -》 调整为非必选
      if (this.$utils.getLocalItem('curArea').district !== '硚口区') {
        if (!this.form.gzchecked && !this.form.swchecked && !this.form.sbchecked && !this.form.yhchecked && !this.form.gjjchecked && !this.form.dlchecked && !this.form.waterchecked && !this.form.rqchecked && !this.waterLectricityEtwork.isInternetRegist && !this.form.ylchecked && (this.type === 'commercial' || this.type === 'commercialRegister')) {
          this.$utils.showError('至少选择一项业务')
          return
        }
      }
      if (this.waterLectricityEtwork.isWaterRegist ||
      this.waterLectricityEtwork.isNaturalGasRegist ||
      this.waterLectricityEtwork.isInternetRegist) {
        this.form.sdqwchecked = true
      } else {
        this.form.sdqwchecked = false
      }
      if ((this.type === '9210commercial') && !this.form.gzchecked && !this.form.swchecked && !this.form.sbchecked && !this.form.yhchecked && !this.form.gjjchecked && !this.form.dlchecked && !this.form.sdqwchecked&& !this.form.ylchecked) {
        this.$utils.showError('至少选择一项业务')
        return
      }
      await this.handleSaveDraft()
      this.$utils.setItem('businessShow', this.form)
      this.$utils.setItem('waterLectricityEtwork', this.waterLectricityEtwork)

      // 06-17 硚口区商事主体登记功能调整
      if (this.$utils.getLocalItem('curArea').district === '硚口区') {
        const nextPageBox = this.draftInfo.businessShow || this.form
        if (nextPageBox.gzchecked) {
          this.$router.push({ path: '/form/seal', query: { ...this.$route.query }})
          return
        }
        if (nextPageBox.sbchecked) {
          this.$router.push({ path: '/form/socialSecurity', query: { ...this.$route.query }})
          return
        }
        if (nextPageBox.swchecked) {
          this.$router.push({ path: '/form/taxAdministration', query: { ...this.$route.query }})
          return
        }
        if (nextPageBox.yhchecked) {
          this.$router.push({ path: '/form/bankAccount', query: { ...this.$route.query }})
          return
        }
        if (nextPageBox.gjjchecked) {
          this.$router.push({ path: '/form/accumulationFund', query: { ...this.$route.query }})
          return
        }
        if (nextPageBox.ylchecked) {
          this.$router.push({ path: '/form/medicalInsurance', query: { ...this.$route.query }})
          return
        }
        if (nextPageBox.sdqwchecked) {
          this.$router.push({ path: '/form/utilityForm', query: { ...this.$route.query }})
          return
        }
        if (nextPageBox.waterchecked) {
          this.$router.push({ path: '/form/waterRegister', query: { ...this.$route.query }})
          return
        }
        if (nextPageBox.dlchecked) {
          this.$router.push({ path: '/form/electricityAllowed', query: { ...this.$route.query }})
          return
        }
        if (nextPageBox.rqchecked) {
          this.$router.push({ path: '/form/gasRegister', query: { ...this.$route.query }})
          return
        }
        console.log(this.draftInfo)
        const nameApply = this.draftInfo.nameApply // 名称申报
        const address = this.draftInfo.address
        const scope = this.draftInfo.scope
        const member = this.draftInfo.member // 人员信息+设立人员信息
        const otherInfo = this.draftInfo.otherInfo
        const data = {
          ...nameApply,
          ...address, // 地址申报
          scope, // 经营范围
          ...member, // 人员信息
          ...otherInfo, // 其他信息
          // companyType: formatCompanyType(nameApply.companyType),
          industryType: { // 所选行业类型
            IndustryCode: nameApply.industryFormulated.split('-')[0], // 行业类型对应唯一标识
            IndustryName: nameApply.industryFormulated.split('-')[2] // 行业类型名称
          },
          industryFormulated: nameApply.industryFormulated.split('-')[1], // 行业描述
          area: nameApply.area.join(' ')
        }
        console.log(data)
        this.$loading({ text: '正在获取pdf内容' })
        // 传入标识做判断如果是this.$route.query.whatfrom === 'jointOffice',用一事联办job
        preview(data, this.$route.query.whatfrom).then(res => { // 提交数据获取预览pdf
          this.$loading().close()
          if (+res.errCode === 500 || res.state === 'faulted') {
            return this.$utils.showError('生成失败，请重试！')
          }
          this.$router.push({ path: '/form/preview', query: { ...this.$route.query, path: res.outData.pdf }})
        })
        return
      }

      this.$router.push({
        path: '/form/nameApply',
        query: { ...this.$route.query }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.address-form {
  .box {
    width: 900px;
    margin: 0 auto;
    .title {
      text-align: center;
      padding-top: 29px;
      font-size: 28px;
      font-weight: 600;
      color: #333333;
      line-height: 40px;
    }
    .form {
      padding-top: 57px;
      ::v-deep .el-select,
      .el-cascader {
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
        .link {
          color: #025bff;
          cursor: pointer;
        }
      }
      .site-btn {
        text-align: right;
        .el-button {
          width: 130px;
          height: 43px;
          padding: 0;
          box-sizing: border-box;
          text-align: center;
          border: 1px solid #3162e8;
          color: #3162e8;
        }
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
          background: #3162e8;
        }
        ::v-deep .el-radio__input.is-checked + .el-radio__label {
          color: #fff;
        }
      }
      // 多选按钮组
      .el-form-item .el-checkbox.is-bordered {
        min-width: 112px;
        &:nth-of-type(4n+1) {
          margin-top: 22px;
          margin-left: 0!important;
        }
        &:nth-of-type(1) {
          margin-top: 0;
        }
      }
      .btn-group {
        padding-top: 300px;
        padding-bottom: 60px;
        .el-button {
          width: 155px;
          height: 48px;
          padding: 0;
          box-sizing: border-box;
          text-align: center;
          line-height: 48px;
          border: 1px solid #3162e8;
          color: #3162e8;
          &:last-child {
            color: #fff;
          }
        }
      }
    }
    .name_dialog .dialog_wrap {
      padding: 0 58px;
    }
    .name_dialog .dialog_title {
      font-size: 28px;
      color: #555;
      font-weight: bold;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .name_dialog .content {
      padding: 15px 0;
    }
    .name_dialog .content li {
      padding: 10px 0;
      font-size: 15px;
      list-style: none;
      line-height: 26px;
      text-indent: 2em;
      p {
        padding-top: 10px;
        line-height: 26px;
        &:first-child {
          font-weight: bold;
          font-size: 18px;
          line-height: 32px;
        }
      }
    }
    .name_dialog .title2 {
      padding-top: 35px;
      font-size: 15px;
      color: #464646;
      margin-left: -8px;
      line-height: 26px;
      text-indent: 2em;
    }
    .name_dialog .button {
      width: 155px;
      padding: 15px 0;
      text-align: center;
      border-radius: 4px;
      margin: 30px auto 15px;
      cursor: pointer;
    }
  }
}
</style>
