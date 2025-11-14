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
        <el-form-item label="是否存在分支机构">
          <el-radio v-model="form['是否存在分支机构']" label="是">是</el-radio>
          <el-radio v-model="form['是否存在分支机构']" label="否">否</el-radio>
        </el-form-item>
        <template v-if="form['是否存在分支机构'] === '是'">
          <div v-for="(item,index) in form['分支机构']" :key="'分支机构' + index">
            <div class="title">
              <span>分支机构{{ index + 1 }}</span>
              <span @click="handleDelField('分支机构',index,'是否存在分支机构')">删除</span>
            </div>
            <el-form-item
              :ref="'分支机构.' + index + '.分支机构名'"
              label="分支机构名"
              :prop="'分支机构.' + index + '.分支机构名'"
              :rules="{
                required: true, message: '请输入分支机构名', trigger: 'blur'
              }"
            >
              <el-input v-model.trim="item['分支机构名']" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item
              :ref="'分支机构.' + index + '.统一社会信用代码/注册号'"
              label="统一社会信用代码/注册号"
              :prop="'分支机构.' + index + '.统一社会信用代码/注册号'"
              :rules="{
                required: true, message: '请输入统一社会信用代码/注册号', trigger: 'blur'
              }"
            >
              <el-input v-model.trim="item['统一社会信用代码/注册号']" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </div>
          <!-- <div class="add-btn" @click="handleAddField('分支机构')">添加分支机构</div> -->
        </template>
        <div class="addWebShop">
            <span @click="handleAddField('分支机构')">添加分支机构</span>
        </div>
        <el-form-item label="是否有行政许可">
          <el-radio v-model="form['是否有行政许可']" label="是">是</el-radio>
          <el-radio v-model="form['是否有行政许可']" label="否">否</el-radio>
        </el-form-item>
        <template v-if="form['是否有行政许可'] === '是'">
          <div v-for="(item,index) in form['行政许可']" :key="'行政许可' + index">
            <div class="title">
              <span>网站或网店{{ index + 1 }}</span>
              <span @click="handleDelField('行政许可',index,'是否有行政许可')">删除</span>
            </div>
            <el-form-item
              :ref="'行政许可.' + index + '.行政许可名称'"
              label="行政许可名称"
              :prop="'行政许可.' + index + '.行政许可名称'"
              :rules="{
                required: true, message: '请输入行政许可名称', trigger: 'blur'
              }"
            >
              <el-input v-model.trim="item['行政许可名称']" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item
              :ref="'行政许可.' + index + '.有效期至'"
              label="有效期至"
              :prop="'行政许可.' + index + '.有效期至'"
              :rules="{
                required: true, message: '请输入有效期至', trigger: 'change'
              }"
            >
              <el-date-picker
                v-model="item['有效期至']"
                type="date"
                placeholder="请选择"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </div>
          <!-- <div class="add-btn" @click="handleAddField('行政许可')">添加行政许可</div> -->
        </template>
        <div class="addWebShop">
          <span @click="handleAddField('行政许可')">添加行政许可</span>
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
import { cooperativeReportApply, draftDetail } from '@/api'
import Breadcrumb from '@/components/Breadcrumb/index'
// import { Popup, Toast } from 'vant'
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
        ]
      },
      rules: {
        '办理使用登记特种设备总台数': [
          { required: true, message: '请输入办理使用登记特种设备总台数', trigger: 'change' }
        ],
        '检验有效期内特种设备总台数': [
          { required: true, message: '请输入检验有效期内特种设备总台数', trigger: 'change' }
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
        case '分支机构':
          this.form[key].push({
            '分支机构名': '',
            '统一社会信用代码/注册号': ''
          })
          break
        case '行政许可':
          this.form[key].push({
            '行政许可名称': '',
            '有效期至': ''
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
        // const dateValidate1 = [] // 校验截止时间是否小于开始时间
        // const dateValidate2 = [] // 校验截止时间是否小于开始时间
        // const dateValidate3 = [] // 校验截止时间是否小于开始时间
        if (data['是否有网站或网店'] === '否') {
          delete data['网站或网店']
        }
        if (data['是否有特种设备'] === '否') {
          data['办理使用登记特种设备总台数'] = 0
          data['检验有效期内特种设备总台数'] = 0
        }
        if (data['是否存在分支机构'] === '否') {
          delete data['分支机构']
        }
        if (data['是否有行政许可'] === '否') {
          delete data['行政许可']
        }
        data.token = this.$utils.getLocalItem('token')
        // 更新到草稿
        this.saveDraftForm(formName, data)
      })
    },
    applyAction(data) {
      cooperativeReportApply(data).then(res => {
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