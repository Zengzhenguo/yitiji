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
            <el-form-item ref="统一社会信用代码" label="统一社会信用代码" prop="统一社会信用代码">
              <el-input v-model.trim="form['统一社会信用代码']" placeholder="请输入" clearable />
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
            <el-form-item ref="邮政编码" label="邮政编码" prop="邮政编码">
              <el-input v-model.trim="form['邮政编码']" placeholder="请输入" clearable />
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
            <el-form-item label="企业经营状态" prop="企业经营状态">
              <el-select v-model="form['企业经营状态']" placeholder="请选择">
                <el-option label="开业" value="开业" />
                <el-option label="歇业" value="歇业" />
                <el-option label="停业" value="停业" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item ref="营业额或营业收入" label="营业额或营业收入（人民币万元）" prop="营业额或营业收入">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-input v-model="form['营业额或营业收入']" type="number" placeholder="请输入" clearable></el-input>
            </el-col>
            <el-col :span="12">
              <el-radio v-model="form['营业额或营业收入是否公示']" label="公示">公示</el-radio>
              <el-radio v-model="form['营业额或营业收入是否公示']" label="不公示">不公示</el-radio>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item ref="纳税总额" label="纳税总额（人民币万元）" prop="纳税总额">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-input v-model="form['纳税总额']" type="number" placeholder="请输入" clearable></el-input>
            </el-col>
            <el-col :span="12">
              <el-radio v-model="form['纳税总额是否公示']" label="公示">公示</el-radio>
              <el-radio v-model="form['纳税总额是否公示']" label="不公示">不公示</el-radio>
            </el-col>
          </el-row>
        </el-form-item> -->
        <p class="p1">以下为不公示信息</p>
        <div class="infoContainer">
          <div class="info">
            <p class="label">高校毕业生人数（人）</p>
            <div class="info-main">
              <el-form-item ref="高校毕业生经营者人数" class="other-clo" label="经营者" prop="高校毕业生经营者人数">
                <el-input v-model="form['高校毕业生经营者人数']" type="number" placeholder="请输入" clearable @blur="handleSetInt('高校毕业生经营者人数')" />
              </el-form-item>
              <el-form-item ref="高校毕业生雇员人数" class="other-clo" label="雇员" prop="高校毕业生雇员人数">
                <el-input v-model="form['高校毕业生雇员人数']" type="number" placeholder="请输入" clearable @blur="handleSetInt('高校毕业生雇员人数')" />
              </el-form-item>
            </div>
          </div>
          <div class="info">
            <p class="label">退役士兵人数（人）</p>
            <div class="info-main">
              <el-form-item ref="退役士兵经营者人数" class="other-clo" label="经营者" prop="退役士兵经营者人数">
                <el-input v-model="form['退役士兵经营者人数']" type="number" placeholder="请输入" clearable @blur="handleSetInt('退役士兵经营者人数')" />
              </el-form-item>
              <el-form-item ref="退役士兵雇员人数" class="other-clo" label="雇员" prop="退役士兵雇员人数">
                <el-input v-model="form['退役士兵雇员人数']" type="number" placeholder="请输入" clearable @blur="handleSetInt('退役士兵雇员人数')" />
              </el-form-item>
            </div>
          </div>
          <div class="info">
            <p class="label">残疾人人数（人）</p>
            <div class="info-main">
              <el-form-item ref="残疾人经营者人数" class="other-clo" label="经营者" prop="残疾人经营者人数">
                <el-input v-model="form['残疾人经营者人数']" type="number" placeholder="请输入" clearable @blur="handleSetInt('残疾人经营者人数')" />
              </el-form-item>
              <el-form-item ref="残疾人雇员人数" class="other-clo" label="雇员" prop="残疾人雇员人数">
                <el-input v-model="form['残疾人雇员人数']" type="number" placeholder="请输入" clearable @blur="handleSetInt('残疾人雇员人数')" />
              </el-form-item>
            </div>
          </div>
          <div class="info">
            <p class="label">失业人员再就业人数（人）</p>
            <div class="info-main">
              <el-form-item ref="失业人员再就业经营者人数" class="other-clo" label="经营者" prop="失业人员再就业经营者人数">
                <el-input v-model="form['失业人员再就业经营者人数']" type="number" placeholder="请输入" clearable @blur="handleSetInt('失业人员再就业经营者人数')" />
              </el-form-item>
              <el-form-item ref="失业人员再就业雇员人数" class="other-clo" label="雇员" prop="失业人员再就业雇员人数">
                <el-input v-model="form['失业人员再就业雇员人数']" type="number" placeholder="请输入" clearable @blur="handleSetInt('失业人员再就业雇员人数')" />
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="communistInfo">
          <div class="communistInfo-main">
            <el-form-item ref="中共党员（包括预备党员）人数" label="中共党员（包括预备党员）人数（人）" prop="中共党员（包括预备党员）人数">
              <el-input v-model="form['中共党员（包括预备党员）人数']" type="number" placeholder="请输入" clearable @blur="handleSetInt('中共党员（包括预备党员）人数')" />
            </el-form-item>
            <el-form-item label="党组织建制" class="tzone">
              <div class="organizationName">
                <el-radio v-model="form['党组织建制']" label="未成立党组织">未成立党组织</el-radio>
                <el-radio v-model="form['党组织建制']" label="党委">党委</el-radio>
                <el-radio v-model="form['党组织建制']" label="党总支">党总支</el-radio>
                <el-radio v-model="form['党组织建制']" label="党支部">党支部</el-radio>
              </div>
            </el-form-item>
          </div>
          <div class="communistInfo-main">
            <el-form-item label="法定代表人是否为党员">
              <el-radio v-model="form['法定代表人是否为党员']" label="是">是</el-radio>
              <el-radio v-model="form['法定代表人是否为党员']" label="否">否</el-radio>
            </el-form-item>
            <el-form-item label="法定代表人是否为党组织书记" class="tztwo">
              <el-radio v-model="form['法定代表人是否为党组织书记']" label="是">是</el-radio>
              <el-radio v-model="form['法定代表人是否为党组织书记']" label="否">否</el-radio>
            </el-form-item>
          </div>
        </div>
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
import PageHeader from '@/components/PageHeader/index'
import Breadcrumb from '@/components/Breadcrumb/index'
import { getOrderInfo, draftDetail } from '@/api'
export default {
  components: {
    PageHeader,
    Breadcrumb
  },
  data() {
    const { validateField } = this.$utils
    const checkCount = (rule, value, callback) => {
      if (parseInt(value) > parseInt(this.form['从业人数'])) {
        callback(new Error(`不得大于从业人数`))
      } else {
        callback()
      }
    }
    let timeArr = this.$utils.getItem('reportYear')
    return {
      handleSetDisabled: {
        disabledDate(time) { // 返回禁用日期
          return !timeArr.includes(time.getFullYear())
          // return time.getFullYear() > 2021 || time.getFullYear() < 2021
        }
      },
      form: {
        '经营者名称': '',
        '企业名称': '',
        '资金数额': '',
        '企业联络员身份证号码': '',
        '股东信息': [
          {
            '股东姓名或名称': '',
            '认缴出资额': '',
            '认缴出资时间': '',
            '认缴出资方式': ['货币'],
            '实缴出资额': '',
            '实缴出资时间': '',
            '实缴出资方式': ['货币'],
            'inData': {
              '有限责任公司本年度是否发生股东股权转让': '否'
            }
          }
        ],
        '资产总额': '',
        '所有者权益合计': '',
        '负债总额': '',
        '营业总收入': '',
        '其中主营业务收入': '',
        '利润总额': '',
        '净利润': '',
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
        '是否充装单位': '否',
        '是否生成疫苗': '否',
        '是否有投资信息或购买其他公司股权': '否',
        '是否对外担保': '否',
        '充装单位许可证信息': [
          {
            '许可证名称': '',
            '许可证编号': '',
            '有效期': [
              '',
              ''
            ]
          }
        ],
        '疫苗生产许可证信息': [
          {
            '许可证名称': '',
            '许可证编号': '',
            '有效期': [
              '',
              ''
            ]
          }
        ],
        '对外投资信息': [
          {
            '投资设立企业或购买股权企业名称': '',
            '统一社会信用代码/注册号': ''
          }
        ],
        '网站或网店': [
          {
            '网站或网店名称': '',
            '网站或网店网址': '',
            '网站或网店类型': ''
          }
        ],
        '担保信息': [
          {
            '债权人': '',
            '债务人': '',
            '主债券种类': '',
            '主债权数额': '',
            '履行债务的期限': [],
            '保证的期间': '',
            '保证的方式': '',
            '是否公示': '否'
          }
        ],
        '企业通讯地址': '',
        '经营范围': '',
        '邮政编码': '',
        '企业经营状态': '',
        '企业联系电话': '',
        '统一社会信用代码': '',
        '年报年度': String(timeArr[0]),
        '电子邮箱': '',
        '从业人数': '',
        '从业人数是否公示': '不公示',
        '其中女性从业人数': '',
        '女性从业人数是否公示': '不公示',
        '高校毕业生经营者人数': '',
        '高校毕业生雇员人数': '',
        '退役士兵经营者人数': '',
        '退役士兵雇员人数': '',
        '残疾人经营者人数': '',
        '残疾人雇员人数': '',
        '失业人员再就业经营者人数': '',
        '失业人员再就业雇员人数': '',
        '中共党员（包括预备党员）人数': '',
        '党组织建制': '未成立党组织',
        '法定代表人是否为党员': '否',
        '法定代表人是否为党组织书记': '否'
      },
      rules: {
        '年报年度': [
          { required: true, message: '请选择年报年度', trigger: 'change' }
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
        '高校毕业生经营者人数': [
          { required: true, message: '请输入经营者人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
        ],
        '高校毕业生雇员人数': [
          { required: true, message: '请输入雇员人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
        ],
        '退役士兵经营者人数': [
          { required: true, message: '请输入经营者人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
        ],
        '退役士兵雇员人数': [
          { required: true, message: '请输入经营者人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
        ],
        '残疾人经营者人数': [
          { required: true, message: '请输入经营者人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
        ],
        '残疾人雇员人数': [
          { required: true, message: '请输入雇员人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
        ],
        '失业人员再就业经营者人数': [
          { required: true, message: '请输入经营者人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
        ],
        '失业人员再就业雇员人数': [
          { required: true, message: '请输入雇员人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
        ],
        '中共党员（包括预备党员）人数': [
          { required: true, message: '请输入中共党员（包括预备党员）人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
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
          this.$utils.showError('请根据提示完善表单信息！')
          // this.$utils.scrollView(object, this)
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
          bizCode: this.$utils.getBizCode().company,
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
            this.$router.push('/report/shareholderInfor?draftNumber=' + res.outData.draftNumber + '&pageOrigin=' + this.$route.query.pageOrigin)
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
