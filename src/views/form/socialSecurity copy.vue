<template>
  <div class="address-form">
    <!-- <page-header /> -->
    <breadcrumb v-show="$route.query.mode !== 'test'" />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <el-form ref="form" label-position="left" class="form" :model="form" :rules="rules" label-width="94px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item class="radio" label="是否预约社保业务" prop="isReservationSocialSecurityBusiness" label-width="274px">
              <el-radio-group v-model="form.isReservationSocialSecurityBusiness" disabled>
                <el-radio :label="true" border @change="clearValidate">是</el-radio>
                <el-radio :label="false" border @change="clearValidate">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单位名称" class="socialSecurity" label-width="140px">
              <el-input v-model="form.dwmc" maxlength="18" style="width: 221px;" placeholder="单位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经办人姓名" prop="socialSecurityName" label-width="170px">
              <el-input v-model="form.socialSecurityName" style="width: 221px;" placeholder="请填写" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="经办人证件号码" prop="socialSecurityIdcNum" class="socialSecurity" label-width="140px">
              <el-input v-model="form.socialSecurityIdcNum" maxlength="18" style="width: 221px;" placeholder="请填写" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经办人联系电话" prop="socialSecurityPhone" label-width="200px">
              <el-input v-model="form.socialSecurityPhone" maxlength="11" style="width: 221px;" placeholder="请填写" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="btn-group text-center" label-width="0">
          <el-button @click="handleSaveDraft(true)">暂存草稿</el-button>
          <el-button @click="$router.go(-1)">上一步</el-button>
          <el-button v-if="businessShow.swchecked||businessShow.yhchecked || businessShow.gjjchecked ||businessShow.sdqwchecked||businessShow.dlchecked" type="primary" @click="handleNext">下一步</el-button>
          <el-button v-else type="primary" @click="handleNext">下一步，生成表单预览</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog
      title="在职职工减员申报表模版"
      :visible.sync="openDialog"
      width="70%"
      top="8vh"
      destroy-on-close
      :modal-append-to-body="false"
    >
      <!-- <embed :src="iframeItem.url" type="application/pdf" /> -->
      <img :src="xlsStencilUrl" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/index'
import { preview, getOutletsList } from '@/api/index'
import UploadCode from '@/components/UploadFile/uploadCode'
// import UploadFile from '@/components/UploadFile/camera'
export default {
  components: {
    Breadcrumb,
    UploadCode
  },
  data() {
    return {
      openDialog: false,
      xlsStencilUrl: 'https://rong.wetruetech.cn/zhkb/static/zgjyb.png',
      baseInfo: {}, // 基础信息
      curArea: {}, // 当前地区数据
      type: '',
      areaList: [], // 行政区划
      rules: {
        isReservationSocialSecurityBusiness: [
          { required: true, message: '请选择是否预约社保业务', trigger: 'change' }
        ],
        economicType: [
          { required: true, message: '请选择经济类型', trigger: 'change' }
        ],
        industryRiskCategory: [
          { required: true, message: '请选择风险行业类别', trigger: 'change' }
        ],
        affiliation: [
          { required: true, message: '请选择隶属关系', trigger: 'change' }
        ],
        registrationType: [
          { required: true, message: '请选择登记类型', trigger: 'change' }
        ],
        unitType: [
          { required: true, message: '请选择单位类型', trigger: 'change' }
        ],
        socialSecurityName: [
          { required: true, message: '请填写单位社保联络员姓名', trigger: 'change' },
          { pattern: /[\u4e00-\u9fa5]/, message: '请填写中文字符' }
        ],
        socialSecurityIdcNum: [
          { required: true, message: '请填写单位社保联络员身份证号码', trigger: 'change' },
          { pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请填写正确的身份证号码' }
        ],
        socialSecurityPhone: [
          { required: true, message: '请填写单位社保联络员联系电话', trigger: 'change' },
          { pattern: /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/, message: '请填写正确的联系电话' }
        ],
        socialSecurityOutlets: [
          { required: true, message: '请选择社保网点', trigger: 'change' }
        ]
      },
      economicTypeList: ['其他有限责任（公司）'], // 经济类型列表
      industryRiskCategoryList: ['一类（0.2%）'], // 风险行业类别列表
      affiliationList: ['中央', '部', '省', '计划单列市', '市、地区', '县（区）', '区', '县', '街道、镇、乡', '街道', '镇', '乡', '居民、村民委员会', '居民', '村民委员会', '军队', '其他'], // 隶属关系列表
      registrationTypeList: ['新参保'], // 登记类型列表
      unitTypeList: ['企业'], // 单位类型列表
      socialList: [], // 社保网点
      form: {
        isReservationSocialSecurityBusiness: true, // 是否预约社保
        administrativeDivisions: '', // 行政区划
        economicType: '', // 经济类型
        industryRiskCategory: '一类（0.2%）', // 风险行业类别
        affiliation: '', // 隶属关系
        registrationType: '新参保', // 登记类型
        unitType: '企业', // 单位类型
        socialSecurityName: '', // 单位社保联络员姓名
        socialSecurityIdcNum: '', // 单位社保联络员身份证号码
        socialSecurityPhone: '', // 单位社保联络员联系电话
        addressArea: [], // 行政区划
        addressAreaCode: '', // 行政区划代码
        socialSecurityOutlets: '',
        jysqbUrl: ''
      }
    }
  },
  computed: {
    draftInfo() {
      return this.$store.state.draft.draftInfo
    },
    businessShow() {
      return this.$utils.getItem('businessShow')
    },
    showJysqb() {
      return this.type === '9210commercial'
    }
  },
  created() {
  },
  activated() {
    this.type = this.$route.query.type
    // 获取社保网点
    let areacode = null
    // if (this.$utils.getLocalItem('curArea').city === '十堰市') {
    //   areacode = 420382
    // }
    // if (this.$utils.getLocalItem('curArea').city === '荆州市') {
    //   areacode = 421000
    // }
    areacode = this.$utils.getItem('nameApply').areaCode
    getOutletsList({ areacode: areacode, serviceProvider: '社保' }).then(res => {
      this.socialList = res.data || []
    })
    if (this.$utils.getLocalItem('baseInfo')) {
      this.baseInfo = this.$utils.getLocalItem('baseInfo')
    }
    if (this.$utils.getLocalItem('curArea')) {
      this.curArea = this.$utils.getLocalItem('curArea')
    }
    // 先赋值再拿名称申报的名称覆盖
    this.getAreaInfo().then(async () => {
      // 获取草稿详情
      if (this.$utils.getItem('draftNumber')) {
        this.$store.dispatch('draft/getDraftDetail', this.$utils.getItem('draftNumber')).then(async res => {
          if (res.socialSecurityRegistration) {
            const socialSecurityForm = res.socialSecurityRegistration
            this.form = socialSecurityForm
          }
        })
      }
    })
  },
  methods: {
    clearValidate() {
      this.$refs['form'].clearValidate()
    },
    // 更新扫码上传数据
    updateFileList(val) {
      console.log('扫码上传回调：', val)
      if (val.type === 'jysqbUrl' && val.data.length > 1) {
        this.$utils.showWarn('在职职工减员申报仅支持单份文件，已去除多余文件')
      }
      const url = val.data[0]
      console.log('ssss:', url)
      this.$set(this.form, val.type, url)
    },
    // 保存草稿
    handleSaveDraft(showTips = false) {
      return new Promise((resolve, reject) => {
        const data = {
          ...this.draftInfo, // 原有数据
          socialSecurityRegistration: this.form, // 现在数据覆盖原有数据
          businessType: '2',
          showTips // 是否显示提示
        }
        this.$store.dispatch('draft/saveDraft', data).then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    getAreaInfo() {
      return new Promise(resolve => {
        const params = {
          'inData': {},
          'job': 'HuBei_DistCode'
        }
        this.$utils.showLoading()
        this.$api.startJob(params).then(async res => {
        // 后续远程更新完十堰经济技术开发区再处理
          const areaCode = this.curArea.areaCode
          const areaLabel = this.curArea.areaLabel
          const area = this.$utils.getItem('area')
          const arr = res.outData.data.filter(item => item.label.trim() === this.curArea.city)
          arr[0].children = arr[0].children.filter(item => item.label.trim() === area.label.trim())
          this.areaList = [
            {
              value: '420000',
              label: '湖北省',
              children: arr
            }
          ]
          areaCode.push(area.code)
          this.form.addressArea = areaCode // 地址码
          areaLabel.push(area.label)
          this.form.administrativeDivisions = areaLabel.join(' ') // 地址label
          this.form.addressAreaCode = areaCode[2] // 赋值中文以后赋值code
          this.$utils.hideLoading()
          resolve()
        })
      })
    },
    handleNext() {
      console.log(this.form)
      this.$refs['form'].validate(async valid => {
        if (valid) {
          await this.handleSaveDraft()
          this.$utils.setItem('socialSecurityRegistration', this.form)
          const nextPageBox = this.draftInfo.businessShow
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
        } else {
          this.$utils.showError('请按提示信息补充完整表单！')
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
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
        .link {
          color: #025BFF;
          cursor: pointer;
        }
      }
      .site-btn {
        text-align:right;
        .el-button {
          width: 130px;
          height: 43px;
          padding: 0;
          box-sizing: border-box;
          text-align: center;
          border: 1px solid #3162E8;
          color: #3162E8;
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
          background: #3162E8;
        }
        ::v-deep .el-radio__input.is-checked+.el-radio__label {
          color: #fff;
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
            color: #fff;
          }
        }
      }
    }
    .name_dialog .dialog_wrap{
      padding: 0 58px;
    }
    .name_dialog .dialog_title{
      font-size: 28px;
      color: #555;
      font-weight: bold;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .name_dialog .content{
      padding: 15px 0;
    }
    .name_dialog .content li{
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
    .name_dialog .title2{
      padding-top: 35px;
      font-size: 15px;
      color: #464646;
      margin-left: -8px;
      line-height: 26px;
      text-indent:2em;
    }
    .name_dialog .button{
      width: 155px;
      padding: 15px 0;
      text-align: center;
      border-radius: 4px;
      margin: 30px auto 15px;
      cursor: pointer;
    }
  }
}
.socialSecurity /deep/ .el-form-item__label{
  line-height: 20px;
}
.seal-adress-box{
    border: #ccc solid 1px;
    border-radius:10px ;
    .seal-adress-list{
        overflow-y: auto;
        height: 300px;
        width: 100%;
        padding: 20px;
        .seal-adress-item{
            display: block;
            .seal-adress-text{
                display: inline-block;
                vertical-align: middle;
                font-size: 18px;
                padding: 10px;
            }
        }
    }
}
</style>
