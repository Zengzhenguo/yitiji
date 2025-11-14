<template>
  <div class="shareholderInfor-main">
    <!-- <PageHeader /> -->
    <div class="mainContainer">
      <div class="top">
        <div>AI辅助开办，智能秒批</div>
        <div>一表填报，智能辅助，轻松打照</div>
      </div>
      <Breadcrumb style="text-align:left;border-bottom:1px solid #ccc;margin-bottom:60px;" />
      <el-form ref="ruleForm" :model="form" :rules="rules" class="report_form" label-width="auto" label-position="left">
        <div v-for="(item,index) in form['股东信息']" :key="'股东信息' + index">
          <div class="title">
            <span>股东信息{{ 1 + index }}</span>
            <span @click="handleDelField('股东信息',index)">删除</span>
          </div>
          <el-row>
            <el-col :span="12" style="text-align:end;">
              <el-form-item label="股东姓名或名称:">
                <el-input v-model="item['股东姓名或名称']" placeholder="请输入股东姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="认缴出资额（人民币万元）:">
                <el-input v-model="item['认缴出资额']" placeholder="请输入认缴出资额" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="认缴出资时间:">
                <el-date-picker
                  v-model="item['认缴出资时间']"
                  type="year"
                  :editable="false"
                  placeholder="请选择认缴出资时间"
                  :picker-options="handleSetDisabled"
                  value-format="yyyy"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实缴出资额（人民币万元）:">
                <el-input v-model="item['实缴出资额']" placeholder="请输入实缴出资额" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="认缴出资方式" class="moreOption">
                <el-checkbox-group v-model="item['认缴出资方式']">
                  <div class="optionItem">
                    <el-checkbox label="货币" />
                    <el-checkbox label="实物" />
                    <el-checkbox label="知识产权" />
                    <el-checkbox label="债券" />
                    <el-checkbox label="股权" />
                    <el-checkbox label="高新技术成果" />
                    <el-checkbox label="劳务" />
                    <el-checkbox label="其他" />
                    <el-checkbox label="土地使用权" />
                  </div>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实缴出资方式" class="moreOption">
                <el-checkbox-group v-model="item['实缴出资方式']">
                  <div class="optionItem">
                    <el-checkbox label="货币" />
                    <el-checkbox label="实物" />
                    <el-checkbox label="知识产权" />
                    <el-checkbox label="债券" />
                    <el-checkbox label="股权" />
                    <el-checkbox label="高新技术成果" />
                    <el-checkbox label="劳务" />
                    <el-checkbox label="其他" />
                    <el-checkbox label="土地使用权" />
                  </div>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="实缴出资时间:">
                <el-date-picker
                  v-model="item['实缴出资时间']"
                  type="year"
                  :editable="false"
                  placeholder="请选择实缴出资时间"
                  :picker-options="handleSetDisabled"
                  value-format="yyyy"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="本年度是否发生股权转让">
                <el-radio v-model="item['股权转让']" label="是">是</el-radio>
                <el-radio v-model="item['股权转让']" label="否">否</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="股权变更日期:">
                <el-date-picker
                  v-model="item['股权变更日期']"
                  type="year"
                  :editable="false"
                  placeholder="请选择股权变更日期"
                  :picker-options="handleSetDisabled"
                  value-format="yyyy"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="变更前股东比例:">
                <el-input v-model="item['变更前股东比例']" placeholder="请输入变更前股东比例" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" style="text-align:end;">
              <el-form-item label="变更后股东比例:">
                <el-input v-model="item['变更后股东比例']" placeholder="请输入变更后股东比例" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="addWebShop">
          <span @click="handleAddField('股东信息')">添加股东</span>
        </div>
        <el-form-item style="display:block;" class="button">
          <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader/index'
import Breadcrumb from '@/components/Breadcrumb/index'
import { draftDetail } from '@/api'
export default {
  components: {
    PageHeader,
    Breadcrumb
  },
  data() {
    return {
      handleSetDisabled: {
        disabledDate(time) { // 返回禁用日期
          return time.getFullYear() > 2021 || time.getFullYear() < 2021
        }
      },
      form: {
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
            },
            '股权变更日期': '',
            '变更前股权比例': '',
            '变更后股权比例': ''
          }
        ]
      },
      rules: {

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
  methods: {
    // 添加字段
    handleAddField(key) {
      switch (key) {
        case '股东信息':
          this.form['股东信息'].push({
            '股东姓名或名称': '',
            '认缴出资额': '',
            '认缴出资时间': '',
            '认缴出资方式': ['货币'],
            '实缴出资额': '',
            '实缴出资时间': '',
            '实缴出资方式': ['货币'],
            '股权变更日期': '',
            '变更前股权比例': '',
            '变更后股权比例': '',
            'inData': {
              '有限责任公司本年度是否发生股东股权转让': '否'
            }
          })
          break
        default:
          break
      }
    },
    // 删除字段
    handleDelField(key, index) {
      if (this.form['股东信息'].length > 1) {
        this.form[key].splice(index, 1)
      } else {
        this.$utils.showError('至少需要填写一个股东信息')
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async(valid, object) => {
        if (!valid) {
          // this.$utils.showError('请根据提示完善表单信息！')
          this.$utils.scrollView(object, this)
          return
        }
        const names = []
        const eqNames = []
        this.form['股东信息'].forEach(item => {
          if (parseFloat(item['实缴出资额']) > parseFloat(item['认缴出资额'])) {
            names.push(item['股东姓名或名称'])
          }
          if (item.inData['有限责任公司本年度是否发生股东股权转让'] === '是' && item['变更前股权比例'] === item['变更后股权比例']) {
            eqNames.push(item['股东姓名或名称'])
          }
        })
        if (names.length) {
          return this.$utils.showError(`实缴出资额不能大于认缴出资额，请修改${names.join('、')}信息！`)
        }
        if (eqNames.length) {
          return this.$utils.showError(`变更前股权比例不能等于变更后股权比例，请修改${eqNames.join('、')}信息！`)
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
            this.$router.push('/report/assetInfo?draftNumber=' + res.outData.draftNumber + '&pageOrigin=' + this.$route.query.pageOrigin)
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
  .shareholderInfor-main{
    width: 100%;
    min-height: 100vh;
    overflow: auto;
    .mainContainer{
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
        .button{
          .el-form-item__content{
            margin-left: 0 !important;
          }
        }
        .addWebShop{
        text-align: center;
        margin-bottom: 20px;
        span{
          font-size: 18px;
          font-family: Source Han Sans CN;
          font-weight: 500;
          line-height: 31px;
          color: #3274F0;
          cursor: pointer;
        }
      }
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
        .el-form-item{
          display: inline-block;
          .el-input__inner{
            width: 300px;
            height: 45px;
          }
        }
        .moreOption{
          .el-form-item__label-wrap{
            margin-left: 185px !important;
          }
          .el-form-item__content{
            clear: both;
          }
          .optionItem{
            display: flex;
            flex-wrap: wrap;
          }
        }
      }
    }
  }
</style>
