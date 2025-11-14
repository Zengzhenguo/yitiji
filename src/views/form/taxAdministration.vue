<template>
  <div class="address-form">
    <!-- <page-header /> -->
    <breadcrumb v-show="$route.query.mode !== 'test'" />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <el-form ref="form" label-position="left" class="form" :model="form" :rules="rules" label-width="94px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item class="radio" label="是否预约税务登记" prop="isReservationTaxInvoice" label-width="274px">
              <el-radio-group v-model="form.isReservationTaxInvoice" disabled>
                <el-radio :label="true" border @change="clearValidate">是</el-radio>
                <el-radio :label="false" border @change="clearValidate">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item class="radio" label="是否登记为增值税一般纳税人" prop="isRegisterTax" label-width="274px">
              <el-radio v-model="form.isRegisterTax" :label="true" border @change="clearValidate">是</el-radio>
              <el-radio v-model="form.isRegisterTax" :label="false" border @change="clearValidate">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="form.isRegisterTax">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="纳税人类别" prop="taxType" label-width="130px">
                <el-select v-model="form.taxType" placeholder="请选择纳税人类别">
                  <el-option
                    v-for="item in taxTypeList"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="主营业务类别" prop="mainBusinessCategory" label-width="130px">
                <el-select v-model="form.mainBusinessCategory" placeholder="请选择主营业务类别">
                  <el-option
                    v-for="item in mainBusinessCategoryList"
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
              <el-form-item label="会计核算健全" prop="soundAccounting" label-width="130px">
                <el-select v-model="form.soundAccounting" placeholder="请选择会计核算健全">
                  <el-option
                    v-for="item in soundAccountingList"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="form.soundAccounting!=='否'" label="一般纳税人资格生效之日" class="effectiveDate" prop="effectiveDate" label-width="130px">
                <el-select v-model="form.effectiveDate" placeholder="请选择">
                  <el-option
                    v-for="item in effectiveDateList"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发票信息" />
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-table ref="singleTable" :data="form.invoiceInformation" highlight-current-row style="width: 100%">
              <el-table-column type="index" label="序号" width="80" align="center" />
              <el-table-column property="idcName" label="发票种类名称" align="center">
                <template slot-scope="{ row }">
                  <el-select v-model="row.invoiceType" placeholder="请选择" @change="selectInvoiceType">
                    <el-option
                      v-for="item in invoiceTypeList"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column property="idcName" label="单份发票最高开票限额" width="150" align="center">
                <template slot-scope="{ row }">
                  <el-select v-model="row.invoiceAmount" style="width: 150px;" placeholder="请选择">
                    <el-option
                      v-for="item in invoiceAmountList"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column property="idcName" label="每月最高领票数量" width="100" align="center">
                <template slot-scope="{ row }">
                  <el-input v-model="row.quantity" disabled style="width: 100px;" placeholder="请填写平台名称" />
                </template>
              </el-table-column>
              <el-table-column property="idcName" label="领票方式" align="center">
                <template slot-scope="{ row }">
                  <el-select v-model="row.ticketsWay" placeholder="请选择">
                    <el-option
                      v-for="item in ticketsWayList"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="handleAddInvoice(scope.$index, scope.row)">
                    添加
                  </el-button>
                  <el-button size="mini" type="text" @click="handleDeleteInvoice(scope.$index, scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row v-if="addedTaxInvoiceShow" :gutter="20" style="margin-top:20px">
          <el-col :span="12">
            <el-form-item label="增值税专用发票" prop="addedTaxInvoice" label-width="140px">
              <el-select v-model="form.addedTaxInvoice" placeholder="请选择">
                <el-option
                  v-for="item in addedTaxInvoiceList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"><div class="zzs-tips">（增值税税控系统）最高开票限额申请</div></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="购票人信息" />
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-table ref="singleTable" :data="form.ticketBuyerInformation" highlight-current-row style="width: 100%">
              <el-table-column type="index" label="序号" width="80" align="center" />
              <el-table-column property="idcName" label="姓名" width="150" align="center">
                <template slot-scope="{ row }">
                  <el-input v-model="row.idcName" style="width: 150px;" placeholder="请填写姓名" />
                </template>
              </el-table-column>
              <el-table-column property="idcType" label="证件类型" align="center">
                <template slot-scope="{ row }">
                  <el-select v-model="row.idcType" placeholder="请选择">
                    <el-option
                      v-for="item in idcTypeList"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column property="idcNumber" label="证件号码" align="center">
                <template slot-scope="{ row }">
                  <el-input v-model="row.idcNumber" maxlength="18" placeholder="请填写证件号码" />
                </template>
              </el-table-column>
              <el-table-column property="phone" label="移动电话" width="140" align="center">
                <template slot-scope="{ row }">
                  <el-input v-model="row.phone" maxlength="11" style="width: 140px;" placeholder="请填写移动电话" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="handleAddTicketBuyer(scope.$index, scope.row)">
                    添加
                  </el-button>
                  <el-button size="mini" type="text" @click="handleDeleteTicketBuyer(scope.$index, scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>>
            </el-table>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="税务网点" prop="taxBranch" label-width="120px" />
          </el-col>
          <el-col :span="20">
            <div class="seal-adress-box">
              <div class="seal-adress-list">
                <el-radio-group v-model="form.taxBranch">
                  <el-radio v-for="(item,index) in taxBranchList" :key="index" :label="item.outletsName" class="seal-adress-item">
                    <div class="seal-adress-text">
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
          <el-button v-if="businessShow.yhchecked || businessShow.gjjchecked ||businessShow.ylchecked || businessShow.sdqwchecked||businessShow.dlchecked" type="primary" @click="handleNext">下一步</el-button>
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
      type: '',
      rules: {
        companyName: [
          { required: true, message: '请填写企业名称', trigger: 'change' }
        ],
        isReservationTaxInvoice: [
          { required: true, message: '请选择是否预约税务登记', trigger: 'change' }
        ],
        isRegisterTax: [
          { required: true, message: '请选择是否登记为增值税一般纳税人', trigger: 'change' }
        ],
        taxType: [
          { required: true, message: '请选择纳税人类别', trigger: 'change' }
        ],
        mainBusinessCategory: [
          { required: true, message: '请选择主营业务类别', trigger: 'change' }
        ],
        soundAccounting: [
          { required: true, message: '请选择会计核算健全', trigger: 'change' }
        ],
        effectiveDate: [
          { required: true, message: '请选择一般纳税人资格生效之日', trigger: 'change' }
        ],
        addedTaxInvoice: [
          { required: true, message: '请选择增值税专用发票', trigger: 'change' }
        ],
        taxBranch: [
          { required: true, message: '请选择税务网点', trigger: 'change' }
        ]
      },
      taxBranchList: [],
      taxTypeList: ['企业', '非企业性单位', '个体工商户', '农民合作社', '其他'], // 纳税人类别列表
      mainBusinessCategoryList: ['工业', '商业', '服务业', '其他'], // 主营业务类别列表
      soundAccountingList: ['是', '否'], // 会计核算健全列表
      effectiveDateList: ['当月1日', '次月1日'], // 一般纳税人资格生效之日列表
      invoiceTypeList: ['增值税普通发票', '增值税专用发票'], // 发票种类列表
      invoiceAmountList: ['十万元'], // 发票限额列表
      ticketsWayList: ['大厅领取'], // 领票方式列表
      addedTaxInvoiceList: ['一千元', '一万元', '十万元'], // 增值税专用发票列表
      idcTypeList: ['中华人民共和国居民身份证'], // 证件类型列表
      form: {
        isReservationTaxInvoice: true, // 是否预约税务登记
        isRegisterTax: true, // 是否登记为增值税一般纳税人
        taxType: '', // 纳税人类别
        mainBusinessCategory: '', // 主营业务类别
        soundAccounting: '', // 会计核算健全
        effectiveDate: '', // 一般纳税人资格生效之日
        invoiceInformation: [ // 发票信息
          { invoiceType: '', // 发票种类
            invoiceAmount: '', // 发票限额
            // quantity: '50', // 最高领票数
            quantity: '25', // 最高领票数
            ticketsWay: '' // 领票方式
          }
        ],
        addedTaxInvoice: '', // 增值税专用发票
        ticketBuyerInformation: [
          {
            idcName: '',
            idcType: '',
            idcNumber: '',
            phone: ''
          }
        ], // 购票人信息
        taxBranch: '' // 网点

      },
      addedTaxInvoiceShow: true // 是否显示增值税专用发票
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
  activated() {
    // 获取税务网点
    let areacode = null
    // if (this.$utils.getLocalItem('curArea').city === '十堰市') {
    //   areacode = 420382
    // }
    // if (this.$utils.getLocalItem('curArea').city === '荆州市') {
    //   areacode = 421000
    // }
    areacode = this.$utils.getItem('nameApply').areaCode
    getOutletsList({ areacode: areacode, serviceProvider: '税务' }).then(res => {
      this.taxBranchList = res.data
      console.log(this.taxBranchList)
    })
    this.type = this.$route.query.type
    if (this.$utils.getLocalItem('baseInfo')) {
      this.baseInfo = this.$utils.getLocalItem('baseInfo')
    }
    if (this.$utils.getLocalItem('curArea')) {
      this.curArea = this.$utils.getLocalItem('curArea')
    }
    // 获取草稿详情
    if (this.$utils.getItem('draftNumber')) {
      this.$store.dispatch('draft/getDraftDetail', this.$utils.getItem('draftNumber')).then(async res => {
        if (res.taxInvoice) {
          const taxInvoiceForm = res.taxInvoice
          this.form = taxInvoiceForm
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
          taxInvoice: this.form, // 现在数据覆盖原有数据
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
    handleNext() {
      this.$refs['form'].validate(async valid => {
        console.log(this.form)
        if (valid) {
          let bold = true
          this.form.invoiceInformation.forEach(element => {
            if (!element.invoiceAmount || !element.invoiceType || !element.ticketsWay) {
              this.$utils.showError('请将发票信息补充完整！')
              bold = false
              return
            }
          })
          this.form.ticketBuyerInformation.forEach(element => {
            if (!element.idcName || !element.idcType || !element.idcNumber || !element.phone) {
              this.$utils.showError('请将购票人信息补充完整！')
              bold = false
              return
            }
            if (!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(element.idcNumber)) {
              this.$utils.showError('请填写正确的身份证号码')
              bold = false
              return
            }
            if (!/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(element.phone)) {
              this.$utils.showError('请填写正确的手机号码')
              bold = false
              return
            }
          })
          if (!bold) {
            return
          }
          await this.handleSaveDraft()
          this.$utils.setItem('taxInvoice', this.form)
          const nextPageBox = this.draftInfo.businessShow
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
        } else {
          this.$utils.showError('请按提示信息补充完整表单！')
        }
      })
    },
    // 添加发票·
    handleAddInvoice() {
      if (this.form.invoiceInformation.length === 2) {
        this.$utils.showError('最多只能新增两条发票信息！')
        return
      }
      this.form.invoiceInformation.push(
        { invoiceType: '增值税普通发票', // 发票种类
          invoiceAmount: '', // 发票限额
          // quantity: '50', // 最高领票数
          quantity: '25', // 最高领票数
          ticketsWay: '' // 领票方式
        }
      )
    },
    // 删除发票
    handleDeleteInvoice(index) {
      if (this.form.invoiceInformation.length === 1) {
        this.$utils.showError('最少添加一条发票信息！')
        return
      }
      this.form.invoiceInformation.splice(index, 1)
    },
    // 选择发票种类
    selectInvoiceType() {
      this.addedTaxInvoiceShow = false
      this.form.invoiceInformation.forEach(element => {
        if (element.invoiceType === '增值税专用发票') {
          this.addedTaxInvoiceShow = true
        }
      })
    },
    // 添加购票人
    handleAddTicketBuyer() {
      this.form.ticketBuyerInformation.push({
        idcName: '',
        idcType: '',
        idcNumber: '',
        phone: ''
      })
    },
    // 删除购票人
    handleDeleteTicketBuyer(index) {
      if (this.form.ticketBuyerInformation.length === 1) {
        this.$utils.showError('最少添加一条购票人信息！')
        return
      }
      this.form.ticketBuyerInformation.splice(index, 1)
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
.zzs-tips{
    line-height: 45px;
    color:#7F7E7E
}
.effectiveDate /deep/ .el-form-item__label{
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
