<template>
  <div class="companyMessage">
    <!-- <PageHeader /> -->
    <div class="companyMessageMain">
      <div class="top">
        <div>AI辅助开办，智能秒批</div>
        <div>一表填报，智能辅助，轻松打照</div>
      </div>
      <Breadcrumb style="text-align:left;border-bottom:1px solid #ccc;margin-bottom:60px;" />
      <el-form ref="ruleForm" :model="form" :rules="rules" class="report_form" label-width="auto" label-position="left">
        <el-row>
          <el-col :span="12">
            <el-form-item ref="年报年度" label="年报年度" prop="年报年度">
              <el-date-picker
                v-model="form['年报年度']"
                type="year"
                :editable="false"
                placeholder="请选择年报年度"
                :picker-options="handleSetDisabled"
                value-format="yyyy"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item ref="成员人数" label="成员人数（人）" prop="成员人数">
              <el-input v-model.trim="form['成员人数']" type="number" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item ref="企业通讯地址" label="企业通讯地址" prop="企业通讯地址">
              <el-input v-model.trim="form['企业通讯地址']" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item ref="其中农民人数" label="其中农民人数（人）" prop="其中农民人数">
              <el-input v-model.trim="form['其中农民人数']" type="number" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item ref="企业联系电话" label="企业联系电话" prop="企业联系电话">
              <el-input v-model.trim="form['企业联系电话']" maxlength="11" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item ref="电子邮箱" label="电子邮箱" prop="电子邮箱">
              <el-input v-model.trim="form['电子邮箱']" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item ref="经营范围" label="企业主营业务活动" prop="经营范围">
              <el-input
                v-model.trim="form['经营范围']"
                type="textarea"
                placeholder="请输入"
                clearable
                :autosize="{ minRows: 2, maxRows: 10}"
                resize="none"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item ref="从业人数" label="从业人数" prop="从业人数">
              <el-row>
                <el-col :span="12">
                  <el-input v-model="form['从业人数']" type="number" placeholder="请输入" clearable />
                </el-col>
                <el-col :span="12" style="height: 45px;line-height: 45px;width: 134.5px;margin-right: -100px;">
                  <el-radio v-model="form['从业人数是否公示']" label="公示">公示</el-radio>
                  <el-radio v-model="form['从业人数是否公示']" label="不公示">不公示</el-radio>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item ref="本年度新增" label="本年度新增（人）" prop="本年度新增">
              <el-input v-model.trim="form['本年度新增']" type="number" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item ref="退出" label="退出（人）" prop="退出">
              <el-input v-model.trim="form['退出']" type="number" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item ref="其中女性从业人数" label="其中女性从业人数" prop="其中女性从业人数">
              <el-row>
                <el-col :span="12">
                  <el-input v-model="form['其中女性从业人数']" type="number" placeholder="请输入" clearable />
                </el-col>
                <el-col :span="12" style="height: 45px;line-height: 45px;width: 134.5px;margin-right: -100px;">
                  <el-radio v-model="form['女性从业人数是否公示']" label="公示">公示</el-radio>
                  <el-radio v-model="form['女性从业人数是否公示']" label="不公示">不公示</el-radio>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-form-item class="z_button_group">
              <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
              <el-button @click="saveDraftForm('draft')">暂存草稿</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getOrderInfo, draftDetail } from '@/api'
import Breadcrumb from '@/components/Breadcrumb/index'
export default {
  components: {
    Breadcrumb
  },
  data() {
    const { validateField } = this.$utils
    const checkCount = (rule, value, callback) => {
      if (parseInt(value) > parseInt(this.form['从业人数'])) {
        callback(new Error(`${rule.field}大于从业人数，请查证`))
      } else {
        callback()
      }
    }
    return {
      radio: '',
      checkList: [],
      handleSetDisabled: {
        disabledDate(time) { // 返回禁用日期
          return time.getFullYear() > 2021 || time.getFullYear() < 2021
        }
      },
      draftNumber: '', // 草稿箱ID
      name: '', // 办事主体
      bizName: '', // 事项名称
      form: {
        '经营者名称': '',
        '企业名称': '',
        '资金数额': '',
        '企业联络员身份证号码': '',
        '纳税总额': '',
        '资产状况信息是否公示': '否',
        '城镇职工基本养老保险': '',
        '失业保险': '',
        '职工基本医疗保险': '',
        '工伤保险': '',
        '生育保险': '',
        '单位参加城镇职工基本养老保险缴费基数': '',
        '单位参加失业保险缴费基数': '',
        '单位参加职工基本医疗保险缴费基数': '',
        '单位参加生育保险缴费基数': '',
        '单位缴费基数是否公示': '否',
        '参加城镇职工基本养老保险本期实际缴费金额': '',
        '参加失业保险本期实际缴费金额': '',
        '参加职工基本医疗保险本期实际缴费金额': '',
        '参加工伤保险本期实际缴费金额': '',
        '参加生育保险本期实际缴费金额': '',
        '本期实际缴费金额是否公示': '否',
        '单位参加城镇职工基本养老保险累计欠缴金额': '0',
        '单位参加失业保险累计欠缴金额': '0',
        '单位参加职工基本医疗保险累计欠缴金额': '0',
        '单位参加工伤保险累计欠缴金额': '0',
        '单位参加生育保险累计欠缴金额': '0',
        '单位累计欠缴金额是否公示': '否',
        '是否有网站或网店': '否',
        '是否有特种设备': '否',
        '办理使用登记特种设备总台数': '',
        '检验有效期内特种设备总台数': '',
        '网站或网店': [
          {
            '网站或网店名称': '',
            '网站或网店网址': '',
            '网站或网店类型': ''
          }
        ],
        '是否存在分支机构': '否',
        '分支机构': [
          {
            '分支机构名': '',
            '统一社会信用代码/注册号': ''
          }
        ],
        '是否有行政许可': '否',
        '行政许可': [
          {
            '行政许可名称': '',
            '有效期至': ''
          }
        ],
        '企业通讯地址': '',
        '经营范围': '',
        '邮政编码': '',
        '企业经营状态': '',
        '企业联系电话': '',
        '统一社会信用代码': '',
        '年报年度': String(this.$utils.getItem('reportYear')[0] + 1),
        '电子邮箱': '',
        '从业人数': '',
        '从业人数是否公示': '不公示',
        '其中女性从业人数': '',
        '女性从业人数是否公示': '不公示',
        '成员人数': '',
        '其中农民人数': '',
        '本年度新增': '',
        '退出': ''
      },
      rules: {
        '年报年度': [
          { required: true, message: '请选择年报年度', trigger: 'change' }
        ],
        '企业名称': [
          { required: true, message: '请输入企业名称', trigger: 'change' }
        ],
        '统一社会信用代码': [
          { required: true, message: '请输入统一社会信用代码', trigger: 'change' }
        ],
        '企业通讯地址': [
          { required: true, message: '请输入企业通讯地址', trigger: 'change' }
        ],
        '邮政编码': [
          { required: true, message: '请输入邮政编码', trigger: 'change' },
          { validator: validateField('ems') }
        ],
        '企业联系电话': [
          { required: true, message: '请输入企业联系电话', trigger: 'change' },
          { validator: validateField('phone') }
        ],
        '电子邮箱': [
          { required: true, message: '请输入电子邮箱', trigger: 'change' },
          { validator: validateField('email') }
        ],
        '成员人数': [
          { required: true, message: '请输入成员人数', trigger: 'change' }
        ],
        '其中农民人数': [
          { required: true, message: '请输入其中农民人数', trigger: 'change' }
        ],
        '本年度新增': [
          { required: true, message: '请输入本年度新增', trigger: 'change' }
        ],
        '退出': [
          { required: true, message: '请输入退出', trigger: 'change' }
        ],
        '经营范围': [
          { required: true, message: '请输入企业主营业务活动', trigger: 'change' }
        ],
        '从业人数': [
          { required: true, message: '请输入从业人数', trigger: 'change' }
        ],
        '其中女性从业人数': [
          { required: true, message: '请输入女性从业人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
        ],
        '企业经营状态': [
          { required: true, message: '请选择企业经营状态', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.$utils.removeItem('long')
    const query = this.$route.query
    // 新增与编辑都先做一次省局数据赋值
    if (this.$utils.getItem('reportData')) {
      this.form = {
        ...this.form,
        ...this.$utils.getItem('reportData')
      }
      this.bizName = this.$utils.getItem('reportData').企业类型
      this.name = this.$utils.getItem('reportData').企业名称
      this.setCompanyInfo()
    }
    if (query.ident) { // 有ident，根据ident去开放平台拿数据
      getOrderInfo(query.ident).then(res => {
        this.form = {
          ...this.form,
          ...res.inData
        }
        this.name = res.inData.企业名称
        this.bizName = res.inData.企业类型
        this.setCompanyInfo()
      })
    }
    if (query.draftNumber) { // 有draftNumber，获取草稿详情
      draftDetail(query.draftNumber).then(res => {
        this.form = {
          ...this.form,
          ...res.outData.draftData
        }
        this.draftNumber = res.outData.draftNumber
        this.name = res.outData.name
        this.bizName = res.outData.bizName
      })
    }
  },
  methods: {
    resetForm() {
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    // 分页缓存赋值，如已提交申请记得清除companyInfo
    setCompanyInfo() {
      if (this.$utils.getItem('companyInfo')) {
        this.form = {
          ...this.form,
          ...this.$utils.getItem('companyInfo')
        }
      }
      this.resetForm()
    },
    handleSetInt(key) {
      this.form[key] = parseInt(this.form[key])
    },
    submitForm(formName) {
      this.$refs[formName].validate(async(valid, object) => {
        if (!valid) {
          // this.$utils.showError('请根据提示完善表单信息！')
          this.$utils.scrollView(object, this)
          return
        }
        // 更新form到缓存、
        this.$utils.setItem('companyInfo', this.form)
        this.saveDraftForm(formName)
      })
    },
    // 暂存草稿
    saveDraftForm(type) {
      const params = {
        job: 'EC_BIZBOX_DRAFT_SAVE',
        inData: {
          userToken: this.$utils.getLocalItem('token'),
          bizPushTime: (Date.parse(new Date())) / 1000,
          bizName: this.bizName,
          bizStateName: '草稿',
          bizCode: this.$utils.getBizCode().cooperative, // 获取对应类型年报的Code
          name: this.name,
          zgdw: '市场监督局',
          businessType: '1',
          draftData: this.form,
          draftNumber: this.draftNumber
        }
      }
      this.$api.startJob(params).then(res => {
        if (res.state === 'successful') { // 跳转到下一页
          if (type === 'draft') {
            this.draftNumber = res.outData.draftNumber
            this.$utils.showSuccess('已存至草稿箱')
          } else {
            this.$router.push('/report/cooperativeProperty?draftNumber=' + res.outData.draftNumber + '&pageOrigin=' + this.$route.query.pageOrigin)
          }
        } else {
          this.$utils.showError(res.errMsg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .companyMessage{
    width: 100%;
    min-height: 100vh;
    overflow: auto;
    .companyMessageMain{
      text-align: center;
        .top{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 47px;
        margin-bottom: 40px;
        div:first-child{
          font-size: 32px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          line-height: 54px;
          color: #464646;
          opacity: 1;
        }
        div:last-child{
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          line-height: 27px;
          color: #464646;
          opacity: 1;
        }
      }
      ::v-deep .report_form{
        margin-top: 60px;
        width: 1178px;
        text-align: center;
        margin: auto;
        text-align: left;
        .el-form-item{
          display: inline-block;
          .el-form-item__label{
            font-size: 13px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.9);
            opacity: 1;
          }
          .el-input__inner{
            width: 300px;
            height: 45px;
          }
          .el-textarea__inner{
            width: 300px;
          }
          .el-radio{
            margin-right: 5px;
          }
          .el-form-item__label-wrap{
            margin-left: 0 !important;
          }
          .el-form-item__content{
            margin-left: 126px !important;
          }
        }
        .p1{
          font-size: 18px;
          font-family: Source Han Sans CN;
          font-weight: 500;
          line-height: 31px;
          color: #000000;
          opacity: 1;
          margin-bottom: 40px;
        }
        .infoContainer{
          display: flex;
          flex-wrap: wrap;
          p{
            padding-left: 126px;
            font-size: 18px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            line-height: 24px;
            color: rgba(0, 0, 0, 0.9);
            opacity: 1;
            padding-bottom: 24px;
          }
          .info{
            display: inline-block;
            width: 50%;
            .label{
              padding-left: 0;
            }
            .info-main{
              display: flex;
              justify-content: space-around;
              .el-form-item{
                .el-form-item__label-wrap{
                   margin-left: 0 !important;
                }
                .el-form-item__content{
                  margin-left: 64px !important;
                }
                .el-input__inner{
                  width: 168px;
                }
              }
            }
          }
        }
        .communistInfo{
          display: flex;
          flex-direction: column;
          .communistInfo-main{
            display: flex;
            .tzone{
              margin-left: 215px;
            }
            .tztwo{
              margin-left: 314px;
            }
            .el-form-item__content{
              margin-left: 0px !important;
            }
            .el-form-item__label-wrap{
              margin-right: 135px;
            }
            .organizationName{
              display: block;
            }
          }
        }
      }
    }
  }
</style>