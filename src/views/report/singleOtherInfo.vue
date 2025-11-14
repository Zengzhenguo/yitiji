<template>
  <div class="mainContainer">
    <!-- <PageHeader /> -->
    <div class="main">
      <div class="top">
        <div>AI辅助开办，智能秒批</div>
        <div>一表填报，智能辅助，轻松打照</div>
      </div>
      <Breadcrumb style="text-align:left;border-bottom:1px solid #ccc;margin-bottom:60px;" />
      <el-form ref="ruleForm" :model="form" :rules="rules" class="optionForm" label-width="auto" label-position="left">
        <el-form-item label="是否有网站或网店:">
          <el-radio v-model="form['是否有网站或网店']" label="是">是</el-radio>
          <el-radio v-model="form['是否有网站或网店']" label="否">否</el-radio>
        </el-form-item>
        <template v-if="form['是否有网站或网店'] === '是'">
          <div v-for="(webItem,index) in form['网站或网店']" :key="'网站'+index" class="webSiteContainer">
            <div class="title">
              <span>网站或网店{{ index + 1 }}</span>
              <span @click="handleDelField('网站或网店',index,'是否有网站或网店')">删除</span>
            </div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="网站或网店名称:">
                  <el-input v-model="webItem['网站或网店名称']" placeholder="请输入网站或网店名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="网站或网店网址:">
                  <el-input v-model="webItem['网站或网店网址']" placeholder="请输入网站或网店网址" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="网站或网店类型:">
                  <el-select v-model="webItem['网站或网店类型']" placeholder="请选择网站或网店类型">
                    <el-option label="网站" value="网站" />
                    <el-option label="网店" value="网店" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </template>
        <div class="addWebShop">
          <span @click="handleAddField('网站或网店')">添加网站或网店</span>
        </div>
        <div class="equipmentInfo">
          <el-form-item label="是否特种设备:">
            <el-radio v-model="form['是否有特种设备']" label="是">是</el-radio>
            <el-radio v-model="form['是否有特种设备']" label="否">否</el-radio>
          </el-form-item>
          <template v-if="form['是否有特种设备'] === '是'">
            <div style="font-size: 13px;font-family: Source Han Sans CN;font-weight: 400;line-height: 31px;color: rgba(0, 0, 0, 0.9);">
              1、办理使用登记特种设备总台（套）数：特种设备使用单位办理使用登记的特种设备数量，包括锅炉、压力容器（不含气瓶）、电梯、起重机械、大型游乐设施、
              客运索道和场（厂）内专用机动车辆，由实际办理使用登记手续的单位填报，没有上述使用登记设备的填“0”。
            </div>
            <div style="font-size: 13px;font-family: Source Han Sans CN;font-weight: 400;line-height: 31px;color: rgba(0, 0, 0, 0.9);">
              2、检验有效期内特种设备总台（套）数：特种设备使用单位已办理使用登记并在检验合格有效期内的特种设备数量，包括锅炉、压力容器（不含气瓶）、电梯、
              起重机械、大型游乐设施、客运索道和场（厂）内专用机动车辆。
            </div>
            <el-row style="margin-top: 22px">
              <el-col :span="12">
                <el-form-item label="办理使用登记特种设备总台数:">
                  <el-input v-model="form['办理使用登记特种设备总台数']" placeholder="请输入办理使用登记特种设备总台数" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="检验有效期内特种设备总台数:">
                  <el-input v-model="form['检验有效期内特种设备总台数']" placeholder="请输入检验有效期内特种设备总台数" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </div>
        <el-form-item label="是否生产疫苗:">
          <el-radio v-model="form['是否生产疫苗']" label="是">是</el-radio>
          <el-radio v-model="form['是否生产疫苗']" label="否">否</el-radio>
        </el-form-item>
        <template v-if="form['是否生产疫苗'] === '是'">
          <div v-for="(item,index) in form['疫苗生产许可证信息']" :key="'疫苗生产许可证信息'+index" class="vaccineMain">
            <div class="title">
              <span>疫苗生产许可证{{ index + 1 }}</span>
              <span @click="handleDelField('疫苗生产许可证信息',index,'是否生产疫苗')">删除</span>
            </div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="许可名称:">
                  <el-input v-model.trim="item['许可证名称']" placeholder="请输入许可名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="许可编号:">
                  <el-input v-model.trim="item['许可证编号']" placeholder="请输入许可编号" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="有效期:">
                  <el-date-picker
                    v-model="item['有效期起']"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </template>
        <div class="addWebShop">
          <span @click="handleAddField('疫苗生产许可证信息')">添加疫苗生产许可</span>
        </div>
        <el-form-item label="是否充装单位:">
          <el-radio v-model="form['是否充装单位']" label="是">是</el-radio>
          <el-radio v-model="form['是否充装单位']" label="否">否</el-radio>
        </el-form-item>
        <template v-if="form['是否充装单位'] === '是'">
          <div v-for="(item,index) in form['充装单位许可证信息']" :key="'充装单位许可证信息'+index" class="vaccineMain">
            <div class="title">
              <span>充装单位许可证{{ index + 1 }}</span>
              <span @click="handleDelField('充装单位许可证信息',index,'是否充装单位')">删除</span>
            </div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="许可名称:">
                  <el-input v-model="item['许可证名称']" placeholder="请输入许可名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="许可编号:">
                  <el-input v-model="item['许可证编号']" placeholder="请输入许可编号" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="有效期:">
                  <el-date-picker
                    v-model="item['有效期止']"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </template>
        <div class="addWebShop">
          <span @click="handleAddField('充装单位许可证信息')">添加充装单位许可</span>
        </div>
        <el-form-item label="是否有对外担保:">
          <el-radio v-model="form['是否对外担保']" label="是">是</el-radio>
          <el-radio v-model="form['是否对外担保']" label="否">否</el-radio>
        </el-form-item>
        <template v-if="form['是否对外担保'] === '是'">
          <div v-for="(item,index) in form['担保信息']" :key="'担保信息'+index" class="guaranteeMain">
            <div class="title">
              <span>担保{{ index + 1 }}</span>
              <span @click="handleDelField('担保信息',index,'是否对外担保')">删除</span>
            </div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="债权人:">
                  <el-input v-model="item['债权人']" placeholder="请输入债权人" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="债务人:">
                  <el-input v-model="item['债务人']" placeholder="请输入债务人" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="主债券种类:">
                  <el-select v-model="item['主债券种类']" placeholder="请选择主债权种类">
                    <el-option label="合同" value="合同" />
                    <el-option label="其他" value="其他" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="主债权数额">
                  <el-input v-model="item['主债权数额']" placeholder="请输入主债权数额" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="有效期:">
                  <el-date-picker
                    v-model="item['履行债务的期限止']"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保证的期限:">
                  <el-radio v-model="item['保证的期间']" label="期间">期间</el-radio>
                  <el-radio v-model="item['保证的期间']" label="未约定">未约定</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保证的方式">
                  <el-radio v-model="item['保证的方式']" label="一般保证">一般保证</el-radio>
                  <el-radio v-model="item['保证的方式']" label="连带保证">连带保证</el-radio>
                  <el-radio v-model="item['保证的方式']" label="未约定">未约定</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否公示">
                  <el-radio v-model="item['是否公示']" label="是">是</el-radio>
                  <el-radio v-model="item['是否公示']" label="否">否</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </template>
        <div class="addWebShop">
          <span @click="handleAddField('担保信息')">添加担保</span>
        </div>
        <div class="investInfo">
          <el-form-item label="是否有投资信息或购买其他公司股权:">
            <el-radio v-model="form['是否有投资信息或购买其他公司股权']" label="是">是</el-radio>
            <el-radio v-model="form['是否有投资信息或购买其他公司股权']" label="否">否</el-radio>
          </el-form-item>
          <template v-if="form['是否有投资信息或购买其他公司股权'] === '是'">
            <div v-for="(item,index) in form['对外投资信息']" :key="'对外投资信息' + index">
              <div class="title">
                <span>对外投资{{ 1 + index }}</span>
                <span @click="handleDelField('对外投资信息',index,'是否有投资信息或购买其他公司股权')">删除</span>
              </div>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="投资设立企业或购买股权企业名称:">
                    <el-input v-model="item['投资设立企业或购买股权企业名称']" placeholder="请输入投资设立企业或购买股权企业名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="统一社会信用代码/注册号:">
                    <el-input v-model="item['统一社会信用代码/注册号']" placeholder="请输入债务人" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </template>
          <div class="addWebShop">
            <span @click="handleAddField('对外投资信息')">添加对外投资信息</span>
          </div>
        </div>
        <el-button type="primary" style="display: block; margin: auto" @click="submitForm('ruleForm')">提交并公示</el-button>
      </el-form>
    </div>
    <el-dialog
      class="success-dialog"
      :visible.sync="dialogVisible"
      width="506px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="top text-center">
        <img src="../../assets/images/success.png" />
        <p>提交成功</p>
      </div>
      <div class="dialog-btns text-center">
        <el-button class="plain" type="primary" @click="$router.replace('/?pageType=report')">返回首页</el-button>
        <el-button class="plain" type="primary" @click="handleGoDetail">查看进度</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { singleReportApply, draftDetail } from '@/api'
import Breadcrumb from '@/components/Breadcrumb/index'
// import { Popup, Toast, Dialog } from 'vant'
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      ident: '',
      dialogVisible: false,
      form: {
        '是否有网站或网店': '否',
        '网站或网店': [
          {
            '网站或网店名称': '',
            '网站或网店网址': '',
            '网站或网店类型': ''
          }
        ],
        '是否有特种设备': '否',
        '办理使用登记特种设备总台数': '',
        '检验有效期内特种设备总台数': '',
        '是否生成疫苗': '否',
        '疫苗生产许可证信息': [
          {
            '许可证名称': '',
            '许可证编号': '',
            '有效期起': '',
            '有效期止': '',
            '有效期': []
          }
        ],
        '是否充装单位': '否',
        '充装单位许可证信息': [
          {
            '许可证名称': '',
            '许可证编号': '',
            '有效期起': '',
            '有效期止': '',
            '有效期': []
          }
        ],
        '是否有投资信息或购买其他公司股权': '否',
        '对外投资信息': [
          {
            '投资设立企业或购买股权企业名称': '',
            '统一社会信用代码/注册号': ''
          }
        ],
        '是否对外担保': '否',
        '担保信息': [
          {
            '债权人': '',
            '债务人': '',
            '主债券种类': '',
            '主债权数额': '',
            '履行债务的期限': [],
            '履行债务的期限起': '',
            '履行债务的期限止': '',
            '保证的期间': '',
            '保证的方式': '',
            '是否公示': '否'
          }
        ]
      },
      rules: {
        '办理使用登记特种设备总台数': [
          { required: true, message: '请输入办理使用登记特种设备总台数', trigger: 'change' }
        ],
        '检验有效期内特种设备总台数': [
          { required: true, message: '请输入检验有效期内特种设备总台数', trigger: 'change' }
        ]
      },
      dialogData: null
    }
  },
  mounted() {
    if (this.$utils.getItem('companyInfo')) {
      // 赋值
      this.form = {
        ...this.form,
        ...this.$utils.getItem('companyInfo')
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
  beforeDestroy() {
    this.$utils.setItem('companyInfo', this.form)
  },
  methods: {
    handleGoDetail() {
      this.$utils.showLoading({ text: '准备跳转，请稍后' })
      setTimeout(() => {
        this.$utils.hideLoading()
        this.$router.replace(`/officeBox/progressDetails?ident=${this.ident}&bizName=内资企业公示信息填报`)
      }, 1500)
    },
    // 添加字段
    handleAddField(key) {
      switch (key) {
        case '网站或网店':
          this.form[key].push({
            '网站或网店名称': '',
            '网站或网店网址': '',
            '网站或网店类型': ''
          })
          break
        case '疫苗生产许可证信息':
        case '充装单位许可证信息':
          this.form[key].push({
            '许可证名称': '',
            '许可证编号': '',
            '有效期起': '',
            '有效期止': '',
            '有效期': []
          })
          break
        case '对外投资信息':
          this.form[key].push({
            '投资设立企业或购买股权企业名称': '',
            '统一社会信用代码/注册号': ''
          })
          break
        case '担保信息':
          this.form[key].push({
            '债权人': '',
            '债务人': '',
            '主债券种类': '',
            '主债权数额': '',
            '履行债务的期限': [],
            '履行债务的期限起': '',
            '履行债务的期限止': '',
            '保证的期间': '',
            '保证的方式': '',
            '是否公示': '否'
          })
          break
        default:
          break
      }
    },
    // 删除字段
    handleDelField(key, index) {
      this.form[key].splice(index, 1)
    },
    getTime(date) {
      return parseInt(new Date(date).getTime())
    },
    submitForm(formName) {
      this.$refs[formName].validate(async(valid, object) => {
        if (!valid) {
          // this.$utils.showError('请根据提示完善表单信息！')
          this.$utils.scrollView(object, this)
          return
        }
        const data = JSON.parse(JSON.stringify(this.form))
        const dateValidate1 = [] // 校验截止时间是否小于开始时间
        const dateValidate2 = [] // 校验截止时间是否小于开始时间
        const dateValidate3 = [] // 校验截止时间是否小于开始时间
        if (data['是否有网站或网店'] === '否') {
          delete data['网站或网店']
        }
        if (data['是否有特种设备'] === '否') {
          data['办理使用登记特种设备总台数'] = 0
          data['检验有效期内特种设备总台数'] = 0
        }
        if (data['是否生成疫苗'] === '否') {
          delete data['疫苗生产许可证信息']
        } else { // 有效期重新赋值
          data['疫苗生产许可证信息'].forEach((item, index) => {
            item['有效期'] = [item['有效期起'], item['有效期止']]
            if (this.getTime(item['有效期起']) > this.getTime(item['有效期止'])) {
              dateValidate1.push(`疫苗生产许可证信息` + (+index + 1))
            }
          })
        }
        if (data['是否充装单位'] === '否') {
          delete data['充装单位许可证信息']
        } else {
          data['充装单位许可证信息'].forEach((item, index) => {
            item['有效期'] = [item['有效期起'], item['有效期止']]
            if (this.getTime(item['有效期起']) > this.getTime(item['有效期止'])) {
              dateValidate2.push(`充装单位许可证信息` + (+index + 1))
            }
          })
        }
        if (data['是否有投资信息或购买其他公司股权'] === '否') {
          delete data['对外投资信息']
        }
        if (data['是否对外担保'] === '否') {
          delete data['担保信息']
        } else {
          data['担保信息'].forEach((item, index) => {
            item['履行债务的期限'] = [item['履行债务的期限起'], item['履行债务的期限止']]
            if (this.getTime(item['履行债务的期限起']) > this.getTime(item['履行债务的期限止'])) {
              dateValidate3.push(`担保信息` + (+index + 1))
            }
          })
        }
        if (data['是否生成疫苗'] === '是' && dateValidate1.length) {
          return this.$utils.showError(`有效期起时间不得大于有效期止时间，请修改${dateValidate1.join('、')}的信息`)
        }
        if (data['是否充装单位'] === '是' && dateValidate2.length) {
          return this.$utils.showError(`有效期起时间不得大于有效期止时间，请修改${dateValidate2.join('、')}的信息`)
        }
        if (data['是否对外担保'] === '是' && dateValidate3.length) {
          return this.$utils.showError(`履行债务的期限起时间不得大于履行债务的期限止时间，请修改${dateValidate3.join('、')}的信息`)
        }
        data.token = this.$utils.getLocalItem('token')
        // 先用浮点型计算，再保留2位小数转成字符串确定值是否对等
        const all = parseFloat(data['资产总额'])
        const addCount = parseFloat(data['所有者权益合计']) + parseFloat(data['负债总额'])
        if (all.toFixed(6) !== addCount.toFixed(6)) { // 单位是万元
          this.$confirm('资产总额不等于所有者权益合计加负债总额，是否继续', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '是',
            cancelButtonText: '否'
          })
            .then(() => {
              this.applyAction(data)
            })
            .catch(action => {
              this.$utils.setItem('companyInfo', this.form)
            })
          // Dialog({
          //   title: '温馨提示',
          //   message: '资产总额不等于所有者权益合计加负债总额，是否继续',
          //   showCancelButton: true,
          //   confirmButtonText: '是',
          //   cancelButtonText: '否'
          // }).then(() => {
          //   this.applyAction(data)
          // }).catch(() => { // 点击取消，用户有可能返回修改资产，先更新缓存
          //   this.$utils.setItem('companyInfo', this.form)
          // })
          return
        }
        // 更新到草稿
        this.saveDraftForm(formName, data)
      })
    },
    applyAction(data) {
      singleReportApply(data).then(res => {
        if (+res.errCode === 1) {
          this.dialogVisible = true
          this.ident = res.ident
          this.$utils.removeItem('companyInfo')
          this.$api.startJob({ job: 'EC_BIZBOX_DRAFT_DELETE', inData: { draftNumber: this.$route.query.draftNumber }})
        } else {
          this.$utils.showError(res.errMsg)
        }
      })
    },
    // 暂存草稿
    saveDraftForm(type, data = null) {
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
            this.applyAction(data)
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
  .mainContainer{
    width: 100%;
    min-height: 100vh;
    overflow: auto;
    .title{
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      span:first-child{
      padding-left: 5px;
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      line-height: 31px;
      color: #000000;
      &::before{
        display: inline-block;
        content: '';
        width: 3px;
        height: 15px;
        background-color: blue;
        margin-right: 5px;
      }
    }
      span:last-child{
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      line-height: 31px;
      color: #3274F0;
    }
  }
    .main{
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
      ::v-deep .optionForm{
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
          }
          .el-form-item__content{
            margin-left: 126px !important;
          }
        }
        .addWebShop{
          text-align: center;
          span{
            font-size: 18px;
            font-family: Source Han Sans CN;
            font-weight: 500;
            line-height: 31px;
            color: #3274F0;
            cursor: pointer;
          }
          &::after{
            display: block;
            content: '';
            width: 1178px;
            border: 1px solid #C4C4C4;
            margin-top: 32.5px;
            margin-bottom: 30px;
          }
        }
        .equipmentInfo{
          .el-form-item__label-wrap{
            margin-left: 0 !important;
            width: 100px;
            .el-form-item__label{
              line-height: 2;
            }
          }
          &::after{
            display: block;
            content: '';
            width: 1178px;
            border: 1px solid #C4C4C4;
            margin-top: 32.5px;
            margin-bottom: 30px;
          }
        }
        .investInfo{
          .el-form-item__label-wrap{
            margin-left: 0 !important;
            width: 100px;
          }
          .el-form-item__label{
              line-height: 2;
          }
        }
      }
    }
  }
  .success-dialog {
    ::v-deep .el-dialog__header {
      padding: 0;
    }
    .top {
      img {
        width: 86px;
        height: 86px;
        margin-top: 18px;
      }
      p {
        font-size: 28px;
        font-weight: 600;
        color: #333333;
        padding-top: 16px;
        padding-bottom: 30px;
        &.success-tips {
          font-size: 14px;
          font-weight: normal;
          span {
            color: red;
          }
        }
      }
    }
    .dialog-btn {
      padding-bottom: 25px;
      .plain {
        color: #3162E8;
        border-color: #3162E8;
      }
    }
  }
</style>