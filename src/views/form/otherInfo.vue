<template>
  <div class="base-form">
    <!-- <page-header /> -->
    <breadcrumb v-show="$route.query.mode !== 'test'" />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <el-form ref="form" label-position="left" class="form" :model="form" :rules="rules" label-width="94px">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item class="radio" label="经营有效期" label-width="100px">
              <el-radio v-model="form.validDates" label="长期" border>长期</el-radio>
              <el-radio v-model="form.validDates" label="经营期限止" border>经营期限止</el-radio>
            </el-form-item>
          </el-col>
          <el-col v-if="form.validDates === '经营期限止'" :span="12">
            <el-form-item label-width="0">
              <el-date-picker
                v-model="form.endTime"
                :editable="false"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择截止时间"
                :picker-options="newDateOptions"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="出资额" required>
              <el-select v-model="form.currency" placeholder="请选择场所性质">
                <el-option label="人民币" value="人民币" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label-width="0" prop="capital">
              <el-input v-model.trim="form.capital" :disabled="$route.query.bizName==='内资企业辅助开办'||$route.query.bizName==='商事确认一链通'" placeholder="请输入内容" @input="limitInput">
                <template slot="append">万元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="从业人数" prop="employeesCount">
              <el-input v-model.trim="form.employeesCount" placeholder="请填写">
                <template slot="append">(人)</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item class="radio" label="核算方式" prop="computedWays">
              <el-radio v-model="form.computedWays" label="独立核算" border>独立核算</el-radio>
              <el-radio v-model="form.computedWays" label="非独立核算" border>非独立核算</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="营业执照副本数量" label-width="148px">
              <el-select v-model="form.licenseCount" placeholder="请选择营业执照副本数量">
                <el-option label="1" value="1" />
                <el-option label="2" value="2" />
                <!-- <el-option label="3" value="3" /> -->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="$route.query.type !== 'person'">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item class="radio" label="公司章程" prop="constitutionType">
                <el-radio v-model="form.constitutionType" label="使用章程模板" border>使用章程模板</el-radio>
                <!-- <el-radio v-model="form.constitutionType" label="使用自有章程" border>使用自有章程</el-radio> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col v-if="form.constitutionType === '使用自有章程'" :span="24">
              <el-form-item class="radio" label="">
                <upload-code placement="bottom-start" alias="constitutionPdf" @update="updateFileList" />
                <!-- <upload-file :file-paths="PDF.uploadPdfData" :is-constitution-pdf="true" /> -->
              </el-form-item>
            </el-col>
            <div v-if="form.constitutionType === '使用章程模板'" class="radio_group_bottom">
              <el-link type="primary" :underline="false" @click="PDF.isOpen = true;">{{ constitutionName }}</el-link>
            </div>
          </el-row>
        </template>

        <el-form-item class="btn-group text-center" label-width="0">
          <el-button @click="$router.go(0)">刷新当前页面</el-button>
          <el-button @click="handleSaveDraft(true)">暂存草稿</el-button>
          <el-button @click="$router.go(-1)">上一步</el-button>
          <el-button v-if="$route.query.type === 'person' || $route.query.type === 'company'" type="primary" @click="handleNext">下一步，生成表单预览</el-button>
          <el-button v-else type="primary" @click="handleGoAppendPage">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :visible.sync="PDF.isOpen" width="60%">
      <embed
        :src="PDF.url"
        type="application/pdf"
        style="overflow:hidden;width:100%;height:500px;"
      />
    </el-dialog>
  </div>
</template>

<script>
// import PageHeader from '@/components/PageHeader/index'
import Breadcrumb from '@/components/Breadcrumb/index'
// import UploadFile from '@/components/UploadFile/index'
import UploadCode from '@/components/UploadFile/uploadCode'
import { preview, getConstitutionPDF } from '@/api/index'
// import { formatCompanyType } from '@/filters'
export default {
  components: {
    // PageHeader,
    Breadcrumb,
    // UploadFile,
    UploadCode
  },
  data() {
    const chechCapital = (rule, value, callback) => {
      const obj = {
        value: String(value)
      }
      if (obj.value.indexOf('.') >= 0) { // 判断是否有小数点
        // console.log('小数点位置' + obj.value.indexOf('.'))
        // 小数点前9位
        if (obj.value.substring(0, obj.value.indexOf('.')).length > 12) {
          callback(new Error('金额整数不能超过12位，小数部分不能超过6位'))
        }
        // 小数点后六位
        if (obj.value.substring(obj.value.indexOf('.') + 1, obj.value.length).length > 6) {
          callback(new Error('金额整数不能超过12位，小数部分不能超过6位'))
        }
      }
      // 不存在小数点
      if (obj.value.indexOf('.') < 0) {
        if (obj.value.length > 12) {
          callback(new Error('金额整数不能超过12位，小数部分不能超过6位'))
        }
      }
     //给曾都区增加限制
     if(this.$utils.getLocalItem("curArea").defaultValue[1] === "曾都区")
      {
        console.log(111);
        if (value >= 21 && this.$route.query.type === 'person') {
        this.$confirm('申请的注册资本不能大于20万元，请核对注册资本是否无误！', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
          })
          .catch(() => {
            this.form.capital = null
          })
      }
      }

      if (value >= 501 && this.$route.query.type === 'person') {
        this.$confirm('当前申请的注册资本过大，请核对注册资本是否无误！', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
          })
          .catch(() => {
            this.form.capital = null
          })
      }
      callback()
    }
    return {
      // 不可选小于当前日期的
      newDateOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      PDF: {
        isOpen: false,
        uploadPdfData: [],
        url: ''
      },
      form: {
        validDates: '长期', // 经营有效期
        endTime: '', // 截止时间
        capital: '', // 注册资金（上面表单中的注册资金改成出资额）
        currency: '人民币', // 币种
        employeesCount: '', // 从业人数
        computedWays: '独立核算', // 核算方式
        licenseCount: '1', // 营业执照数量
        constitutionType: '使用章程模板', // 是否章程模板
        constitutionPdf: ''
      },
      rules: {
        capital: [
          { required: true, message: '请填写注册资本', trigger: 'change', pattern: /^[1-9]\d*$/ },
          { required: true, validator: chechCapital, trigger: 'change' }
        ],
        employeesCount: [
          { required: true, message: '请填写从业人数', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    inidInfo(){
      return this.$store.state.indid.industryid
    },
    draftInfo() {
      return this.$store.state.draft.draftInfo
    },
    // 章程模板文件名
    constitutionName() {
      const member = this.$utils.getItem('member')
      const nameApply = this.$utils.getItem('nameApply')
      // console.log(member, nameApply)
      const companyType = nameApply.companyType === '一人有限责任公司' ? '一人股东有限公司' : '多人股东有限公司'
      const visitors = member.visitors ? '设监事会' : '不设监事会'
      const directors = member.directors ? '设董事会' : '不设董事会'
      return '《公司章程模板》' + '（' + companyType + '，' + directors + visitors + '）'
    },
    // 计算股东出资总额
    capitalTotal() {
      var total = 0
      if (this.$utils.getItem('member') && (this.$route.query.type === 'company' || this.$route.query.type === 'commercial' || this.$route.query.type === '9210commercial' || this.$route.query.type === 'commercialRegister')) {
        const member = this.$utils.getItem('member')
        let money = 0
        member.memberList.forEach(item => {
          if (item.investors) {
            item.investorsList.forEach(val => {
              money = money + parseFloat(val.money)
            })
          }
        })
        total = money
      }
      return total === +this.form.capital
    },
    constitutionPdfType() {
      const member = this.$utils.getItem('member')
      const nameApply = this.$utils.getItem('nameApply')
      const qz = 'HB_ZC_' // 前缀
      const gd = nameApply.companyType === '一人有限责任公司' ? '1R_' : 'DR_'
      const dsh = member.directors ? 'SDSH_' : 'BSDSH_'
      const jsh = member.visitors ? 'SJSH' : 'BSJSH'
      return qz + gd + dsh + jsh
    }
  },
  async mounted() {
    // 获取章程模板
    // const type = this.constitutionPdfType
    // // console.log(type)
    // const res = await getConstitutionPDF(type)
    // this.PDF.url = this.$utils.getFile(res.outData.pdf)
  },
  activated() {
    // 先给初始值
    this.form.endTime = this.$utils.formatDate(new Date(new Date().getTime() + 90 * 86400000))
    // 获取草稿详情
    if (this.$utils.getItem('draftNumber')) {
      this.$store.dispatch('draft/getDraftDetail', this.$utils.getItem('draftNumber')).then(async res => {
        if (res.otherInfo) {
          this.form = res.otherInfo
        }
        if (res.member && (this.$route.query.type === 'company' || this.$route.query.type === 'commercial')) {
          const member = res.member
          let money = 0
          member.memberList.forEach(item => {
            if (item.investors) {
              item.investorsList.forEach(val => {
                money = money + parseFloat(val.money)
              })
            }
          })
          this.form.capital = money
        }
        if (this.$route.query.type !== 'person') {
          // 获取章程模板
          const type = this.constitutionPdfType
          const res = await getConstitutionPDF(type)
          this.PDF.url = this.$utils.getFile(res.outData.pdf)
        }
      })
    }
  },
  methods: {
    // 保存草稿
    handleSaveDraft(showTips = false) {
      return new Promise((resolve, reject) => {
        const data = {
          ...this.draftInfo, // 原有数据
          otherInfo: this.form, // 现在数据覆盖原有数据
          businessType: this.$route.query.type === 'person' ? '1' : '2',
          showTips // 是否显示提示
        }
        this.$store.dispatch('draft/saveDraft', data).then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 更新扫码上传文件
    updateFileList(val) {
      console.log(val)
      const arr = [
        ...this.PDF.uploadPdfData,
        ...val.data
      ]
      this.PDF.uploadPdfData = arr
    },
    handleNext() {
      console.log('form', this.form)
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const nameApply = this.draftInfo.nameApply // 名称申报
          const address = this.draftInfo.address
          const scope = this.draftInfo.scope
          const member = this.draftInfo.member // 人员信息+设立人员信息,
          // const industryid = this.$utils.getLocalItem("industryid")
          const industryid = JSON.parse(JSON.stringify(localStorage.getItem("industryid")))
          if(!industryid||industryid==null){
            return  this.$utils.showError('缺少industryid字段或为空,请重新提交')
            }
          // 冠省名企业注册资金限制
          // const areaResultList = this.$utils.getItem('areaResultList')[0].children
          // const SFarr = []
          // for (const item of areaResultList) {
          //   SFarr.push(item.value)
          // }
          // if (SFarr.includes(nameApply.companyAreaResult)) {
          //   if (this.form.capital < 100) {
          //     return this.$utils.showWarn('冠省名企业注册资金需要大于100万！')
          //   }
          // }
          if (nameApply.companyAreaResult && nameApply.companyAreaResult.includes('湖北')) {
            // if (this.form.capital < 100) {
            //   return this.$utils.showWarn('冠省名企业注册资金需要大于100万！')
            // }
          }
          if (nameApply.industryFormulated.indexOf('实业') > -1 && this.form.capital < 10000) {
            return this.$utils.showWarn('设立实业公司注册资金必须大于或等于1亿元！')
          }
          if (this.form.capital <= 0) {
            return this.$utils.showWarn('企业注册资金必须大于0！')
          }
          if (this.$route.query.type !== 'person' && !this.capitalTotal) {
            return this.$utils.showWarn('企业注册资金需要等于各股东出资总额！')
          }
          // 公司章程限制
          if (this.PDF.uploadPdfData.length > 1) {
            return this.$utils.showWarn('公司章程PDF文件仅支持上传一份！')
          }
          if (this.form.constitutionType === '使用章程模板') {
            this.form.constitutionPdf = ''
          } else {
            if (!this.PDF.uploadPdfData.length) {
              return this.$utils.showWarn('使用自有章程选项需要手动上传公司章程！')
            }
            this.form.constitutionPdf = this.PDF.uploadPdfData[0]
          }
          if (nameApply.hasRepeatWayFlag) {
            nameApply.orgWay = ''
          }
          // return
          // eslint-disable-next-line no-unreachable
          const data = {
            ...nameApply,
            ...address, // 地址申报
            scope, // 经营范围
            ...member, // 人员信息
            ...this.form, // 其他信息
            endTime: this.form.validDates === '长期' ? '' : this.form.endTime,
            // companyType: formatCompanyType(nameApply.companyType),
            industryType: { // 所选行业类型
              IndustryCode: nameApply.industryFormulated.split('-')[0], // 行业类型对应唯一标识
              IndustryName: nameApply.industryFormulated.split('-')[2], // 行业类型名称
              IndustryId:industryid//行业表述id
            },
            industryFormulated: nameApply.industryFormulated.split('-')[1], // 行业描述
            area: nameApply.area.join(' ')
          }
          if (this.$route.query.type === 'person' && !nameApply.companyName) { // 不核名个体户
            member.memberList.forEach(item => {
              item.jobs.forEach(val => {
                if (val.name === '主要经营者') {
                  data.companyName = item.idcName
                }
              })
            })
          }
          if (this.$route.query.whatfrom === 'jointOffice') {
            const equipment = this.draftInfo.equipment // 设备设施
            const personnel = this.draftInfo.personnel // 安全管理人员和从业人员
            const uploadMaterial = this.draftInfo.uploadMaterial // 材料上传
            const business = this.draftInfo.business // 经营情况
            // 过滤已选中的
            const mainForm = business.mainForm
            const projectForm = business.projectForm.filter(item => item.isSel)
            mainForm.forEach(item => {
              item.childs = item.childs.filter(item => item.isSel)
            })
            projectForm.forEach(item => {
              item.childs = item.childs.filter(item => item.isSel)
            })
            const params = {
              channel: '一体机',
              channelSource: '湖北市场监督融平台',
              channelToken: this.$utils.getLocalItem('token'),
              economicNature: business.economicNature,
              yslbData: {
                ...personnel,
                ...equipment,
                ...uploadMaterial,
                economicNature: business.economicNature,
                mainForm,
                projectForm
              }
            }
            Object.assign(data, params)
          }
          console.log('一事联办参数：', JSON.stringify(data))
          await this.handleSaveDraft()
          this.$utils.setItem('otherInfo', this.form) // 存储其他信息
          this.$loading({ text: '正在获取pdf内容' })
         const tmpCompanyName = JSON.parse(JSON.stringify(this.$utils.getItem('companyName')))
          if(this.$route.query.type === 'person'&& tmpCompanyName){
            data.companyName = JSON.parse(JSON.stringify(this.$utils.getItem('companyName')))
              if(!data.companyName.includes('（个体工商户）')){
              data.companyName = data.companyName +'（个体工商户）'
            }
          }


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
    handleGoAppendPage() {
      if (this.$route.query.type === 'commercial' || this.$route.query.type === '9210commercial' || this.$route.query.type === 'commercialRegister') {
        this.$refs['form'].validate(async valid => {
          if (valid) {
            const nameApply = this.draftInfo.nameApply // 名称申报
            const address = this.draftInfo.address
            const scope = this.draftInfo.scope
            const member = this.draftInfo.member // 人员信息+设立人员信息
            // const industryid = this.$utils.getLocalItem("industryid");
            const industryid = this.$utils.getLocalItem("industryid")
            // 冠省名企业注册资金限制
            // const areaResultList = this.$utils.getItem('areaResultList')[0].children
            // const SFarr = []
            // for (const item of areaResultList) {
            //   SFarr.push(item.value)
            // }
            // if (SFarr.includes(nameApply.companyAreaResult)) {
            //   if (this.form.capital < 100) {
            //     return this.$utils.showWarn('冠省名企业注册资金需要大于100万！')
            //   }
            // }
            if (nameApply.companyAreaResult && nameApply.companyAreaResult.includes('湖北')) {
              // if (this.form.capital < 100) {
              //   return this.$utils.showWarn('冠省名企业注册资金需要大于100万！')
              // }
            }
            if (nameApply.industryFormulated.indexOf('实业') > -1 && this.form.capital < 10000) {
              return this.$utils.showWarn('设立实业公司注册资金必须大于或等于1亿元！')
            }
            if (this.form.capital <= 0) {
              return this.$utils.showWarn('企业注册资金必须大于0！')
            }
            if (this.$route.query.type !== 'person' && !this.capitalTotal) {
              return this.$utils.showWarn('企业注册资金需要等于各股东出资总额！')
            }
            // 公司章程限制
            if (this.PDF.uploadPdfData.length > 1) {
              return this.$utils.showWarn('公司章程PDF文件仅支持上传一份！')
            }
            if (this.form.constitutionType === '使用章程模板') {
              this.form.constitutionPdf = ''
            } else {
              if (!this.PDF.uploadPdfData.length) {
                return this.$utils.showWarn('使用自有章程选项需要手动上传公司章程！')
              }
              this.form.constitutionPdf = this.PDF.uploadPdfData[0]
            }
            // return
            // eslint-disable-next-line no-unreachable
            const data = {
              ...nameApply,
              ...address, // 地址申报
              scope, // 经营范围
              ...member, // 人员信息
              ...this.form, // 其他信息
              endTime: this.form.validDates === '长期' ? '' : this.form.endTime,
              // companyType: formatCompanyType(nameApply.companyType),
              industryType: { // 所选行业类型
                IndustryCode: nameApply.industryFormulated.split('-')[0], // 行业类型对应唯一标识
                IndustryName: nameApply.industryFormulated.split('-')[2], // 行业类型名称
                IndustryId:industryid
              },
              industryFormulated: nameApply.industryFormulated.split('-')[1], // 行业描述
              area: nameApply.area.join(' ')
            }
            if (this.$route.query.type === 'person' && !nameApply.companyName) { // 不核名个体户
              member.memberList.forEach(item => {
                item.jobs.forEach(val => {
                  if (val.name === '主要经营者') {
                    data.companyName = item.idcName
                  }
                })
              })
            }
            console.log('一事联办参数：', JSON.stringify(data))
            await this.handleSaveDraft()
            this.$utils.setItem('otherInfo', this.form) // 存储其他信息

            // 06-17 硚口区商事主体登记功能调整
            if (this.$utils.getLocalItem('curArea').district === '硚口区') {
              this.$router.push({ path: '/form/businessHandling', query: { ...this.$route.query }})
              return
            }

            const nextPageBox = this.draftInfo.businessShow
            if (nextPageBox.gzchecked) {
              this.$router.push({ path: '/form/seal', query: { ...this.$route.query }})
              return
            }
            if (nextPageBox.sbchecked) {
              this.$router.push({ path: '/form/socialSecurity', query: { ...this.$route.query }})
              return
            }
            if (nextPageBox.swchecked) {
              this.$router.push({ path: '/form/taxAdministration', query: { ...this.$route.query }})
              return
            }
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
            console.log(this.draftInfo.businessShow)
          } else {
            this.$utils.showError('请按提示信息补充完整表单！')
          }
        })
        return
      }
      this.$router.push(`/form/condition?type=${this.$route.query.type}`)
    },
    limitInput(value) {
      // const str = (value && value.split('')) || []
      // const reg1 = /\d/
      // const reg2 = /\./
      // // 第一个字符不能为小数点
      // if (str[0] === '.') {
      //   this.form[name] = ''
      //   return
      // }
      // // 过滤掉除数字和小数点外的字符
      // value = str.filter(e => reg1.test(e) || reg2.test(e))
      // // 匹配小数点后只能有两位小数
      // const valJoin = value.join('')
      // this.form.capital = valJoin.match(/^\d*(\.?\d{0,3})/g)[0] || null
    }
  }
}
</script>
<style lang='scss' scoped>
::v-deep .el-input-group__append, .el-input-group__prepend {
  background: #fff;
  border-left: 0;
}
// ::v-deep .el-input-group>.el-input__inner {
//   border-right: 0;
// }
// ::v-deep .el-input-group__append:focus, .el-input-group__prepend:focus  {
//   border: 1px solid #3162E8;
// }
.base-form {
  .box {
    width: 800px;
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
      padding-top: 60px;
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
      .radio_group_bottom{
        font-size: 14px;
        padding: 10px 0 39px 100px;
      }
      .radio {
        // height: 43px;
        .el-radio {
          width: 120px;
          height: 43px;
          padding: 0;
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
        padding-top: 50px;
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
            width: 232px;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
