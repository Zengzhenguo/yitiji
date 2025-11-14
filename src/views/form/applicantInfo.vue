<template>
  <div class="base-form">
    <!-- <page-header /> -->
    <breadcrumb v-show="$route.query.mode !== 'test'" />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <div class="min-title">检查申报主体信息</div>
      <el-form ref="form" label-position="left" class="form" :model="form" :rules="rules" label-width="94px">
        <el-row :gutter="20">
          <el-col :span="15">
            <el-form-item class="radio" label="统一社会信用代码" label-width="170px" prop="uniscid">
              <el-input v-model="form.uniscid" :disabled="uniscidDisabled" style="width: 321px;" placeholder="请填写统一社会信用代码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="0">
              <el-button type="primary" @click="queryCompanyInfo">查询企业信息</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="企业名称" label-width="100px" prop="companyName">
              <el-input v-model="form.companyName" style="width: 221px;" placeholder="请填写企业名称" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="企业类型" label-width="100px" prop="companyType">
              <el-input v-model.trim="form.companyType" placeholder="请输入企业类型" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="住所" label-width="100px" prop="address">
              <el-input v-model="form.address" type="textarea" :autosize="{ minRows: 1.2}" style="width: 221px;" placeholder="请填写住所" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="注册资本" label-width="100px" prop="regisCapital">
              <el-input v-model.trim="form.regisCapital" placeholder="请输入注册资本">
                <template slot="append">万元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="法定代表人" label-width="120px" prop="legalName">
              <el-input v-model="form.legalName" style="width: 221px;" placeholder="请填写法定代表人" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="登记机关" label-width="100px" prop="regisAuthority">
              <el-input v-model.trim="form.regisAuthority" placeholder="请输入登记机关" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="经办人姓名" label-width="120px" prop="managerName">
              <el-input v-model="form.managerName" style="width: 221px;" placeholder="请填写经办人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="经办人证件号码" label-width="140px" prop="managerIdcNum">
              <el-input v-model.trim="form.managerIdcNum" style="width: 221px;" placeholder="请输入经办人证件号码" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-col :span="11">
          <el-form-item label="行政区划" prop="area">
            <el-input v-model="form.area" disabled />
          </el-form-item>
        </el-col> -->
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="经办人联系方式" label-width="140px" prop="managerPhone">
              <el-input v-model.trim="form.managerPhone" maxlength="11" style="width: 221px;" placeholder="请输入经办人联系方式" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="btn-group text-center" label-width="0">
          <!-- <el-button @click="handleSaveDraft(true)">暂存草稿</el-button> -->
          <el-button @click="$router.go(-1)">返回</el-button>
          <el-button type="primary" @click="handleGoAppendPage">确认信息无误，进行填报</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import PageHeader from '@/components/PageHeader/index'
import Breadcrumb from '@/components/Breadcrumb/index'
import { getCompanyInfo, createJobQueue } from '@/api/index'
// import { formatCompanyType } from '@/filters'
export default {
  components: {
    // PageHeader,
    Breadcrumb
  },
  data() {
    return {
      // 不可选小于当前日期的
      newDateOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      // areaList: [], // 行政区划
      // curArea: {}, // 当前地区数据
      PDF: {
        isOpen: false,
        uploadPdfData: [],
        url: ''
      },
      uniscidDisabled: false,
      form: {
        uniscid: '', // 企业信用代码
        companyName: '', // 企业名称
        companyType: '', // 企业类型
        address: '', // 住所地址
        regisCapital: '', // 注册资本
        legalName: '', // 法人姓名
        regisAuthority: '', // 登记机关
        managerName: '',	// 经办人姓名
        managerPhone: '', // 经办人电话
        managerIdcNum: '', // 经办人证件号码
        area: '' // 行政区划，默认写死一体机的区划，空格分割的字符串
      },
      rules: {
        area: [
          { required: true, message: '请选择行政区划', trigger: 'change' }
        ],
        uniscid: [
          { required: true, message: '请填写企业信用代码', trigger: 'change' }
        ],
        companyName: [
          { required: true, message: '请填写企业名称', trigger: 'change' }
        ],
        companyType: [
          { required: true, message: '请填写企业类型', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请填写住所地址', trigger: 'change' }
        ],
        regisCapital: [
          { required: true, message: '请填写注册资本', trigger: 'change' }
        ],
        legalName: [
          { required: true, message: '请填写法人姓名', trigger: 'change' }
        ],
        regisAuthority: [
          { required: true, message: '请填写登记机关', trigger: 'change' }
        ],
        managerName: [
          { required: true, message: '请填写经办人姓名', trigger: 'change' }
        ],
        managerPhone: [
          { required: true, message: '请填写经办人电话', trigger: 'change' },
          { pattern: /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/, message: '请填写正确的电话号码' }
        ],
        managerIdcNum: [
          { required: true, message: '请填写经办人证件号码', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    draftInfo() {
      return this.$store.state.draft.draftInfo
    },
    // 获取当前一体机所在地
    getCurArea() {
      const { provice, city, district } = this.$utils.getLocalItem('curArea')
      return `${provice} ${city} ${district}`
    }
  },
  async mounted() {
    console.log(this.form)
    // 获取章程模板
    // const type = this.constitutionPdfType
    // // console.log(type)
    // const res = await getConstitutionPDF(type)
    // this.PDF.url = this.$utils.getFile(res.outData.pdf)
    if (this.$utils.getLocalItem('userInfo')) {
      const userInfo = this.$utils.getLocalItem('userInfo')
      this.form.managerName = userInfo.name	// 经办人姓名
      this.form.managerIdcNum = userInfo.idNumber // 经办人证件号码
    }
    if (this.$utils.getLocalItem('curArea')) {
      this.form.area = this.getCurArea
    }

    this.createQueue()
  },
  activated() {
    // this.getAreaInfo()
    // 获取草稿详情
    if (this.$utils.getItem('draftNumber')) {
      this.$store.dispatch('draft/getDraftDetail', this.$utils.getItem('draftNumber')).then(async res => {
        if (res.applicantInfo) {
          this.form = res.applicantInfo
        }
      })
    }
    // if (this.$utils.getItem('applicantInfo')) {
    //   this.form = this.$utils.getItem('applicantInfo')
    // }
  },
  methods: {
    // 保存草稿
    handleSaveDraft(showTips = false) {
      return new Promise((resolve, reject) => {
        const data = {
          ...this.draftInfo, // 原有数据
          applicantInfo: this.form, // 现在数据覆盖原有数据
          showTips // 是否显示提示
        }
        this.$store.dispatch('draft/saveDraft', data).then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },

    // 查询企业信息
    queryCompanyInfo() {
      if (!this.form.uniscid) {
        this.$utils.showError('请填写企业信用代码')
        return
      }
      this.$loading({ text: '查询时间较长，请耐心等待' })
      getCompanyInfo({ creditCode: this.form.uniscid }).then(res => {
        this.$loading().close()
        if (res.state === 'successful') {
          if (res.outData.data.length === 0) {
            this.$utils.showError('未查询到企业信息')
            return
          }
          const info = res.outData.data[0]
          this.form.companyName = info.companyName // 企业名称
          this.form.companyType = info.companyType // 企业类型
          this.form.address = info.address // 住所地址
          this.form.regisCapital = info.capital // 注册资本
          this.form.legalName = info.idName // 法人姓名
          this.form.regisAuthority = info.registration // 登记机关
          this.uniscidDisabled = true
        } else {
          this.$utils.showError(res.errMsg)
        }
      })
    },
    // 重置
    reset() {
      this.form.uniscid = '' // 企业信用代码
      this.form.companyName = '' // 企业名称
      this.form.companyType = '' // 企业类型
      this.form.domAddr = '' // 住所地址
      this.form.regisCapital = '' // 注册资本
      this.form.legalName = '' // 法人姓名
      this.form.regisAuthority = '' // 登记机关
      this.uniscidDisabled = false
    },

    handleGoAppendPage() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          await this.handleSaveDraft()
          this.$utils.setItem('applicantInfo', this.form) // 存储其他信息
          this.$router.push({ path: '/form/materialsUpload', query: { ...this.$route.query }})
        } else {
          this.$utils.showError('请按提示信息补充完整表单！')
        }
      })
    },

    createQueue() {
      this.$loading({ text: '加载中...' })
      createJobQueue().then(async res => {
        this.$loading().close()
        this.$utils.setItem('ident', res.outData.queueIdent)
      }).catch(err => {
        this.$loading().close()
        console.log(err)
      })
    }
  }
}
</script>
<style lang='scss' scoped>
::v-deep .el-input-group__append, .el-input-group__prepend {
  background: #fff;
  border-left: 0;
}
// ::v-deep .el-input-group>.el-input__inner {
//   border-right: 0;
// }
// ::v-deep .el-input-group__append:focus, .el-input-group__prepend:focus  {
//   border: 1px solid #3162E8;
// }
.base-form {
  .box {
    width: 800px;
    margin: 0 auto;
    .title {
      text-align: center;
      padding-top: 29px;
      font-size: 28px;
      font-weight: 600;
      color: #333333;
      line-height: 40px;
    }
    .min-title{
      text-align: center;
      font-size: 20px;
      font-weight: 500;
      color: #333333;
      line-height: 40px;
    }
    .form {
      padding-top: 60px;
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
      .radio_group_bottom{
        font-size: 14px;
        padding: 10px 0 39px 100px;
      }
      .radio {
        // height: 43px;
        .el-radio {
          width: 120px;
          height: 43px;
          padding: 0;
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
        padding-top: 50px;
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
  }
}

</style>
