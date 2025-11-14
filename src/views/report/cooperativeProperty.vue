<template>
  <div class="assetInfoContainer">
    <!-- <PageHeader /> -->
    <div class="assetInfo-main">
      <div class="top">
        <div>AI辅助开办，智能秒批</div>
        <div>一表填报，智能辅助，轻松打照</div>
      </div>
      <Breadcrumb style="text-align:left;border-bottom:1px solid #ccc;margin-bottom:60px;" />
      <el-form ref="ruleForm" :model="form" :rules="rules" class="report_form" label-width="auto" label-position="left">
        <p class="p1" style="margin-bottom:30px;">资产状况信息</p>
        <el-row>
          <el-col :span="12">
            <el-form-item ref="销售额或营业收入" label="销售额或营业收入（人民币万元）" prop="销售额或营业收入">
              <el-row>
                <el-col :span="12">
                  <el-input v-model="form['销售额或营业收入']" type="number" placeholder="请输入" clearable></el-input>
                </el-col>
                <el-col :span="12">
                  <el-radio v-model="form['销售额或营业收入是否公示']" label="是">公示</el-radio>
                  <el-radio v-model="form['销售额或营业收入是否公示']" label="否">不公示</el-radio>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item ref="盈余总额" label="盈余总额（人民币万元）" prop="盈余总额">
              <el-row>
                <el-col :span="12">
                  <el-input v-model="form['盈余总额']" type="number" placeholder="请输入" clearable></el-input>
                </el-col>
                <el-col :span="12">
                  <el-radio v-model="form['盈余总额是否公示']" label="是">公示</el-radio>
                  <el-radio v-model="form['盈余总额是否公示']" label="否">不公示</el-radio>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item ref="纳税总额" label="纳税总额（人民币万元）" prop="纳税总额">
              <el-row >
                <el-col :span="12">
                  <el-input v-model="form['纳税总额']" type="number" placeholder="请输入" clearable></el-input>
                </el-col>
                <el-col :span="12">
                  <el-radio v-model="form['纳税总额是否公示']" label="是">公示</el-radio>
                  <el-radio v-model="form['纳税总额是否公示']" label="否">不公示</el-radio>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item ref="获得政府扶持资金" label="获得政府扶持资金、补助（人民币万元）" prop="获得政府扶持资金">
              <el-row>
                <el-col :span="12">
                  <el-input v-model="form['获得政府扶持资金']" type="number" placeholder="请输入" clearable></el-input>
                </el-col>
                <el-col :span="12">
                  <el-radio v-model="form['获得政府扶持资金是否公示']" label="是">公示</el-radio>
                  <el-radio v-model="form['获得政府扶持资金是否公示']" label="否">不公示</el-radio>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item ref="金融贷款" label="金融贷款（人民币万元）" prop="金融贷款">
              <el-row>
                <el-col :span="12">
                  <el-input v-model="form['金融贷款']" type="number" placeholder="请输入" clearable></el-input>
                </el-col>
                <el-col :span="12">
                  <el-radio v-model="form['金融贷款是否公示']" label="是">公示</el-radio>
                  <el-radio v-model="form['金融贷款是否公示']" label="否">不公示</el-radio>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
        <p class="p1" style="margin-bottom:30px;">社保信息</p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="城镇职工基本养老保险（人）:" prop="城镇职工基本养老保险">
              <el-input v-model.trim="form['城镇职工基本养老保险']" placeholder="请输入资产总额" clearable @blur="handleSetInt('城镇职工基本养老保险')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="失业保险（人）:" prop="失业保险">
              <el-input v-model.trim="form['失业保险']" placeholder="请输入所有者权益合计" clearable @blur="handleSetInt('失业保险')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职工基本医疗保险（人）:" prop="职工基本医疗保险">
              <el-input v-model.trim="form['职工基本医疗保险']" placeholder="请输入负债总额" clearable @blur="handleSetInt('职工基本医疗保险')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工伤保险（人）:" prop="工伤保险">
              <el-input v-model.trim="form['工伤保险']" placeholder="请输入营业总收入" clearable @blur="handleSetInt('工伤保险')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生育保险（人）:" prop="生育保险">
              <el-input v-model.trim="form['生育保险']" placeholder="请输入其中主营业务收入" clearable @blur="handleSetInt('生育保险')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="单位缴费基数:" prop="单位缴费基数" class="p1">
          <el-radio v-model="form['单位缴费基数是否公示']" label="公示">公示</el-radio>
          <el-radio v-model="form['单位缴费基数是否公示']" label="不公示">不公示</el-radio>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位参加城镇职工基本养老保险缴纳基数（人民币万元）:" prop="单位参加城镇职工基本养老保险缴纳基数">
              <el-input v-model.trim="form['单位参加城镇职工基本养老保险缴纳基数']" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位参加失业保险缴费基数（人民币万元）:" prop="单位参加失业保险缴费基数">
              <el-input v-model.trim="form['单位参加失业保险缴费基数']" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位参加职工基本医疗保险缴费基数（人民币万元）:" prop="单位参加职工基本医疗保险缴费基数">
              <el-input v-model.trim="form['单位参加职工基本医疗保险缴费基数']" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位参加生育保险缴费基数（人民币万元）:" prop="单位参加生育保险缴费基数">
              <el-input v-model.trim="form['单位参加生育保险缴费基数']" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="本期实际缴费金额:" prop="本期实际缴费金额" class="p1">
          <el-radio v-model="form['本期实际缴费金额是否公示']" label="公示">公示</el-radio>
          <el-radio v-model="form['本期实际缴费金额是否公示']" label="不公示">不公示</el-radio>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="参加城镇职工基本养老保险本期实际缴费金额（人民币万元）:" prop="参加城镇职工基本养老保险本期实际缴费金额">
              <el-input v-model.trim="form['参加城镇职工基本养老保险本期实际缴费金额']" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参加失业保险本期实际缴费金额（人民币万元）:" prop="参加失业保险本期实际缴费金额">
              <el-input v-model.trim="form['参加失业保险本期实际缴费金额']" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="参加职工基本医疗保险本期实际缴费金额（人民币万元）:" prop="参加职工基本医疗保险本期实际缴费金额">
              <el-input v-model.trim="form['参加职工基本医疗保险本期实际缴费金额']" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参加工伤保险本期实际缴费金额（人民币万元）:" prop="参加工伤保险本期实际缴费金额">
              <el-input v-model.trim="form['参加工伤保险本期实际缴费金额']" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="参加生育保险本期实际缴费金额（人民币万元）:" prop="参加生育保险本期实际缴费金额">
              <el-input v-model.trim="form['参加生育保险本期实际缴费金额']" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="单位累计欠缴金额:" prop="单位累计欠缴金额" class="p1">
          <el-radio v-model="form['单位累计欠缴金额是否公示']" label="公示">公示</el-radio>
          <el-radio v-model="form['单位累计欠缴金额是否公示']" label="不公示">不公示</el-radio>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位参加城镇职工基本养老保险累计欠缴金额（人民币万元）:" prop="单位参加城镇职工基本养老保险累计欠缴金额">
              <el-input v-model.trim="form['单位参加城镇职工基本养老保险累计欠缴金额']" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位参加失业保险累计欠缴金额（人民币万元）:" prop="单位参加失业保险累计欠缴金额">
              <el-input v-model.trim="form['单位参加失业保险累计欠缴金额']" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位参加职工基本医疗保险累计欠缴金额（人民币万元）:" prop="单位参加职工基本医疗保险累计欠缴金额">
              <el-input v-model.trim="form['单位参加职工基本医疗保险累计欠缴金额']" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位参加工伤保险累计欠缴金额（人民币万元）:" prop="单位参加工伤保险累计欠缴金额">
              <el-input v-model.trim="form['单位参加工伤保险累计欠缴金额']" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位参加生育保险累计欠缴金额（人民币万元）:" prop="单位参加生育保险累计欠缴金额">
              <el-input v-model.trim="form['单位参加生育保险累计欠缴金额']" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="z_button_group">
          <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
          <el-button @click="saveDraftForm('draft')">暂存草稿</el-button>
      </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { draftDetail } from '@/api'
import Breadcrumb from '@/components/Breadcrumb/index'
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      form: {
        '销售额或营业收入': '',
        '销售额或营业收入是否公示': '否',
        '盈余总额': '',
        '盈余总额是否公示': '否',
        '纳税总额': '',
        '纳税总额是否公示': '否',
        '获得政府扶持资金': '',
        '获得政府扶持资金是否公示': '否',
        '金融贷款': '',
        '金融贷款是否公示': '否',
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
        '单位累计欠缴金额是否公示': '否'
      },
      rules: {
        '销售额或营业收入': [
          { required: true, message: '请输入销售额或营业收入', trigger: 'change' }
        ],
        '盈余总额': [
          { required: true, message: '请输入盈余总额', trigger: 'change' }
        ],
        '纳税总额': [
          { required: true, message: '请输入纳税总额', trigger: 'change' }
        ],
        '获得政府扶持资金': [
          { required: true, message: '请输入获得政府扶持资金', trigger: 'change' }
        ],
        '金融贷款': [
          { required: true, message: '请输入金融贷款', trigger: 'change' }
        ],
        '城镇职工基本养老保险': [
          { required: true, message: '请输入城镇职工基本养老保险', trigger: 'change' }
        ],
        '失业保险': [
          { required: true, message: '请输入失业保险', trigger: 'change' }
        ],
        '职工基本医疗保险': [
          { required: true, message: '请输入职工基本医疗保险', trigger: 'change' }
        ],
        '工伤保险': [
          { required: true, message: '请输入工伤保险', trigger: 'change' }
        ],
        '生育保险': [
          { required: true, message: '请输入生育保险', trigger: 'change' }
        ],
        '单位参加城镇职工基本养老保险缴费基数': [
          { required: true, message: '请输入单位参加城镇职工基本养老保险缴费基数', trigger: 'change' }
        ],
        '单位参加失业保险缴费基数': [
          { required: true, message: '请输入单位参加失业保险缴费基数', trigger: 'change' }
        ],
        '单位参加职工基本医疗保险缴费基数': [
          { required: true, message: '请输入单位参加职工基本医疗保险缴费基数', trigger: 'change' }
        ],
        '单位参加生育保险缴费基数': [
          { required: true, message: '请输入单位参加生育保险缴费基数', trigger: 'change' }
        ],
        '参加城镇职工基本养老保险本期实际缴费金额': [
          { required: true, message: '请输入参加城镇职工基本养老保险本期实际缴费金额', trigger: 'change' }
        ],
        '参加失业保险本期实际缴费金额': [
          { required: true, message: '请输入参加失业保险本期实际缴费金额', trigger: 'change' }
        ],
        '参加职工基本医疗保险本期实际缴费金额': [
          { required: true, message: '请输入参加职工基本医疗保险本期实际缴费金额', trigger: 'change' }
        ],
        '参加工伤保险本期实际缴费金额': [
          { required: true, message: '请输入参加工伤保险本期实际缴费金额', trigger: 'change' }
        ],
        '参加生育保险本期实际缴费金额': [
          { required: true, message: '请输入参加生育保险本期实际缴费金额', trigger: 'change' }
        ],
        '单位参加城镇职工基本养老保险累计欠缴金额': [
          { required: true, message: '请输入单位参加城镇职工基本养老保险累计欠缴金额', trigger: 'change' }
        ],
        '单位参加失业保险累计欠缴金额': [
          { required: true, message: '请输入单位参加失业保险累计欠缴金额', trigger: 'change' }
        ],
        '单位参加职工基本医疗保险累计欠缴金额': [
          { required: true, message: '请输入单位参加职工基本医疗保险累计欠缴金额', trigger: 'change' }
        ],
        '单位参加工伤保险累计欠缴金额': [
          { required: true, message: '请输入单位参加工伤保险累计欠缴金额', trigger: 'change' }
        ],
        '单位参加生育保险累计欠缴金额': [
          { required: true, message: '请输入单位参加生育保险累计欠缴金额', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    if (this.$utils.getItem('companyInfo')) {
      // 赋值
      this.form = {
        ...this.form,
        ...this.$utils.getItem('companyInfo')
      }
      if (this.$route.query.pageOrigin === 'undefined' || this.$route.query.pageOrigin === undefined) {
        this.form['城镇职工基本养老保险'] = this.form['从业人数']
        this.form['失业保险'] = this.form['从业人数']
        this.form['职工基本医疗保险'] = this.form['从业人数']
        this.form['工伤保险'] = this.form['从业人数']
        this.form['生育保险'] = this.form['从业人数']
      }
    }
    if (this.$route.query.draftNumber && this.$route.query.pageOrigin === 'draftBox') { // 有draftNumber，且来源草稿，就获取草稿详情
      draftDetail(this.$route.query.draftNumber).then(res => {
        this.form = {
          ...this.form,
          ...res.outData.draftData
        }
      })
    }
  },
  methods: {
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
        // 更新form到缓存
        this.$utils.setItem('companyInfo', this.form)
        this.saveDraftForm(formName)
      })
    },
    // 暂存草稿
    saveDraftForm(type) {
      const params = {
        job: 'EC_BIZBOX_DRAFT_SAVE',
        inData: {
          bizPushTime: (Date.parse(new Date())) / 1000,
          userToken: this.$utils.getLocalItem('token'),
          draftData: this.form,
          draftNumber: this.$route.query.draftNumber
        }
      }
      this.$api.startJob(params).then(res => {
        if (res.state === 'successful') { // 跳转到下一页
          if (type === 'draft') {
            this.$utils.showSuccess('已存至草稿箱')
          } else {
            this.$router.push('/report/cooperativeOtherInfo?draftNumber=' + res.outData.draftNumber + '&pageOrigin=' + this.$route.query.pageOrigin)
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
  .assetInfoContainer{
    width: 100%;
    min-height: 100vh;
    overflow: auto;
    .assetInfo-main{
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
            display: block;
            width: 185px;
          }
          .el-form-item__content{
            margin-left: 185px !important;
          }
        }
        .p1{
          .el-form-item__label{
            font-size: 18px;
            font-family: Source Han Sans CN;
            font-weight: 500;
            line-height: 31px;
            color: #000000;
            opacity: 1;
          }
          &::after{
            display: block;
            content: '';
            width: 1178px;
            border: 1px solid #ccc;
          }
        }
      }
    }
  }
</style>