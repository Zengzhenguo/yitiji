<!--
 * @Author: your name
 * @Date: 2021-11-17 14:20:51
 * @LastEditTime: 2022-01-17 15:06:17
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \ec-gov-biz-hubei-terminal\src\views\form\subscribeBank.vue
-->
<template>
  <div class="address-form">
    <!-- <page-header /> -->
    <breadcrumb />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <el-form ref="form" label-position="left" class="form" :model="form" :rules="rules" label-width="94px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="企业名称" prop="companyName" label-width="274px">
              <el-input v-model="form.companyName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="法定代表人" prop="legalName" label-width="274px">
              <el-input v-model="form.legalName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="法人证件号" prop="legalIdcNum" label-width="274px">
              <el-input v-model="form.legalIdcNum" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="委托代理人姓名" prop="managerName" label-width="190px">
              <el-input v-model="form.managerName" placeholder="请输入委托代理人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代理人电话" prop="managerPhone" label-width="150px">
              <el-input v-model="form.managerPhone" maxlength="11" placeholder="请填写联系方式" style="width: 290px;" />
            </el-form-item>
          </el-col>
        </el-row>
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
          <el-button @click="$router.go(-1)">上一步</el-button>
          <el-button type="primary" @click="handleNext">完成</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/index'
import { setCommercialData, getOutletsList } from '@/api/index'
export default {
  components: {
    Breadcrumb
  },
  data() {
    const { validateField } = this.$utils
    return {
      baseInfo: {}, // 基础信息
      curArea: {}, // 当前地区数据
      companyType: '',
      type: '',
      areaList: [], // 行政区划
      rules: {
        companyName: { required: true, message: '请填写企业名称', trigger: 'blur' },
        legalName: { required: true, message: '请填写法定代表人', trigger: 'blur' },
        legalIdcNum: { required: true, message: '请填写法人证件号', trigger: 'blur' },
        isOpenBankAccount: [
          { required: true, message: '请选择是否办理银行开户', trigger: 'change' }
        ],
        bankAccountManagerType: [
          { required: true, message: '请选择银行开户经办人', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' },
          { pattern: /[\u4e00-\u9fa5]/, message: '请填写中文字符' }
        ],
        phone: [
          { required: true, message: '请填写手机号码', trigger: 'blur' },
          { pattern: /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/, message: '请填写正确的手机号码' }
        ],
        openBank: [
          { required: true, message: '请选择开户银行', trigger: 'change' }
        ],
        bankBranch: [
          { required: true, message: '请选择银行网点', trigger: 'change' }
        ],
        managerName: [
          { required: true, message: '请填写委托代理人姓名', trigger: 'blur' }
        ],
        managerPhone: [
          { required: true, message: '请填写代理人联系方式', trigger: 'blur' },
          { validator: validateField('mobile') }
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
        addressAreaCode: '', // 行政区划代码
        companyName: '',
        legalName: '',
        legalIdcNum: '',
        managerName: '',
        managerPhone: ''
      }
    }
  },
  computed: {
    draftInfo() {
      return this.$store.state.draft.draftInfo
    }
  },
  created() {
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
      // 获取银行网点
      if (this.form.addressAreaCode) {
        getOutletsList({ areacode: this.form.addressAreaCode, serviceProvider: '银行' }).then(res => {
          this.openBankList = res.data || []
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
        // 后续远程更新完十堰经济技术开发区再处理
          const areaCode = this.curArea.areaCode
          const areaLabel = this.curArea.areaLabel
          const area = {
            label: this.curArea.district
          }
          const arr = res.outData.data.filter(item => item.label.trim() === this.curArea.city)
          arr[0].children = arr[0].children.filter(item => item.label.trim() === area.label.trim())
          this.areaList = [
            {
              value: '420000',
              label: '湖北省',
              children: arr
            }
          ]
          area.code = arr[0].children[0].value
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
          const data = {
            lltData: {
              managerName: this.form.managerName,
              managerPhone: this.form.managerPhone,
              channelToken: this.$utils.getLocalItem('token'),
              companyName: this.form.companyName,
              legalName: this.form.legalName,
              legalIdcNum: this.form.legalIdcNum,
              bankOpenAccount: this.form || {},
              addressArea: this.form.accountOpenArea
            }
          }
          console.log(data)
          //   var beforeEncryptData = JSON.stringify(data)
          //   const envelopeData = crypt.envelopeEncrypt(beforeEncryptData)
          setCommercialData(data).then(async res => {
            if (+res.errCode === 500 || res.state === 'faulted') {
              this.$loading().close()
              return this.$utils.showError('提交失败，请重试！')
            }
            this.$utils.removeItem('authorization')
            this.$utils.showSuccess('提交成功')
            this.$router.replace('/')
            // 提交成功
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
