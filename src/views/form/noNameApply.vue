<template>
  <div class="name_page page">
    <!-- <page-header /> -->
    <breadcrumb v-show="$route.query.mode !== 'test'" />
    <div class="title">无字号注册登记</div>
    <el-form
      ref="ruleForm"
      label-position="left"
      :model="form"
      :rules="rules"
      class="z-page-form"
      size="medium"
      label-width="90px"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="企业类型" prop="companyType">
            <el-select v-model="form.companyType" disabled placeholder="请选择企业类型">
              <el-option v-for="item in companyTypeArray" :key="item.value" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="行政区划" prop="area">
            <el-cascader
              v-model="form.area"
              style="width: 100%;"
              :options="areaList"
              separator=" "
              :props="{ expandTrigger: 'hover', value: 'label' }"
              clearable
              @change="handleAreaChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="industryFormulated" label="行业表述">
            <el-select
              v-model="form.industryFormulated"
              style="width: 300px;"
              filterable
              remote
              :remote-method="debounce(searchformquest,300,false)"
              class="select"
              placeholder="请输入关键词"
              clearable
              @change="next = false"
            >
              <!-- <el-option
                v-for="item in options"
                :key="item.IndustryCategoryCode + item.AvailableIndustryDescription + item.IndustryName"
                :label="`${item.AvailableIndustryDescription}(${item.IndustryName})`"
                :value="`${item.IndustryCategoryCode}-${item.AvailableIndustryDescription}-${item.IndustryName}`"
              /> -->
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="`${item.indusname}(${item.trddesc})`"
                :value="`${item.trdcode}-${item.indusname}-${item.trddesc}`"
              />
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
      <div class="z-button-group">
        <el-button @click="$router.go(0)">刷新当前页面</el-button>
        <el-button @click="handleSaveDraft(true)">暂存草稿</el-button>
        <el-button @click="$router.go(-1)">上一步</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="stopflag">下一步</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
import baseData from '@/config/baseData.js'
import Breadcrumb from '@/components/Breadcrumb/index'
import { getDescSJ ,queryDisableIndustryDescription} from '@/api/index'
import { debounce } from '@/utils/index'
export default {
  components: {
    // PageHeader,
    Breadcrumb
  },
  data() {
    const validatePromise = (rule, value, callback) => {
      if (!value) {
        callback(new Error('* 您必须同意协议'))
      } else {
        callback()
      }
    }
    return {
      stopflag:false,//可以下一步
      baseInfo: {}, // 基础信息
      options: [], // 行业表述数据
      form: {
        bizName: '',
        companyType: '个体工商户', // 企业类型
        area: [], // 行政区划
        areaCode: '', // 行政区划代码
        companyAreaResult: '', // 行政区划
        industryFormulated: '', // 行业表述
        companyName: '',
        nameType: '冠区/县名',
        country_info: {}
      },
      rules: {
        companyType: [
          { required: true, message: '* 请选择企业类型', trigger: 'change' }
        ],
        area: [
          { required: true, message: '* 请选择行政区划', trigger: 'change' }
        ],
        industryFormulated: [
          { required: true, message: '* 请选择行业表述', trigger: 'change' }
        ],
        agreementProtocol: [
          { required: true, validator: validatePromise, trigger: 'blur' }
        ]
      },
      baseData,
      areaList: [] // 行政区划字典
    }
  },
  computed: {
    draftInfo() {
      return this.$store.state.draft.draftInfo
    },
    companyTypeArray() {
      if (this.$route.query.type === 'person') {
        return baseData.companyType.filter(item => item.label === '个体工商户')
      }
      return baseData.companyType.filter(item => item.label !== '个体工商户')
    }
  },
  activated() {
    sessionStorage.removeItem('companyName')
    if (this.$utils.getLocalItem('baseInfo')) {
      this.baseInfo = this.$utils.getLocalItem('baseInfo')
    }
    if (this.$utils.getLocalItem('curArea')) {
      this.curArea = this.$utils.getLocalItem('curArea')
    }
    this.getAreaInfo().then(() => {
      // 获取草稿详情
      if (this.$utils.getItem('draftNumber')) {
        this.$store.dispatch('draft/getDraftDetail', this.$utils.getItem('draftNumber')).then(res => {
          if (res.nameApply) {
            this.form = res.nameApply
            this.form.industryFormulated = this.form.industryFormulatedCategory + this.form.industryFormulated
            console.log(this.form)
          }
        })
      }
      // if (this.$utils.getItem('nameApply')) {
      //   const nameApply = this.$utils.getItem('nameApply')
      //   this.form = nameApply
      //   if (this.form.area[1]) {
      //     this.handleAreaChange(this.form.area)
      //   }
      // }
      this.form.bizName = this.$route.query.bizName
      if (this.form.industryFormulated) {
        // const arr = this.form.industryFormulated.split('-')
        // this.options = [{
        //   IndustryCategoryCode: arr[0],
        //   AvailableIndustryDescription: arr[1],
        //   IndustryName: arr[2]
        // }]
        const str = this.form.industryFormulated + this.form.industryFormulatedCategory
        const arr = str.split('-')
        this.options = [{
          trdcode: arr[0],
          indusname: arr[1],
          trddesc: arr[2]
        }]
      }
    })
  },
  methods: {
    // 保存草稿
    handleSaveDraft(showTips = false) {
      return new Promise((resolve, reject) => {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            const data = {
              ...this.draftInfo, // 原有数据
              nameApply: this.form, // 现在数据覆盖原有数据
              businessType: this.$route.query.type === 'person' ? '1' : '2',
              showTips // 是否显示提示
            }
            // data.nameApply.country_info = this.$utils.getItem('country_info')
            data.nameApply.country_info = JSON.parse(localStorage.getItem('country_info')) 
            this.$store.dispatch('draft/saveDraft', data).then(res => {
              resolve()
            }).catch(() => {
              reject()
            })
          } else {
            this.$utils.showError('请按提示信息补充完整表单！')
          }
        })
      })
    },
    getAreaInfo() {
      return new Promise(resolve => {
        const params = {
          'inData': {},
          'job': 'HuBei_DistCode'
        }
        this.$api.startJob(params).then(res => {
          this.areaList = res.outData.data.filter(item => item.label === this.curArea.city)
          const includesArr = this.baseInfo.includesArr.map(item => item.trim())
          this.areaList[0].children = this.areaList[0].children.filter(item => includesArr.includes(item.label.trim()))
          if (this.$utils.getLocalItem('mode') === 'test') {
            this.areaList[0].children = this.areaList[0].children.filter(item => item.label !== '市直属')
          }
          this.areaList[0].children.filter(item => {
            // mode=test, tId=2021II-ZW-SYJK，代表来源于湖北政务网十堰经开一链通入口，放开十堰区划限制（除茅箭区）
            if (this.$utils.getLocalItem('mode') === 'test' && this.areaList[0].label === '十堰市' && this.$utils.getLocalItem('tId') === '2021II-ZW-SYJK') {
              item.disabled = false
              if (item.label === '茅箭区') {
                item.disabled = true
              }
            } else if (item.label !== this.curArea.district && this.areaList[0].label !== '荆州市') {
              item.disabled = true
            }
            // if (item.label !== this.curArea.district && this.areaList[0].label !== '荆州市') {
            //   item.disabled = true
            // }
          })
          this.form.area = this.curArea.defaultValue
          console.log(`%c%s`, `color:blue`, `[Debug] ~ this.$api.startJob ~ this.form.area`, this.form.area)
          this.handleAreaChange(this.form.area)
          resolve()
        })
      })
    },
    handleAreaChange(value) {
      if (!value.length) return
      // 保存地址码
      let areaCode = []
      this.areaList.forEach(item => {
        if (item.label === value[0]) {
          areaCode = item.children
        }
      })
      for (const item of areaCode) {
        if (item.label === value[1]) {
          const area = {
            code: item.value,
            label: item.label
          }
          this.form.areaCode = area.code
          this.form.companyAreaResult = area.label
          localStorage.setItem('country_info',JSON.stringify(item.country_info))
          // this.$utils.setItem('country_info', item.country_info)
          this.$utils.setItem('area', area)
        }
      }
    },
    debounce,
    searchformquest(val) {
      if (val) {
        if(this.$utils.getLocalItem('curArea').district=='仙桃市') {
          if(val.includes('摩托') || val.includes('电动') || val.includes('自行')) {
            this.$utils.showError('该行业描述不可选！')
            return false
          }
        }
        this.checkIndustryDescription(val)
        this.$utils.showLoading({ text: '加载中' })
        // getDesc(val).then(res => {
        //   console.log(`%c%s`, `color:blue`, `[Debug] ~ getDesc ~ res`, res)
        //   this.$utils.hideLoading()
        //   if (+res.errCode === 1 && res.outData) {
        //     this.options = res.outData.data
        //   }
        // })
        getDescSJ(val).then(res => {
          console.log(`%c%s`, `color:blue`, `[Debug] ~ getDescSJ ~ res`, res)
          this.$utils.hideLoading()
          if (+res.flag === 200 && res.data) {
            this.options = res.data
          }
          const id = res.data[0].id;
          localStorage.setItem("industryid", id)
          // this.$utils.setLocalItem("industryid", id); // 将id存储到本地
        })
      }
    },
    checkIndustryDescription(val) {
      console.log(this.form.area, '111')
      let params = {
        city: this.curArea.city,
        area: this.curArea.district,
        type: '行业表述',
        industryDescription: val
      }
      // if(val==='烟草')
      // {
      //   this.$utils.showError('行业表述不得包含：' + val +' 关键字')
      //   this.stopflag=true
      //   return 
      // }
      queryDisableIndustryDescription(params).then(res => {
        if (res.data && res.data.length >0) {
          let value = res.data.join(",")
          this.$utils.showError('行业表述不得包含：' + value +' 关键字')
          this.stopflag=true
          return false
        }else{
          this.stopflag=false
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return this.$utils.showError('请按提示信息补充完整表单！')
        }
        this.$utils.removeItem("huangmei")//这里一进来就可以会删除黄梅，需要重新传
        if(this.$utils.getLocalItem('tId') === '2023II-ZW-HGHMX01'&&this.form.industryFormulated.includes("餐饮")){
           this.$utils.setItem("huangmei","黄梅餐饮")
        }


        let selectedArea = [
          {
            "code": "420000",
            "name": "湖北省"
          },
          {
            "code": this.areaList[0].value,
            "name": this.areaList[0].label
          },
          {
            "code": this.form.areaCode,
            "name": this.form.companyAreaResult
          },
        ] // '湖北省 武汉市 硚口区',
        this.$utils.setItem('selectedArea', selectedArea)
        this.form.industryFormulatedCategory = this.form.industryFormulated.charAt(0)
        // this.form.industryFormulatedStr = this.form.industryFormulated
        this.form.industryFormulated = this.form.industryFormulated.slice(1)
        console.log(this.form)
        await this.handleSaveDraft()
        // 保存数据以便于后续提交申请获取job名
        this.$utils.setItem('nameApply', this.form)
        this.$router.push({ path: '/form/scope', query: { ...this.$route.query }})
      })
    }

  }
}
</script>

<style scoped>
.name_page{
  margin: 0 auto;
}
::v-deep .el-form-item--medium .el-form-item__label {
  line-height: 40px;
}
::v-deep .el-select {
  width: 100%;
}
/*
::v-deep .el-input--medium .el-input__inner {
  line-height: 40px;
} */
.z-page-form {
  width: 1200px;
  margin: 80px auto 0 auto;
}
.name_page .title{
  color: #555;
  font-size: 28px;
  font-weight: 400;
  padding: 30px 0;
  text-align: center;
}
.name_page .title2{
  color: #555;
  text-align: center;
  padding: 15px 0;
  font-weight: bold;
}
.name_page .title2 span{
  color: #7F7E7E;
  font-size: 14px;
  padding-left: 5px;
}
.name_page .flex{
  display: flex;
  padding-bottom: 20px;
}
.name_page .justify{
  justify-content: space-between;
}
.name_page .flex-label{
  display: inline-block;
  text-align: center;
}
.name_page .z-button-group .el-button {
  color: #3162E8;
  border: 1px solid #3162E8;
}
.name_page .z-button-group .el-button--primary {
  color: #fff;
}
/* .name_page .flex-ul{
  list-style: none;
  justify-content: space-between;
  padding: 15px 0 30px;
}
.name_page .flex-ul li{
  color: #777;
  padding: 10px;
  width: 30%;
  text-align: center;
  border-radius: 8px;
  border: 1px solid #E0E0E0;
  cursor: pointer;
} */
.name_page .radio_group_1{
  display: flex;
  /* text-align: justify; */
  align-items: center;
  justify-content: space-between;
  width: 100%;
  /* padding-bottom: 20px; */
}
.name_page .radio_group_1 .radio_group_item{
  width: 30%;
}
.radio_group_bottom{
  padding: 0 0 15px;
  text-align: center;
}
.name_page .z-button-group{
  /* padding: 0 0 30px 0; */
  padding-top: 380px;
  padding-bottom: 60px;
  text-align: center
}
.z-button-group button{
  width: 155px;
  padding: 16px 20px;
}
.name_page .link{
  color: #025BFF;
  cursor: pointer;
}
.name_dialog .dialog_wrap{
  padding: 0 58px;
}
/* .dialog_wrap .el-table th>.cell {
  font-weight: 400;
  color: #606266;
} */
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
  list-style-type: cjk-ideographic;
  font-size: 15px;
  margin-left: 15px;
  /* list-style-position: inside; */
}
.name_dialog .title2{
  margin: 0 auto;
  font-size: 15px;
  width: 192px;
  text-align: center;
  padding-bottom: 15px;
  /* color: #464646; */
  font-weight: 400;
}
.name_dialog .button{
  width: 155px;
  padding: 15px 0;
  text-align: center;
  border-radius: 4px;
  margin: 30px auto 15px;
  cursor: pointer;
}
</style>
<style>
/* .name-page .name-id .el-form-item__error {
  width: 100%!important;
  text-align: center!important;
} */
.name_page .justify .el-form-item{
  width: 20%;
}
.name_page .justify .el-form-item__label{
  width: 100%;
  text-align: left;
  margin-bottom: 10px;
}
.name_page .el-form-item__label{
  font-size: 16px;
}
/* .name_page .justify .el-select, .name_page .justify .el-autocomplete{
  width: 100%;
} */
.name_page  .protocol {
  width: 300px;
  margin: 0 auto;
  padding-top: 50px;
}
.name_page  .protocol .el-form-item__content{
  text-align: center;
}
.name_page .el-input__inner{
  height: 40px;
  display: flex;
  align-items: center;

}
.name_page .radio_group_1 .el-radio-button__inner{
  width: 100%;
  border-left: 1px solid #DCDFE6;
  box-shadow: none;
  padding: 0;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.name_page .el-dialog__header{
  padding: 0;
}
.name_dialog>.el-dialog {
  height: 570px;
  overflow: hidden;
  overflow-y: auto;
}
.el-select-group__wrap:not(:last-of-type)::after {
  background: #3162E8;
}
.el-select-group__title {
  font-weight: 600;
  font-size: 16px;
  color: #606266;
}
</style>
