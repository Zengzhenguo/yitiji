<template>
  <div class="companyMessage">
    <!-- <PageHeader /> -->
    <div class="companyMessageMain">
      <div class="top">
        <div>AI辅助开办，智能秒批</div>
        <div>一表填报，智能辅助，轻松打照</div>
      </div>
      <Breadcrumb style="text-align:left;border-bottom:1px solid #ccc;margin-bottom:60px;" />
      <el-form ref="ruleForm" :model="form" :rules="rules" class="report_form">
        <el-form-item label="是否有网站或网店">
          <el-radio v-model="form['是否有网站或网店']" label="是">是</el-radio>
          <el-radio v-model="form['是否有网站或网店']" label="否">否</el-radio>
        </el-form-item>
        <template v-if="form['是否有网站或网店'] === '是'">
          <div v-for="(item,index) in form['网站或网店']" :key="'网站' + index">
            <div class="cell">
              <div>网站或网店 {{ 1 + index }}</div>
              <span class="del-btn" @click="handleDelField('网站或网店',index)">删除</span>
            </div>
            <el-form-item
              :ref="'网站或网店.' + index + '.网站或网店名称'"
              label="网站或网店名称"
              :prop="'网站或网店.' + index + '.网站或网店名称'"
              :rules="{
                required: true, message: '请输入网站或网店名称', trigger: 'blur'
              }"
            >
              <el-input v-model="item['网站或网店名称']" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item
              :ref="'网站或网店.' + index + '.网站或网店网址'"
              label="网站或网店网址"
              :prop="'网站或网店.' + index + '.网站或网店网址'"
              :rules="{
                required: true, message: '请输入网站或网店网址', trigger: 'blur'
              }"
            >
              <el-input v-model="item['网站或网店网址']" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item
              :ref="'网站或网店.' + index + '.网站或网店类型'"
              label="网站或网店类型"
              :prop="'网站或网店.' + index + '.网站或网店类型'"
              :rules="{
                required: true, message: '请选择网站或网店类型', trigger: 'change'
              }"
            >
              <el-select v-model="item['网站或网店类型']" placeholder="请选择">
                <el-option label="网站" value="网站" />
                <el-option label="网店" value="网店" />
              </el-select>
            </el-form-item>
          </div>
          <div class="add-btn" @click="handleAddField('网站或网店')">添加网站或网店</div>
        </template>
        <el-form-item label="是否有特种设备">
          <el-radio v-model="form['是否有特种设备']" label="是">是</el-radio>
          <el-radio v-model="form['是否有特种设备']" label="否">否</el-radio>
        </el-form-item>
        <template v-if="form['是否有特种设备'] === '是'">
          <div class="desc">
            1、办理使用登记特种设备总台(套)数：特种设备使用单位办理使用登记的特种设备数量，包括锅炉、压力容器(不含气瓶)、电梯、起重机械、大型游乐设施、客运索道和场(厂)内专用机动车辆，由实际办理使用登记手续的单位填报。没有上述使用登记设备的填“0”。
          </div>
          <div class="desc">
            2、检验有效期内特种设备总台(套)数：特种设备使用单位已办理使用登记并在检验合格有效期内的特种设备数量，包括锅炉、压力容器(不含气瓶)、电梯、起重机械、大型游乐设施、客运索道和场(厂)内专用机动车辆。
          </div>
          <el-form-item ref="办理使用登记特种设备总台数" label="办理使用登记特种设备总台数（台套数）" prop="办理使用登记特种设备总台数">
            <el-input v-model.trim="form['办理使用登记特种设备总台数']" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item ref="检验有效期内特种设备总台数" label="检验有效期内特种设备总台数（台套数）" prop="检验有效期内特种设备总台数">
            <el-input v-model.trim="form['检验有效期内特种设备总台数']" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </template>
        <el-form-item label="是否有行政许可">
          <el-radio v-model="form['是否有行政许可']" label="是">是</el-radio>
          <el-radio v-model="form['是否有行政许可']" label="否">否</el-radio>
        </el-form-item>
        <template v-if="form['是否有行政许可'] === '是'">
          <div v-for="(item,index) in form['行政许可信息']" :key="'行政许可' + index">
            <div class="cell">
              <div>行政许可信息 {{ 1 + index }}</div>
              <span class="del-btn" @click="handleDelField('行政许可信息',index)">删除</span>
            </div>
            <el-form-item
              :ref="'行政许可信息.' + index + '.许可名称'"
              label="许可名称"
              :prop="'行政许可信息.' + index + '.许可名称'"
              :rules="{
                required: true, message: '请输入许可名称', trigger: 'blur'
              }"
            >
              <el-input v-model.trim="item['许可名称']" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item
              :ref="'行政许可信息.' + index + '.有效期止'"
              label="有效期止"
              :prop="'行政许可信息.' + index + '.有效期止'"
              :rules="{
                required: true, message: '请选择有效期止', trigger: 'blur'
              }"
            >
              <el-date-picker
                v-model="item['有效期止']"
                type="date"
                placeholder="请选择"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="add-btn" @click="handleAddField('行政许可信息')">添加行政许可</div>
        </template>
        <el-form-item class="z_button_group">
          <el-button type="primary" @click="submitForm('ruleForm')">提交并公示</el-button>
          <el-button @click="saveDraftForm('draft')">暂存草稿</el-button>
        </el-form-item>
      </el-form>
      <van-popup
        v-model="dialogVisible"
        class="success-dialog"
        :close-on-click-overlay="false"
      >
        <div class="submit-tips">
          <img src="../../assets/images/success.png">
          <div>提交成功</div>
        </div>
        <div class="dialog-btns">
          <el-button class="plain" type="primary" @click="$router.replace('/?pageType=report')">返回首页</el-button>
          <el-button class="plain" type="primary" @click="handleGoDetail">查看进度</el-button>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { personReportApply, draftDetail } from '@/api'
import Breadcrumb from '@/components/Breadcrumb/index'
import { Loading } from 'element-ui';
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      handleSetDisabled: {
        disabledDate(time) { // 返回禁用日期
          return time.getFullYear() > 2021 || time.getFullYear() < 2021
        }
      },
      dialogVisible: false,
      ident: '', // 开放平台ident
      draftNumber: '', // 草稿箱编号
      name: '', // 办事主体
      bizName: '', // 事项名称
      form: {
        '是否有特种设备': '否',
        '办理使用登记特种设备总台数': '',
        '检验有效期内特种设备总台数': '',
        '是否有网站或网店': '否',
        '是否有行政许可': '否',
        '行政许可信息': [
          {
            '许可名称': '',
            '有效期止': ''
          }
        ],
        '网站或网店': [
          {
            '网站或网店名称': '',
            '网站或网店网址': '',
            '网站或网店类型': ''
          }
        ]
      },
      id: '', // 表单系统ID
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
    this.$utils.removeItem('long')
    const query = this.$route.query
    if (this.$utils.getItem('companyInfo')) {
      // 赋值
      this.form = {
        ...this.form,
        ...this.$utils.getItem('companyInfo')
      }
    }
    if (query.draftNumber && query.pageOrigin === 'draftBox') { // 有draftNumber，且来源草稿，就获取草稿详情
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
    handleGoDetail() {
      let loadingInstance = Loading.service({text: '准备跳转，请稍后'});
      setTimeout(() => {
        loadingInstance.close()
        this.$router.replace(`/officeBox/progressDetails?ident=${this.ident}&bizName=个体工商户公示信息填报`)
      }, 1500)
    },
    handleSetInt(key) {
      this.form[key] = parseInt(this.form[key])
    },
    // 添加字段
    handleAddField(key) {
      switch (key) {
        case '网站或网店':
          this.form['网站或网店'].push({
            '网站或网店名称': '',
            '网站或网店网址': '',
            '网站或网店类型': ''
          })
          break
        case '行政许可信息':
          this.form['行政许可信息'].push({
            '许可名称': '',
            '有效期止': ''
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
    submitForm(formName) {
      this.$refs[formName].validate(async(valid, object) => {
        if (!valid) {
          // this.$utils.showError('请根据提示完善表单信息！')
          this.$utils.scrollView(object, this)
          return
        }
        const data = JSON.parse(JSON.stringify(this.form))
        if (data['是否有网站或网店'] === '否') {
          delete data['网站或网店']
        }
        if (data['是否有行政许可'] === '否') {
          delete data['行政许可信息']
        }
        if (data['是否有特种设备'] === '否') {
          data['办理使用登记特种设备总台数'] = 0
          data['检验有效期内特种设备总台数'] = 0
        }
        data.token = this.$utils.getLocalItem('token')
        // 更新到草稿
        this.saveDraftForm(formName, data)
      })
    },
    // 提价并公示
    appltAction(data) {
      personReportApply(data).then(res => {
        this.dialogVisible = true
        this.ident = res.ident
        this.$api.startJob({ job: 'EC_BIZBOX_DRAFT_DELETE', inData: { draftNumber: this.$route.query.draftNumber }})
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
          this.draftNumber = res.outData.draftNumber
          if (type === 'draft') {
            this.$utils.showSuccess('已存至草稿箱')
          } else {
            this.appltAction(data)
          }
        } else {
          this.$utils.showError(res.errMsg)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.companyMessage{
    width: 100%;
    min-height: 100vh;
    overflow: auto;
  }
.companyMessageMain{
  text-align: center;
}
.report_form{
  padding: 15px;
  .el-form-item{
    margin-bottom: 15px;
  }
  .z_date {
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .p1 {
    font-weight: bold;
    font-size: 16px;
    color: #606266;
  }
  .label {
    font-size: 14px;
    color: #606266;
    font-weight: bold;
  }
  .add-btn {
    color: #025BFF;
    font-size: 14px;
    text-align: center;
    padding-bottom: 15px;
  }
  .cell {
    display: flex;
    height: 20px;
    align-items: center;
    font-size: 14px;
    padding-bottom: 15px;
    div {
      flex: 1;
    }
    span {
      color: #025BFF;
    }
  }
  .desc {
    font-size: 14px;
    color: #606266;
    line-height: 24px;
    padding-bottom: 10px;
  }
}
.z_button_group{
  padding-top: 30px;
  .el-button{
    width: 100%;
    margin-bottom: 15px;
    margin-left: 0;
  }
}
.success-dialog {
  width: 90%;
  text-align: center;
  padding: 20px 0;
  border-radius: 4px;
  .submit-tips {
    font-size: 16px;
    img {
      width: 80px;
      height: 80px;
    }
    div {
      font-weight: bold;
      padding: 20px 0;
    }
  }
  .dialog-btns {
    display: flex;
    justify-content: space-around;
  }
}
</style>
<style lang="scss">
.report_form {
  .el-form-item__label {
    width: 100%;
    text-align: left;
    line-height: 30px;
  }
  .el-input,.el-select {
    width: 100%;
  }
  .el-radio {
    margin-right: 10px;
  }
}
</style>
