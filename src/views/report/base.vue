<template>
  <div class="baseContainer">
    <!-- <PageHeader /> -->
    <div class="base-main">
      <div class="top">
        <div>AI辅助开办，智能秒批</div>
        <div>一表填报，智能辅助，轻松打照</div>
      </div>
      <Breadcrumb style="text-align:left;border-bottom:1px solid #ccc;margin-bottom:60px;" />
      <el-form ref="ruleForm" :model="form" :rules="rules" class="companyForm" label-width="auto" label-position="left">
        <!-- <el-form-item label="企业名称:" prop="entname">
          <el-input v-model.trim="form.entname" placeholder="请输入企业名称" clearable />
        </el-form-item> -->
        <el-form-item label="统一社会信用代码:" prop="uniscid">
          <el-input v-model.trim="form.uniscid" placeholder="请输入企业名称" clearable />
        </el-form-item>
        <el-form-item label="企业联络员身份证号码:" prop="idCard">
          <el-input v-model.trim="form.idCard" maxlength="18" placeholder="请输入企业联络员身份证号码" clearable />
        </el-form-item>
        <el-form-item v-if="!isOverTime" style="display:block;">
          <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
        </el-form-item>
        <el-form-item v-if="isOverTime" class="z_button_group">
          <el-button type="info" disabled>{{ theYear - 1 }}年度的年报已暂停报送</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader/index'
import Breadcrumb from '@/components/Breadcrumb/index'
import { queryCompanyInfo, filterCompanyInfo, checkID, canSumbitYearReport } from '@/api'
import { setChineseField, filterPageName } from '@/filters'
export default {
  components: {
    PageHeader,
    Breadcrumb
  },
  data() {
    return {
      form: {
        type: 0,
        idCard: '', // 联络员身份证
        // entname: '', // 企业名称
        uniscid: '' // 信用代码
      },
      theYear: new Date().getFullYear(),
      rules: {
        uniscid: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'change' }
        ],
        entname: [
          { required: true, message: '请输入企业名称', trigger: 'change' }
        ],
        idCard: [
          { required: true, message: '请输入企业联络员身份证号码', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    // 是否截至，6月30日- 7月15日禁止
    isOverTime() {
      const date = new Date()
      return (date.getMonth() + 1 === 6 && date.getDate() === 30 && date.getHours() >= 20) || (date.getMonth() + 1 === 7 && date.getDate() < 15)
    },
    // 是否显示年报截止提示，6月号前提示
    isShowWriteTip() {
      const date = new Date();
      return (date.getMonth() + 1) === 6 && (date.getDate() <= 30 && date.getHours() < 20);
    }

  },
  mounted() {
    const year = this.theYear
    if (this.isOverTime) {
      this.$alert(`
        <div class="p1">湖北省市场监督管理局：</div>
        <div class="p2">${year - 1}年度的年报公示已于<span style="color: red">${year}年6月30日20时截止</span>，国家企业信用信息公示系统(湖北)的年报填报功能已暂时关闭。</div>
        <div class="p2">未按时年报的企业、农民专业合作社将按规定列入经营异常名录，个体工商户将标记为经营异常状态，并通过公示系统进行公示。</div>
        <div class="p2">根据《企业经营异常名录管理暂行办法》等相关规定，为了做好未年报市场主体的异常名录列入工作，7月1日至14日期间，年报填报入口将暂时关闭，预计7月15日重新开放。市场主体在补报年报后，可向登机机关申请移出经营异常名录或恢复正常记载状态。</div>
        `, '温馨提示', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true,
        center: true,
        customClass: 'z-alert',
        callback: action => {
          // this.$message({ type: 'info', message: `action: ${action}` })
        }
      })
      return
    }
    if (this.isShowWriteTip) {
      this.$alert(`
        <div class="p1">湖北省市场监督管理局：</div>
        <div class="p2">${year - 1}年度的年报公示将于<span style="color: red">${year}年6月30日20时截止</span>，届时将关闭${year - 1}年度的年报填报入口。</div>
        <div class="p2">未按时年报的企业、农民专业合作社将按规定列入经营异常名录，个体工商户将标记为经营异常状态，并通过公示系统进行公示。</div>
        <div class="p2">根据《企业经营异常名录管理暂行办法》等相关规定，为了做好未年报市场主体的异常名录列入工作，7月1日至14日期间，年报填报入口将暂时关闭，预计7月15日重新开放。市场主体在补报年报后，可向登机机关申请移出经营异常名录或恢复正常记载状态。</div>
        `, '温馨提示', {
        confirmButtonText: '我已了解',
        dangerouslyUseHTMLString: true,
        center: true,
        customClass: 'z-alert',
        callback: action => {
          // this.$message({ type: 'info', message: `action: ${action}` })
        }
      })
    }
    if (process.env.NODE_ENV === 'development') {
      this.form.idCard = '632825198208210012' // 联络员身份证，441426197702130038
      // this.form.entname = '武汉网融信息科技有限公司' // 企业名称
      this.form.uniscid = '91420100MA4KXWBXXR' // 信用代码 92420115MA4E5CD422
    }
    this.$utils.removeItem('long')
  },
  methods: {
    filterCompanyInfo(name) {
      return new Promise(resolve => {
        filterCompanyInfo(this.form).then(res => {
          if (+res.code === 200) {
            // 如果含有企业信息，返回true
            if (res.data === true) {
              this.$router.push('/404')
            } else {
              this.$router.push({ // 跳转至填写须知，带类型
                path: `/report/fillInfo?busiType=${filterPageName(name)}`
              })
            }
          }
        })
      })
    },
    // 需要填报的年份
    canSumbitYearReport() {
      return new Promise((resolve) => {
        canSumbitYearReport({ '企业联络员身份证号码': this.form.idCard,
          '统一社会信用代码': this.form.uniscid }).then(res => {
          if (res.outData['流程状态'] === '成功') {
            // console.log(res.outData['返回值'])
            resolve(res.outData['返回值'])
          } else {
            this.$utils.showError(res.outData['返回值'])
          }
        })
      })
    },
    checkID() {
      const params = {
        xydm: this.form.uniscid,
        idcade: this.form.idCard,
        name: this.form.entname
      }
      return new Promise(resolve => {
        checkID(params).then(res => {
          // 单独处理一下403，抛出异常
          if (res && res.errCode === '403') {
            resolve('授权已过期，请重新登录')
          }
          if (res.outData && res.outData.result) { // 校验正确
            resolve('')
          } else if (res.outData && !res.outData.result) { // 校验失败
            resolve(res.outData.explain)
          } else { // 其他情况
            resolve('公示系统繁忙，请稍后再试')
          }
        }).catch(() => {
          resolve('公示系统繁忙，请稍后再试')
        })
      })
    },
    submitForm(formName) {
      // this.$router.push({path: `/report/instructions?busiType=single`})
      // return
      this.$refs[formName].validate(async valid => {
        if (!valid) {
          this.$utils.showError('请根据提示完善表单信息！')
          return
        }
        if (!this.$utils.regExp('idCard', this.form.idCard)) {
          return this.$utils.showError('企业联络员身份证号码格式不正确')
        }
        // // 填写信息合理则走以下流程
        // let bool = false // 默认可访问
        // if (+this.form.type === 1) { // 过滤企业信息
        //   bool = await this.filterCompanyInfo()
        // }
        // if (bool) {
        //   return this.$utils.showError('当前企业请到PC端《国家企业信用信息公示系统（湖北）》填报')
        // }
        // 验证填写信息是否合理
        const errMsg = await this.checkID()
        if (errMsg) { // 有错误信息返回则中止流程
          this.$utils.showError(errMsg)
        } else {
          this.canSumbitYearReport().then(res => {
            console.log(res)
            this.$utils.setItem('reportYear', res)
            // true则要去PC办理，false为正常企业
            queryCompanyInfo(this.form).then(res => {
              const year = new Date(parseFloat(res.data.estdate)).getFullYear()
              if (+year === new Date().getFullYear()) {
                return this.$utils.showError('本年度新注册市场主体，无需办理年报')
              }
              /**
               * 个体户年报入口，且类型不是个体工商户，拦截
               * 企业年报入口，且类型不包含有限责任公司和股份有限公司，拦截
               */
              res.data.name = res.data.name.replace('（', '(')
              res.data.name = res.data.name.replace('）', ')')
              // if ((!+this.form.type && res.data.name !== '个体工商户') || (+this.form.type && res.data.name !== '有限责任公司(自然人独资)' && res.data.name !== '有限责任公司(自然人投资或控股)')) {
              //   return this.$utils.showError('市场主体类型不匹配，请重新选择办理入口')
              // }
              this.$utils.setItem('reportTitle', res.data.name)
              const nameArr = ['个体工商户', '个人独资企业', '有限责任公司(自然人独资)', '有限责任公司(自然人投资或控股)', '有限责任公司分公司(自然人投资或控股)', '农民专业合作社']
              if (res.flag === 200) {
                if (nameArr.includes(res.data.name)) {
                  // 如果有缓存数据，清除后重新进入
                  this.$utils.removeItem('companyInfo')
                  // 对数据进行中英文映射
                  this.$utils.setItem('reportData', setChineseField(res.data))
                  // // 填写信息合理则走以下流程
                  if (res.data.name !== '个体工商户') {
                    this.filterCompanyInfo(res.data.name) // 过滤企业
                  } else {
                    this.$router.push({ // 跳转至填写须知，带类型
                      path: `/report/fillInfo?busiType=${filterPageName(res.data.name)}`
                    })
                  }
                } else {
                  this.$router.push('/404')
                }
              } else {
                this.$utils.showError('服务器异常，请稍后重试！')
              }
            }).catch(() => {
              // location.href = `${window.location.origin + this.$utils.getPrefix()}/form-design-h5/#/?formID=${this.id}&isShowMsg=true&type=${this.form.type}&token=${this.$utils.getLocalItem('token')}`
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.baseContainer{
  width: 100%;
  min-height: 100vh;
  overflow: auto;
  .base-main{
    text-align: center;
    .top {
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
    ::v-deep .el-form{
      margin-top: 60px;
      width: 1178px;
      text-align: center;
      margin: auto;
      .el-form-item{
        display: inline-block;
        .el-input__inner{
          width: 496px;
          height: 45px;
        }
      }
    }
  }
}
</style>
