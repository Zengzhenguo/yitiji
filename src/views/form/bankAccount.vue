<template>
  <div class="address-form">
    <!-- <page-header /> -->
    <breadcrumb v-show="$route.query.mode !== 'test'" />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <el-form ref="form" label-position="left" class="form" :model="form" :rules="rules" label-width="94px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item class="radio" label="是否办理银行开户" prop="isOpenBankAccount" label-width="274px">
              <el-radio-group v-model="form.isOpenBankAccount" disabled>
                <el-radio :label="true" border @change="clearValidate">是</el-radio>
                <el-radio :label="false" border @change="clearValidate">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="银行开户经办人" prop="bankAccountManagerType" label-width="160px">
              <el-select v-model="form.bankAccountManagerType" placeholder="请选择" @change="selectBankManagerType">
                <el-option
                  v-for="item in bankAccountManagerTypeList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name" label-width="120px">
              <el-input v-model="form.name" style="width: 221px;" placeholder="请填写" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone" label-width="120px">
              <el-input v-model="form.phone" maxlength="11" style="width: 221px;" placeholder="请填写" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开户所在地" prop="addressArea" label-width="120px">
              <el-cascader
                ref="addressArea"
                v-model="form.areaArr"
                :options="areaList"
                separator=" "
                disabled
                :props="{ expandTrigger: 'hover' }"
                placeholder="请选择行政区划"
                @change="handleChangeArea($event,'addressArea')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户银行" prop="openBank" label-width="120px">
              <el-select v-model="form.openBank" placeholder="请选择" @change="selectBank">
                <el-option
                  v-for="(item,index) in openBankList"
                  :key="index"
                  :label="item.serviceProvider"
                  :value="item.serviceProvider"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="银行网点" prop="bankBranch" label-width="120px" />
          </el-col>
          <el-col :span="20">
            <div class="bank-adress-box">
              <div class="bank-adress-list">
                <el-radio-group v-model="form.bankBranch">
                  <el-radio v-for="(item,index) in bankList" :key="index" :label="item.outletsName" class="bank-adress-item">
                    <div class="bank-adress-text">
                      <div style="color:#000">{{ item.outletsName }}<span style="font-size:14px">（{{ item.outletsAddr }}）</span></div>
                      <div style="margin-top:10px;color:#999;font-size:15px"><span>联系人：{{ item.outletsContactPerson }} </span><span style="margin-left:20px">联系电话：{{ item.outletsPhone }}</span></div>
                    </div>
                  </el-radio>
                </el-radio-group>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-form-item class="btn-group text-center" label-width="0">
          <el-button @click="handleSaveDraft(true)">暂存草稿</el-button>
          <el-button @click="$router.go(-1)">上一步</el-button>
          <el-button v-if="businessShow.gjjchecked || businessShow.ylchecked || businessShow.sdqwchecked||businessShow.dlchecked" type="primary" @click="handleNext">下一步</el-button>
          <el-button v-else type="primary" @click="handleNext">下一步，生成表单预览</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/index'
import { preview, getOutletsList } from '@/api/index'
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      baseInfo: {}, // 基础信息
      curArea: {}, // 当前地区数据
      companyType: '',
      type: '',
      areaList: [], // 行政区划
      rules: {
        isOpenBankAccount: [
          { required: true, message: '请选择是否办理银行开户', trigger: 'change' }
        ],
        bankAccountManagerType: [
          { required: true, message: '请选择银行开户经办人', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请填写名称', trigger: 'change' },
          { pattern: /[\u4e00-\u9fa5]/, message: '请填写中文字符' }
        ],
        phone: [
          { required: true, message: '请填写手机号码', trigger: 'change' },
          { pattern: /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/, message: '请填写正确的手机号码' }
        ],
        openBank: [
          { required: true, message: '请选择开户银行', trigger: 'change' }
        ],
        bankBranch: [
          { required: true, message: '请选择银行网点', trigger: 'change' }
        ]

      },
      bankList: [], // 银行网点列表
      bankAccountManagerTypeList: ['法定代表人', '财务负责人', '其他'], // 银行开户经办人列表
      openBankList: [], // 开户银行列表

      form: {
        isOpenBankAccount: true, // 是否办理银行开户
        bankAccountManagerType: '法定代表人', // 银行开户经办人
        name: '', // 姓名
        phone: '', // 电话
        accountOpenArea: '', // 开户所在地区
        openBank: '', // 开户银行
        bankBranch: '', // 银行网点
        addressArea: '', // 行政区划
        areaArr: [], // 行政区划数组
        addressAreaCode: '' // 行政区划代码
      }
    }
  },
  computed: {
    draftInfo() {
      return this.$store.state.draft.draftInfo
    },
    businessShow() {
      return this.$utils.getItem('businessShow')
    }
  },
  created() {
    let areacode = null
    // if (this.$utils.getLocalItem('curArea').city === '十堰市') {
    //   areacode = 420382
    // }
    // if (this.$utils.getLocalItem('curArea').city === '荆州市') {
    //   areacode = 421000
    // }
    areacode = this.$utils.getItem('nameApply').areaCode
    // 获取银行网点
    getOutletsList({ areacode: areacode, serviceProvider: '银行' }).then(res => {
      // if (res.data === []) {
      //   this.openBankList = []
      //   return
      // }
      this.openBankList = res.data || []
      // if (this.$utils.getLocalItem('curArea').district === '硚口区') {
      //   this.openBankList = res.data.filter(item => item.serviceProvider === '交通银行')
      //   return
      // }
      // 默认选择第一家
      if (res.data.length) {
        this.form.openBank = res.data[0].serviceProvider
        this.selectBank(res.data[0].serviceProvider)
      }
    })
  },
  activated() {
    this.type = this.$route.query.type
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
          if (res.bankOpenAccount) {
            const bankOpenAccountForm = res.bankOpenAccount
            this.form = bankOpenAccountForm
          }
          if (res.member) {
            const personList = res.member.memberList
            if (personList.length > 0) {
              personList.forEach(item => {
                item.jobs.forEach(children => {
                  if (children.name === '法定代表人') {
                    this.form.name = item.idcName
                    this.form.phone = item.phone
                    return
                  }
                })
              })
            }
          }
        })
      }
    })
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
          bankOpenAccount: this.form, // 现在数据覆盖原有数据
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
        // 后续远程更新完十堰经济开发区再处理
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
          this.form.areaArr = areaCode // 地址码
          areaLabel.push(area.label)
          this.form.accountOpenArea = areaLabel.join(' ') // 地址label
          this.form.addressAreaCode = areaCode[2] // 赋值中文以后赋值code
          this.$utils.hideLoading()
          resolve()
        })
      })
    },
    // 修改省市区，获取街道信息
    handleChangeArea(value, key) {
      this.form[`${key}Code`] = value[2]
      this.form[key] = this.$refs[key].getCheckedNodes()[0].pathLabels.join(' ')
    },
    // 选择银行
    selectBank(value) {
      console.log(value)
      this.openBankList.forEach(item => {
        console.log(item)
        if (item.serviceProvider === value) {
          this.bankList = item.accountList
        }
      })
    },
    // 选择银行经办人
    selectBankManagerType(value) {
      this.form.name = ''
      this.form.phone = ''
      const personList = this.draftInfo.member.memberList
      if (personList.length > 0) {
        personList.forEach(item => {
          item.jobs.forEach(children => {
            if (children.name === '财务负责人' && value === '财务负责人') {
              this.form.name = item.idcName
              this.form.phone = item.phone
              return
            }
            if (children.name === '法定代表人' && value === '法定代表人') {
              this.form.name = item.idcName
              this.form.phone = item.phone
              return
            }
          })
        })
      }
    },

    handleNext() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
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
          await this.handleSaveDraft()
          this.$utils.setItem('bankOpenAccount', this.form)
          const nextPageBox = this.businessShow
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
.bank-adress-box{
    border: #ccc solid 1px;
    border-radius:10px ;
    .bank-adress-list{
        overflow-y: auto;
        height: 200px;
        width: 100%;
        padding: 20px;
        .bank-adress-item{
            display: block;
            .bank-adress-text{
                display: inline-block;
                vertical-align: middle;
                font-size: 18px;
                padding: 10px;
            }
        }
    }
}
</style>
