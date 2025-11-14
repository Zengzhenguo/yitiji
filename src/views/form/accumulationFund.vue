<!--
 * @Author: your name
 * @Date: 2022-02-18 10:01:28
 * @LastEditTime: 2022-08-23 16:17:11
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /ec-gov-biz-hubei-pc 2/src/views/form/accumulationFund.vue
-->
<template>
  <div class="address-form">
    <!-- <page-header /> -->
    <breadcrumb v-show="$route.query.mode !== 'test'" />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <el-form ref="form" label-position="left" class="form" :model="form" :rules="rules" label-width="94px">
        <!-- <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item class="radio" label="是否预约社保业务" prop="isReservationSocialSecurityBusiness" label-width="274px">
              <el-radio-group v-model="form.isReservationSocialSecurityBusiness" disabled>
                <el-radio :label="true" border @change="clearValidate">是</el-radio>
                <el-radio :label="false" border @change="clearValidate">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row :gutter="20">
          <!-- <el-col :span="12">
            <el-form-item label="行政区划" prop="addressArea" label-width="140px">
              <el-cascader
                ref="addressArea"
                v-model="form.addressArea"
                :options="areaList"
                separator=" "
                disabled
                :props="{ expandTrigger: 'hover' }"
                placeholder="请选择行政区划"
                @change="handleChangeArea($event,'addressArea')"
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="单位性质" prop="unitNature" label-width="140px">
              <el-select v-model="form.unitNature" placeholder="请选择">
                <el-option
                  v-for="item in unitNatureList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位经济类型" prop="dconomicType" label-width="140px">
              <el-select v-model="form.dconomicType" placeholder="请选择" style="width:49%" @change="chooseUnitEconomyType">
                <el-option
                  v-for="item in unitEconomyTypeList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <el-select v-model="form.economicType" style="width:49%" placeholder="请选择">
                <el-option
                  v-for="item in economicTypeList"
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
            <el-form-item label="管理机构" prop="governingBody" label-width="140px">
              <el-select v-model="form.governingBody" placeholder="请选择">
                <el-option
                  v-for="item in governingBodyList"
                  :key="item.id"
                  :label="item.outletsName"
                  :value="item.outletsName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管理机构类型" prop="governingBodyType" label-width="140px">
              <el-select v-model="form.governingBodyType" placeholder="请选择">
                <el-option
                  v-for="item in governingBodyTypeList"
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
            <el-form-item label="单位发薪日" prop="unitPayday" label-width="140px">
              <el-select v-model="form.unitPayday" placeholder="请选择">
                <el-option
                  v-for="item in ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15',
                                  '16','17','18','19','20','21','22','23','24','25','26','27','28','29','30']"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="初缴年月" prop="initialPayment" label-width="140px">
              <el-date-picker
                v-model="form.initialPayment"
                style="width:100%"
                format="yyyy-MM"
                type="month"
                placeholder="选择年月"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单位缴存比例%" prop="unitDepositRatio" label-width="140px">
              <el-select v-model="form.unitDepositRatio" placeholder="请选择">
                <el-option
                  v-for="item in ratioList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="个人缴存比例%" prop="personalDepositRatio" label-width="140px">
              <el-select v-model="form.personalDepositRatio" placeholder="请选择">
                <el-option
                  v-for="item in ratioList"
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
            <el-form-item label="经办人姓名" prop="managerName" label-width="140px">
              <el-input v-model="form.managerName" placeholder="请填写" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经办人证件号" prop="managerIdcNum" label-width="140px">
              <el-input v-model="form.managerIdcNum" maxlength="18" placeholder="请填写" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="经办人手机号" prop="managerPhone" label-width="140px">
              <el-input v-model="form.managerPhone" maxlength="11" placeholder="请填写" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行" prop="bank" label-width="140px">
              <el-select v-model="form.bank" placeholder="请选择" @change="getBankList">
                <el-option
                  v-for="(item,index) in bankList"
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
            <div class="seal-adress-box">
              <div class="seal-adress-list">
                <el-radio-group v-model="form.bankBranch">
                  <el-radio v-for="(item,index) in bankBranchList" :key="index" :label="item.outletsName" class="seal-adress-item">
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
          <el-button v-if="businessShow.ylchecked||businessShow.sdqwchecked||businessShow.dlchecked||businessShow.waterchecked||businessShow.rqchecked" type="primary" @click="handleNext">下一步</el-button>
          <el-button v-else type="primary" @click="handleNext">下一步，生成表单预览</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/index'
import { preview, getProvidentFundOutletsList, queryAccountList } from '@/api/index'
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      baseInfo: {}, // 基础信息
      curArea: {}, // 当前地区数据
      type: '',
      areaList: [], // 行政区划
      rules: {
        unitNature: [
          { required: true, message: '请选择单位性质', trigger: 'change' }
        ],
        dconomicType: [
          { required: true, message: '请选择单位经济类型', trigger: 'change' }
        ],
        economicType: [
          { required: true, message: '请选择单位经济类型', trigger: 'change' }
        ],
        governingBody: [
          { required: true, message: '请选择管理机构', trigger: 'change' }
        ],
        governingBodyType: [
          { required: true, message: '请选择管理机构类型', trigger: 'change' }
        ],
        bank: [
          { required: true, message: '请选择银行', trigger: 'change' }
        ],
        bankBranch: [
          { required: false, message: '请选择银行网点', trigger: 'change' }
        ],
        unitPayday: [
          { required: true, message: '请选择单位发薪日', trigger: 'change' }
        ],
        initialPayment: [
          { required: true, message: '请选择初缴时间', trigger: 'change' }
        ],
        unitDepositRatio: [
          { required: true, message: '请选择单位缴存比例', trigger: 'change' }
        ],
        personalDepositRatio: [
          { required: true, message: '请选择个人缴存比例', trigger: 'change' }
        ],
        managerName: [
          { required: true, message: '请填写经办人姓名', trigger: 'change' },
          { pattern: /[\u4e00-\u9fa5]/, message: '请填写中文字符' }
        ],
        managerIdcNum: [
          { required: true, message: '请填写经办人身份证号码', trigger: 'change' },
          { pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请填写正确的身份证号码' }
        ],
        managerPhone: [
          { required: true, message: '请填写经办人联系电话', trigger: 'change' },
          { pattern: /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/, message: '请填写正确的联系电话' }
        ]
      },
      unitNatureList: ['国家单位',
        '事业单位',
        '国有企业',
        '城镇集体企业',
        '外商投资企业',
        '城镇私营企业',
        '其他城镇企业',
        '民办非企业单位',
        '社会团体',
        '外商和港澳台投资企业',
        '城镇私营企业及其他城镇企业',
        '其他',
        '资源缴存'
      ], // 单位性质
      // 单位经济类型(父级)
      unitEconomyTypeList: ['内资', '联营', '有限公司', '私有', '港、澳、台投资', '国外投资'], // 单位经济类型
      economicTypeList: [], // 单位经济类型(子级)
      // 管理机构列表
      governingBodyList: [],
      // 管理机构类型列表
      governingBodyTypeList: ['企业法人', '企业非法人', '事业法人', '事业非法人', '社团法人', '社团非法人', '机关法人', '机关非法人', '其他', '公会法人', '民办非企业', '个体'],
      // 银行列表
      bankList: [],
      // 银行网点
      bankBranchList: [],
      // 存缴比例
      ratioList: ['5%', '6%', '7%', '8%', '9%', '10%', '11%', '12%'],
      industryRiskCategoryList: ['一类（0.2%）', '二类（0.4%）', '三类（0.7%）', '四类（0.8%）', '五类（0.9%）', '六类（1.0%）', '七类（1.2%）', '八类（1.5%）'], // 风险行业类别列表
      affiliationList: ['中央', '部', '省', '计划单列市', '市、地区', '县（区）', '区', '县', '街道、镇、乡', '街道', '镇', '乡', '居民、村民委员会', '居民', '村民委员会', '军队', '其他'], // 隶属关系列表
      registrationTypeList: ['新参保'], // 登记类型列表
      unitTypeList: ['企业'], // 单位类型列表
      socialList: [], // 社保网点
      form: {
        unitNature: '',
        unitEconomyType: '',
        dconomicType: '',
        economicType: '',
        governingBody: '',
        governingBodyType: '',
        bank: '',
        bankBranch: '',
        unitPayday: '',
        initialPayment: '',
        unitDepositRatio: '',
        personalDepositRatio: '',
        managerName: '',
        managerIdcNum: '',
        managerPhone: ''
      }
      // centno:"",  //管理部编号
      // branchid:"",   //机构编号
      // busikind:"",  //账户类型
      // accttype:"",   //开户类型
      // corppapertype:"",   //单位证件类型
      // postno:"",   //单位邮编
      // basicacctbanktype:"",   //单位存款账户开户行类型
      // basicacctname:"",   //单位存款账户名称
      // basicacctbrch:"",  //单位存款账户开户行
      // cnapsbankname:"",   //联行号名称
      // cnapsno:"",  //联行号_3
      // basicacctno:"",   //单位存款账户账号
      // payflag:"",   //缴存率标志
      // belong:"",   //隶属关系
      // banktype:"",   //受托银行
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
  },
  activated() {
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
        if (res.providentFund) {
          const providentFund = res.providentFund
          this.form = providentFund
        }
      })
    }
    const areacode = this.$utils.getItem('nameApply').areaCode
    const area = this.$utils.getItem('nameApply').area
    // 获取银行网点
    getProvidentFundOutletsList({ areacode: areacode, serviceProvider: '银行' }).then(res => {
      this.bankList = res.data || []
    })
    queryAccountList({
      area: area[1],
      city: area[0],
      outletsContactPerson: '',
      outletsName: '',
      pageNum: 1,
      pageSize: 20,
      serviceProvider: '公积金' }).then(res => {
      this.governingBodyList = res.data.list || []
    })
  },
  methods: {
    clearValidate() {
      this.$refs['form'].clearValidate()
    },
    // 选择单位经济类型
    chooseUnitEconomyType(value) {
      console.log(value)
      this.economicTypeList = []
      this.form.economicType = ''
      if (value === '内资') {
        this.economicTypeList = ['国有全资', '集体全资', '股份合作', '股份有限（公司）', '其他资源']
      }
      if (value === '联营') {
        this.economicTypeList = ['国有联营', '集体联营', '国有与集体联营', '其他联营']
      }
      if (value === '有限公司') {
        this.economicTypeList = ['国有独资（公司）', '其他有限责任（公司）']
      }
      if (value === '私有') {
        this.economicTypeList = ['私有独资', '私有合伙', '私营有限责任（公司）', '个体经营', '其他私有']
      }
      if (value === '港、澳、台投资') {
        this.economicTypeList = ['内地和港、澳、台合资', '内地和港、澳、台合作', '港、澳、台独资', '港、澳、台投资股份有限（公司）', '其他港、澳、台投资']
      }
      if (value === '国外投资') {
        this.economicTypeList = ['国外投资']
      }
    },
    // 获取银行网点列表
    getBankList(value) {
      console.log(value)
      this.bankList.forEach(item => {
        console.log(item)
        if (item.serviceProvider === value) {
          this.bankBranchList = item.accountList
        }
      })
    },
    // 保存草稿
    handleSaveDraft(showTips = false) {
      return new Promise((resolve, reject) => {
        const data = {
          ...this.draftInfo, // 原有数据
          providentFund: this.form, // 现在数据覆盖原有数据
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
      this.form.unitEconomyType = this.form.dconomicType + this.form.economicType
      console.log(this.form)
      this.$refs['form'].validate(async valid => {
        if (valid) {
          await this.handleSaveDraft()
          this.$utils.setItem('providentFund', this.form)
          const nextPageBox = this.businessShow
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
