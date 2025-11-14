<template>
  <div class="name_page page">
    <!-- <page-header /> -->
    <breadcrumb v-show="$route.query.mode !== 'test'" />
    <div class="title">名称申报</div>
    <el-form ref="ruleForm" label-position="left" :model="form" :rules="rules" class="z-page-form" size="medium">
      <div class="flex">
        <el-form-item label="企业类型" prop="companyType" label-width="100px" style="width:300px;">
          <el-select v-model="form.companyType" placeholder="请选择企业类型" @change="handleChangeCompanyType">
            <el-option v-for="item in companyTypeArray" :key="item.value" :label="item.label" :value="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="行政区划" prop="area" label-width="100px" style="width:350px;margin-left: 15px;">
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
      </div>

      <div class="flex justify">
        <el-form-item prop="companyAreaResult" label-position="top">
          <div slot="label" class="flex-label">名称行政区划</div>
          <el-select v-model="form.companyAreaResult" placeholder="请选择" clearable style="width: 300px;" @change="handleSelectName">
            <el-option-group v-for="group in areaResultList" :key="group.label" :label="group.label">
              <el-option v-for="item in group.children" :key="item.value" :label="item.label" :value="item.label" />
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item prop="number">
          <div slot="label" class="flex-label">企业字号</div>
          <el-input v-model="form.number" type="text" minlength="2" maxlength="10" placeholder="请输入字号" clearable style="width: 300px;" @blur="handleCheckSensitiveWord" />
        </el-form-item>

        <el-form-item prop="industryFormulated">
          <div slot="label" class="flex-label">行业表述</div>
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

        <el-form-item prop="orgWay">
          <div slot="label" class="flex-label">组织形式</div>
          <el-select v-model="form.orgWay" style="width: 300px;" placeholder="请选择组织形式" clearable>
            <el-option v-for="item in orgFormArray" :key="item.label" :label="item.label" :value="item.label" />
          </el-select>
        </el-form-item>
      </div>
      <el-form-item prop="nameId" class="justify name-id">
        <div slot="label" class="flex-label title2">名称组合<span>选中任意名称查重</span></div>
        <el-radio-group v-model="form.nameId" class="radio_group_1" @change="checkFullName" v-if="this.$route.query.type ==='person'">
          <el-radio-button v-for="(item, index) in companyFullNameArray" :key="index" :label="item.id" class="radio_group_item">{{ item.name }}（个体工商户）</el-radio-button>
        </el-radio-group>
        <el-radio-group v-model="form.nameId" class="radio_group_1" @change="checkFullName" v-else>
          <el-radio-button v-for="(item, index) in companyFullNameArray" :key="index" :label="item.id" class="radio_group_item">{{ item.name }}</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <div v-if="companyNameCanIUse === '1'" class="radio_group_bottom" style="color: blue">
        当前企业名称未被注册
      </div>
      <div v-if="companyNameCanIUse === '2'" class="radio_group_bottom" style="color: red">
        当前企业名称已被注册
      </div>

      <el-form-item prop="agreementProtocol" class="protocol">
        <el-checkbox v-model="form.agreementProtocol"><span style="color:#606266">我已阅读并同意</span></el-checkbox>
        <span class="link" @click="dialogTab=true">《名称登记自主申报须知》</span>
      </el-form-item>

      <div class="z-button-group">
        <el-button @click="$router.go(0)">刷新当前页面</el-button>
        <el-button @click="handleSaveDraft">暂存草稿</el-button>
        <el-button @click="$router.go(-1)">上一步</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="stopflag">下一步</el-button>
      </div>

    </el-form>

    <el-dialog :visible.sync="dialogTab" width="844px" :close-on-click-modal="false" :close-on-press-escape="false" class="name_dialog">
      <div class="dialog_wrap">
        <div slot="title" class="dialog_title">名称登记自主申报须知</div>
        <ul class="content">
          <li>涉及前置审批事项（目录附后）不适用名称登记自主申报流程，请通过《名称预先登记》办理。</li>
          <li>内资企业改制不适用网上自主申报，请到企业登记机关窗口办理。</li>
          <li>企业名称自主申报应当遵循依法、公平、诚实、信用原则，维护公序良俗，不损害社会公共利益和他人合法权益，申请人对自主申报的名称承担法律责任。</li>
          <li>办理注册登记时，如企业名称存在不适宜情形时，服从登记机关的规范指导。 </li>
        </ul>

        <div class="title2">工商登记前置审批事项目录 （2017年11月）</div>

        <el-table :data="result" stripe border :header-cell-style="{fontWeight: '400',color: '#606266'}">
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column prop="frontBusinessItem" label="项目名称" width="208px" />
          <el-table-column prop="hangldDepartment" label="实施机关" width="206px" />
          <el-table-column prop="license" label="设定依据" width="206px" />
        </el-table>

        <div class="text-center" style="padding-top: 15px;">
          <el-button type="primary" class="button" @click="dialogTab=false">已阅读，关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import PageHeader from '@/components/PageHeader/index'
import baseData from '@/config/baseData.js'
import Breadcrumb from '@/components/Breadcrumb/index'
import { getDescSJ, sensitiveWord, queryDisableIndustryDescription, queryDisableCompanyName } from '@/api/index'
import utilsform from '@/utils'
import { debounce } from '@/utils/index'
// import { convert2Pinyin } from '@/utils/convert2Pinyin'
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
      stopflag: false,
      baseInfo: {}, // 基础信息
      curArea: {}, // 当前一体机数据
      companyNameCanIUse: '', // 1：可用 2：不可用
      options: [], // 行业表述数据
      form: {
        bizName: '',
        nameId: '', // 名称ID
        companyName: '', // 企业名称
        companyType: '', // 企业类型
        area: [], // 行政区划
        areaCode: '', // 行政区划代码
        companyAreaResult: '', // 冠名行政区划
        companyAreaProvince: '', // 冠省名
        companyAreaCity: '', // 冠市名
        companyAreaCountry: '', // 冠区名
        number: '', // 字号
        industryFormulated: '', // 行业表述
        orgWay: '', // 组织形式
        agreementProtocol: false,
        isSensitiveWord: false, // 是否敏感词
        hasRepeatWayFlag: false,
        country_info: {}
        // industryFormulatedCategory: '', // 行业门类
        // industryFormulatedStr: '' // 行业表述(带行业门类)
      },
      rules: {
        nameId: [
          { required: true, message: '* 请选择企业名称', trigger: 'change' }
        ],
        companyType: [
          { required: true, message: '* 请选择企业类型', trigger: 'change' }
        ],
        area: [
          { required: true, message: '* 请选择行政区划', trigger: 'change' }
        ],
        companyAreaResult: [
          { required: true, message: '* 请选择冠名行政区划', trigger: 'change' }
        ],
        number: [
          { pattern: /^[\u4e00-\u9fa5]+$/, message: '* 企业字号仅支持中文', trigger: 'change' },
          { required: true, message: '* 请输入公司字号', trigger: 'change' }
        ],
        industryFormulated: [
          { required: true, message: '* 请选择行业表述', trigger: 'change' }
        ],
        orgWay: [
          { required: true, message: '* 请选择组织形式', trigger: 'change' }
        ],
        // agreementProtocol: [
        //   { required: true, message: '* 您必须同意协议', trigger: 'blur' }
        // ]
        agreementProtocol: [
          { required: true, validator: validatePromise, trigger: 'blur' }
        ]
      },
      baseData: baseData,
      orgFormArray: [],
      areaList: [], // 行政区划字典
      areaResultList: [],
      dialogTab: false,
      result: [
        { frontBusinessItem: '证券公司设立审批', hangldDepartment: '证监会', license: '《中华人民共和国证券法》' },
        { frontBusinessItem: '烟草专卖生产企业许可证核发', hangldDepartment: '国家烟草专卖局或省级烟草专卖行政主管部门', license: '《中华人民共和国烟草专卖法》《中华人民共和国烟草专卖法实施条例》（国务院令第223号）' },
        { frontBusinessItem: '营利性民办学校(营利性民办培训机构)办学许可', hangldDepartment: '县级以上人民政府教育行政部门、县级以上人民政府劳动和社会保障行政部门', license: '《中华人民共和国民办教育促进法》' },
        { frontBusinessItem: '民用爆炸物品生产许可', hangldDepartment: '工业和信息化部', license: '《民用爆炸物品安全管理条例》（国务院令第466号）' },
        { frontBusinessItem: '爆破作业单位许可证核发', hangldDepartment: '省级、设区的市级人民政府公安机关', license: '《民用爆炸物品安全管理条例》（国务院令第466号）' },
        { frontBusinessItem: '民用枪支（弹药）制造、配售许可', hangldDepartment: '省级人民政府公安机关', license: '《中华人民共和国枪支管理法》' },
        { frontBusinessItem: '制造、销售弩或营业性射击场开设弩射项目审批', hangldDepartment: '省级人民政府公安机关', license: '《国务院对确需保留的行政审批项目设定行政许可的决定》（国务院令第412号）《公安部国家工商行政管理局关于加强弩管理的通知》（公治〔1999〕1646号）' },
        { frontBusinessItem: '保安服务许可证核发', hangldDepartment: '省级人民政府公安机关', license: '《保安服务管理条例》（国务院令第564号）' },
        { frontBusinessItem: '涉及国家规定实施准入特别管理措施的外商投资企业的设立及变更审批', hangldDepartment: '商务部、国务院授权的部门或地方人民政府', license: '《中华人民共和国中外合资经营企业法》《中华人民共和国中外合作经营企业法》《中华人民共和国台湾同胞投资保护法》《中华人民共和国外资企业法》' },
        { frontBusinessItem: '设立经营个人征信业务的征信机构审批', hangldDepartment: '中国人民银行', license: '《征信业管理条例》（国务院令第631号）' },
        { frontBusinessItem: '卫星电视广播地面接收设施安装许可审批', hangldDepartment: '新闻出版广电总局', license: '《卫星电视广播地面接收设施管理规定》（国务院令第129号）《关于进一步加强卫星电视广播地面接收设施管理的意见》（广发外字〔2002〕254号）' },
        { frontBusinessItem: '设立出版物进口经营单位审批', hangldDepartment: '新闻出版广电总局', license: '《出版管理条例》（国务院令第594号）' },
        { frontBusinessItem: '设立出版单位审批', hangldDepartment: '新闻出版广电总局', license: '《出版管理条例》（国务院令第594号）' },
        { frontBusinessItem: '境外出版机构在境内设立办事机构审批', hangldDepartment: '新闻出版广电总局、国务院新闻办', license: '《国务院对确需保留的行政审批项目设定行政许可的决定》（国务院令第412号）《外国企业常驻代表机构登记管理条例》（国务院令第584号）' },
        { frontBusinessItem: '境外广播电影电视机构在华设立办事机构审批', hangldDepartment: '新闻出版广电总局、国务院新闻办', license: '《国务院对确需保留的行政审批项目设定行政许可的决定》（国务院令第412号）《外国企业常驻代表机构登记管理条例》（国务院令第584号）' },
        { frontBusinessItem: '危险化学品经营许可', hangldDepartment: '县级、设区的市级人民政府安全生产监督管理部门', license: '《危险化学品安全管理条例》（国务院令第591号' },
        { frontBusinessItem: '新建、改建、扩建生产、储存危险化学品（包括使用长输管道输送危险化学品）建设项目安全条件审查；新建、改建、扩建储存、装卸危险化学品的港口建设项目安全条件审查', hangldDepartment: '设区的市级以上人民政府安全生产监督管理部门；港口行政管理部门', license: '《危险化学品安全管理条例》（国务院令第591号）' },
        { frontBusinessItem: '烟花爆竹生产企业安全生产许可', hangldDepartment: '省级人民政府安全生产监督管理部门', license: '《烟花爆竹安全管理条例》（国务院令第455号）' },
        { frontBusinessItem: '外资银行营业性机构及其分支机构设立审批', hangldDepartment: '银监会', license: '《中华人民共和国银行业监督管理法》《外资银行管理条例》（国务院令第478号）' },
        { frontBusinessItem: '外国银行代表处设立审批', hangldDepartment: '银监会', license: '《中华人民共和国银行业监督管理法》《外资银行管理条例》（国务院令第478号）' },
        { frontBusinessItem: '中资银行业金融机构及其分支机构设立审批', hangldDepartment: '银监会', license: '《中华人民共和国银行业监督管理法》《中华人民共和国商业银行法》' },
        { frontBusinessItem: '非银行金融机构（分支机构）设立审批', hangldDepartment: '银监会', license: '《中华人民共和国银行业监督管理法》《金融资产管理公司条例》（国务院令第297号）' },
        { frontBusinessItem: '融资性担保机构设立审批', hangldDepartment: '省级人民政府确定的部门', license: '《国务院对确需保留的行政审批项目设定行政许可的决定》（国务院令第412号）《国务院关于修改〈国务院对确需保留的行政审批项目设定行政许可的决定〉的决定》（国务院令第548号）《融资性担保公司管理暂行办法》（银监会令2010年第3号）' },
        { frontBusinessItem: '外国证券类机构设立驻华代表机构核准', hangldDepartment: '证监会', license: '《国务院对确需保留的行政审批项目设定行政许可的决定》（国务院令第412号）《国务院关于管理外国企业常驻代表机构的暂行规定》（国发〔1980〕272号）' },
        { frontBusinessItem: '设立期货专门结算机构审批', hangldDepartment: '证监会', license: '《期货交易管理条例》（国务院令第627号）' },
        { frontBusinessItem: '设立期货交易场所审批', hangldDepartment: '国务院或证监会', license: '《期货交易管理条例》（国务院令第627号）' },
        { frontBusinessItem: '证券交易所设立审核、证券登记结算机构设立审批', hangldDepartment: '国务院', license: '《中华人民共和国证券法》' },
        { frontBusinessItem: '专属自保组织和相互保险组织设立审批', hangldDepartment: '保监会', license: '《国务院对确需保留的行政审批项目设定行政许可的决定》（国务院令第412号）' },
        { frontBusinessItem: '保险公司及其分支机构设立审批', hangldDepartment: '保监会', license: '《中华人民共和国保险法》' },
        { frontBusinessItem: '外国保险机构驻华代表机构设立审批', hangldDepartment: '保监会', license: '《中华人民共和国保险法》《国务院对确需保留的行政审批项目设定行政许可的决定》（国务院令第412号）《国务院关于管理外国企业常驻代表机构的暂行规定》（国发〔1980〕272号）' },
        { frontBusinessItem: '快递业务经营许可', hangldDepartment: '国家邮政局或省级邮政管理机构', license: '《中华人民共和国邮政法》' }
      ]
    }
  },
  computed: {
    draftInfo() {
      return this.$store.state.draft.draftInfo
    },
    // 表述和形式是否有重复字
    hasRepeatWay() {
      if (this.form.orgWay) {
        const orgWayLen = this.form.orgWay.length
        const industryFormulated = this.form.industryFormulated ? this.form.industryFormulated.split('-')[1] : ''
        const industryFormulatedLaststr = industryFormulated.slice(-orgWayLen)
        if (industryFormulatedLaststr === this.form.orgWay) {
          return true
        }
      }
      return false
    },
    companyFullNameArray() {
      var companyAreaResult = this.form.companyAreaResult // 区划
      var number = this.form.number // 公司字号
      var industryFormulated = this.form.industryFormulated ? this.form.industryFormulated.split('-')[1] : '' // 行业
      var orgWay = this.form.orgWay // 组织形式
      // if (companyAreaResult === '' && companyAlias === '' && companyIndustry === '') {
      //   return ['待生成公司名称']
      // }

      // 220915 去除行业和组织形式重复字
      if (this.hasRepeatWay) {
        industryFormulated = industryFormulated.slice(0, -this.form.orgWay.length)
      }

      // var companyName1 = (companyAreaResult || '行政区划+') + (number || '字号+') + (industryFormulated || '行业+') + (orgWay || '组织形式')
      // var companyName2 = (number || '字号+') + '（' + (companyAreaResult || '行政区划') + '）' + (industryFormulated || '+行业') + (orgWay || '+组织形式')
      // var companyName3 = (number || '字号+') + (industryFormulated || '行业+') + '（' + (companyAreaResult || '行政区划') + '）' + (orgWay || '+组织形式')

      if(this.$route.query.type === 'person')
      {
        var companyName1 = (companyAreaResult || '行政区划+') + (number || '字号+') + (industryFormulated || '') + (orgWay)
        return [{
        id: 1,
        name: companyName1
        }]
      }
      else{
      var companyName1 = (companyAreaResult || '行政区划+') + (number || '字号+') + (industryFormulated || '') + (orgWay)
      var companyName2 = (number || '字号+') + '（' + (companyAreaResult || '行政区划') + '）' + (industryFormulated || '+') + (orgWay)
      var companyName3 = (number || '字号+') + (industryFormulated || '+') + '（' + (companyAreaResult || '行政区划') + '）' + (orgWay)
      return [{
        id: 1,
        name: companyName1
      }, {
        id: 2,
        name: companyName2
      }, {
        id: 3,
        name: companyName3
      }]
      }
      // if (companyAreaResult === '广东' || companyAreaResult === '广州') {
      //   var companyFullNameArray = [companyName1, companyName2, companyName3]
      //   return companyFullNameArray
      // }
      // return [companyName1]
    },
    companyTypeArray() {
      if (this.$route.query.type === 'person') {
        return baseData.companyType.filter(item => item.label === '个体工商户')
      }
      return baseData.companyType.filter(item => item.label !== '个体工商户')
    }
  },
  watch: {
    companyFullNameArray: {
      handler: function (data) {
        // this.form.companyName = data[0]
        // if (this.form.companyAreaResult && this.form.companyAlias && this.form.orgForm && this.form.noCompanyIndustry) {
        //   this.checkFullName()
        //   return
        // }
        this.form.companyName = ''
        this.form.nameId = ''
        this.companyNameCanIUse = ''
      },
      deep: true
    }
    // industryFormulatedStr: {
    //   handler: function () {
    //     this.form.industryFormulated = this.form.industryFormulatedStr.split('1')
    //   }
    // }
    // 'form.area': {
    //   handler: function(data) {
    //     console.log('行政区划发送变化', data)
    //   },
    //   deep: true
    // }
  },
  mounted () {
  },
  activated() {
    sessionStorage.removeItem('companyName')
    const tmpCompanyName = JSON.parse(JSON.stringify(this.$utils.getItem('companyName')))
          if(this.$route.query.type === 'person'&& tmpCompanyName){
           let sadas = JSON.parse(JSON.stringify(this.$utils.getItem('companyName')))
              if(!sadas.includes('（个体工商户）')){
                sadas = sadas +'（个体工商户）'
            }
            console.log(sadas,'sadas');
          }
    if (this.$utils.getItem('areaResultList')) {
      this.areaResultList = this.$utils.getItem('areaResultList')
    }
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
          if (res.nameApply && res.nameApply.companyName) {
            this.form = res.nameApply
            if (res.nameApply.area[1]) {
              const area = {
                code: res.nameApply.areaCode,
                label: res.nameApply.area[1]
              }
              this.$utils.setItem('area', area)
            }
            this.form.industryFormulated = this.form.industryFormulatedCategory + this.form.industryFormulated
            if (res.nameApply.companyType) {
              this.handleChangeCompanyType(this.form.companyType)
            }
          }
        })
      }
      this.form.bizName = this.$route.query.bizName
      if (this.$route.query.type === 'person') {
        this.form.companyType = '个体工商户'
        this.handleChangeCompanyType('个体工商户')
      }
      if (this.form.industryFormulated) {
        const str = this.form.industryFormulated + this.form.industryFormulatedCategory
        const arr = str.split('-')
        this.options = [{
          trdcode: arr[0],
          indusname: arr[1],
          trddesc: arr[2]
        }]
      }
      if (this.form.area[1]) {
        this.setAreaResult()
      }
    })
  },
  methods: {
    handleSelectName(e) {
      // 拿到值然后匹配冠名类型（省市区）
      let value = ''
      this.areaResultList.forEach(item => {
        item.children.forEach(val => {
          if (val.label === e) {
            this.form.nameType = item.label
            value = val.value
          }
        })
      })
      const arr = value.split('-')
      switch (this.form.nameType) {
        case '冠省名':
          this.form.companyAreaProvince = arr[0]
          this.form.companyAreaCity = arr[1] || ''
          this.form.companyAreaCountry = arr[2] || ''
          // this.$utils.showWarn('冠省名企业注册资金需大于或等于100万元，请知悉！')
          break
        case '冠市名':
          this.form.companyAreaProvince = ''
          this.form.companyAreaCity = arr[0]
          this.form.companyAreaCountry = arr[1] || ''
          break
        case '冠区/县名':
          this.form.companyAreaProvince = ''
          this.form.companyAreaCity = ''
          this.form.companyAreaCountry = arr[0] || ''
          break
        default:
          break
      }
    },
    // 保存草稿
    handleSaveDraft(showTips = false) {
      return new Promise((resolve, reject) => {
        if (this.form.companyName) {
          if(!this.form.companyName.includes('（个体工商户）')&&this.$route.query.type ==="person"){
          this.form.companyName = this.form.companyName +'（个体工商户）'
        }
          const data = {
            ...this.draftInfo, // 原有数据
            nameApply: this.form, // 现在数据覆盖原有数据
            businessType: this.$route.query.type === 'person' ? '1' : '2',
            showTips // 是否显示提示
          }
          // data.nameApply.country_info = this.$utils.getItem('country_info')
          data.nameApply.country_info =  JSON.parse(localStorage.getItem('country_info'))
          if(this.$route.query.type==='person'){
            console.log('155');
            utilsform.setItem('companyName', this.form.companyName)
          }
          this.$store.dispatch('draft/saveDraft', data).then(res => {
            resolve()
          }).catch(() => {
            reject()
          })
        } else {
          this.$utils.showError('请先完善名称申报再保存草稿')
        }
      })
    },
    handleChangeCompanyType(value) {
      for (const item of this.companyTypeArray) {
        if (value === item.label) {
          this.orgFormArray = item.orgForm
          if(this.$route.query.type==="person"&&this.$route.query.bizName==="个体工商户辅助开办"){
              this.orgFormArray = this.orgFormArray.filter((item=>{
              return item.label!="中心"
            }))
          }
        }
      }
      if (['一人有限责任公司', '有限责任公司（自然人投资或控股）'].includes(value)) {
        this.form.orgWay = '有限公司'
      }
      if (['股份有限公司'].includes(value)) {
        this.form.orgWay = '股份公司'
      }
      if (['个体工商户'].includes(value)) {
        this.form.orgWay = ''
      }
      // 改变成个体工商户
      if (this.form.area[1]) {
        // 重置数据
        if (value === '个体工商户') {
          this.form.companyAreaResult = ''
        }
        this.setAreaResult()
      }
    },
    setAreaResult() {
      if (this.form.companyType === '个体工商户') {
        this.areaResultList = this.curArea.personData
      } else {
        this.areaResultList = this.curArea.companyData
      }
      // console.group()
      // console.log('companyType', this.form.companyType)
      // console.log('companareaResultListyType', this.areaResultList)
      // console.log('area', this.$utils.getItem('area'))
      // console.groupEnd()
      if (this.$utils.getLocalItem('mode') === 'test' && this.$utils.getItem('area')) {
        if (this.form.companyType === '个体工商户') {
          this.areaResultList = []
          // console.log(this.areaResultList, 'this.areaResultList')
          this.areaResultList.push({ children: [{ label: this.$utils.getItem('area').label, value: this.$utils.getItem('area').label }], label: '冠区/县名' })
        } else {
          // const list = JSON.stringify(this.areaResultList)
          // this.areaResultList = JSON.parse(list)
          // if (this.$utils.getItem('area').label !== '市直属' && this.$utils.getItem('area').label !== '荆州高新技术产业开发区' && this.$utils.getItem('area').label !== '荆州纪南生态文化旅游区') {
          //   this.areaResultList.push({ children: [{ label: this.$utils.getItem('area').label, value: this.$utils.getItem('area').label }], label: '冠区/县名' })
          // }
          // // 去除“经开区”冠县区名，避免重复
          // if (this.curArea.district === '十堰经济技术开发区') {
          //   this.areaResultList.splice(1, 1)
          // }
        }
      }
      // 湖北政务网-根据行政区划动态设置名称区划
      // if (this.$utils.getItem('origin') === '湖北政务网荆州9210特色服务专区') {
      if (this.$utils.getItem('origin') && this.$utils.getItem('origin').includes('湖北政务网')) {
        const areaInfo = this.$utils.getLocalItem('baseInfo').areaInfo
        const areaLabel = this.$utils.getItem('area').label
        const areaBaseInfo = areaInfo[areaLabel]
        if (this.form.companyType === '个体工商户') {
          this.areaResultList = areaBaseInfo.personData
        } else {
          this.areaResultList = areaBaseInfo.companyData
        }
      }
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
          if (this.$utils.getLocalItem('mode') === 'test' && this.$route.query.type === 'person') {
            this.areaList[0].children = this.areaList[0].children.filter(item => item.label !== '市直属')
          }
          this.areaList[0].children.filter((item, index) => {
            // 来源于湖北政务网入口，放开十堰区划限制（除茅箭区）
            // 09-26 放开限制
            if (this.$utils.getItem('origin') === '湖北政务网一链通') {
              item.disabled = false
              // if (item.label === '茅箭区') {
              //   item.disabled = true
              // }
            } else if (item.label !== this.curArea.district && this.areaList[0].label !== '荆州市') {
              item.disabled = true
            }
          })
          this.areaList[0].children = this.areaList[0].children.filter(item => includesArr.includes(item.label.trim()))
          this.form.area = this.curArea.defaultValue
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
      console.log(areaCode)
      console.log(value[1])
      for (const item of areaCode) {
        if (item.label === value[1]) {
          const area = {
            code: item.value,
            label: item.label
          }
          this.form.areaCode = area.code
          localStorage.setItem('country_info', JSON.stringify(item.country_info))
          // this.$utils.setItem('country_info', item.country_info)
          this.$utils.setItem('area', area)
        }
      }
      this.form.companyAreaResult = ''
      this.setAreaResult()
    },
    shieldData(value) {
      let flag = true
      let data = ['学校', '省投', '资产', '股权', '债券', '交易', '融资', '财富', '受托', '委托', '经济']
      if(this.$utils.getLocalItem('curArea').district=='茅箭区') {
         data.forEach(item => {
           if(value.includes(item)) {
             this.$utils.showError('企业字号中不得包含: ' + item)
             flag = false
           }
         })
      }
      return flag
    },
    // 字号改变
    handleCheckSensitiveWord() {
      if (this.form.number) {
        let flag = this.shieldData(this.form.number)
        if(flag) {
          this.$utils.showLoading({ text: '敏感词检测中。。。' })
          sensitiveWord(this.form.number).then(res => {
            this.$utils.hideLoading()
            if (+res.errCode === 1 && res.outData.code === 0) {
              this.isSensitiveWord = res.outData.isSensitiveWord
              if (res.outData.isSensitiveWord) {
                this.$utils.showError('企业字号中存在敏感词')
              }
            }
          })
        }
      } else {
        this.$utils.showError('请输入企业字号！')
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
          // this.$store.dispatch('indid/getIndustryId', id)
          console.log(id);
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
      queryDisableIndustryDescription(params).then(res => {
        if (res.data && res.data.length >0) {
          let value = res.data.join(",")
          this.$utils.showError('行业表述不得包含：' + value +' 关键字')
          this.stopflag=true
          return false
        }
      })
    },
    checkCompanyName(value) {
      const selectedCompany = this.companyFullNameArray.find(item => item.id === value)
      let params = {
        city: this.curArea.city,
        area: this.curArea.district,
        type: '企业名称',
        companyName: selectedCompany ? selectedCompany.name : ''
      } 
      queryDisableCompanyName(params).then(res => {
       if (res.data && res.data.length >0) {
          let value = res.data.join(",")
          this.$utils.showError('企业名称不得包含：' + value +' 关键字')
          this.stopflag=true
          return false
        }else{
          this.stopflag=false
        }
      })
    },
    // 名称查重
    checkFullName(value) {
      this.checkCompanyName(value)
      if (this.isSensitiveWord) {
        return this.$utils.showError('')
      }
      if (this.isSensitiveWord) {
        return this.$utils.showError('企业字号中存在敏感词,请先修改企业字号')
      }
      if (!this.form.companyAreaResult) {
        return this.$utils.showError('请选择行政区划')
      }
      if (!this.form.number) {
        return this.$utils.showError('请输入字号')
      }
      if (!this.form.industryFormulated) {
        return this.$utils.showError('请选择行业描述')
      }
      // if (!this.form.orgWay) {
      //   return this.$utils.showError('请选择组织形式')
      // }
      const disabledKeyData = this.baseData.isHasDisabledKey(this.form.number, 'cName')
      if (disabledKeyData.flag) {
        return this.$utils.showError(`企业字号中含有禁止使用的行业关键字: ${disabledKeyData.key}`)
      }

      // 英山县 试点新名称接口
      // if (this.$utils.getLocalItem('curArea').district === '英山县') {
      //   this.nameCheckRepeatNew()
      //   return
      // }

      this.nameCheckRepeat()
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
        if (this.form.number.includes(this.form.industryFormulated.split('-')[1])) {
          this.$utils.showError('企业字号不允许包含行业表述字段')
          return
        }
        if (this.isSensitiveWord) {
          return this.$utils.showError('企业字号中存在敏感词,请先修改企业字号')
        }
        if (!this.companyNameCanIUse || this.companyNameCanIUse === '2') { // 不可用
          return this.$utils.showError('请先选择一个可以使用的企业名称')
        }
        // this.$utils.setItem('nameApply', {
        //   ...this.form,
        //   companyName: this.companyFullNameArray[this.form.nameId - 1].name
        // })
        const disabledKeyData = this.baseData.isHasDisabledKey(this.form.number, 'cName')
        if (disabledKeyData.flag) {
          return this.$utils.showError(`企业字号中含有禁止使用的行业关键字: ${disabledKeyData.key}`)
        }

        this.form.industryFormulatedCategory = this.form.industryFormulated.charAt(0)
        this.form.industryFormulated = this.form.industryFormulated.slice(1)
        this.form.hasRepeatWayFlag = false
        if (this.hasRepeatWay) {
          this.form.hasRepeatWayFlag = true // 有重复字
        }
        console.log(this.form)

        try {
          await this.handleSaveDraft()
        } catch (err) {
          this.form.industryFormulated = this.form.industryFormulatedCategory + this.form.industryFormulated
          return
        }
        this.$utils.setItem('areaResultList', this.areaResultList)
        this.$utils.setItem('nameApply', this.form)
        this.$router.push({ path: '/form/scope', query: { ...this.$route.query }})
      })
    },
    // 名称接口
    nameCheckRepeat () {
      this.$api.showLoading({ text: '查重中...' })
      const industryFormulated = this.form.industryFormulated
      console.log(`%c%s`, `color:blue`, `[Debug] ~ nameCheckRepeat ~ industryFormulated`, industryFormulated)
      // 旧名称接口
      const params = {
        inData: {
          '字号': this.form.number,
          '行业描述': industryFormulated ? industryFormulated.split('-')[1] : '',
          '行业代码': industryFormulated ? industryFormulated.slice(1).split('-')[0] : '',
          '企业类型': this.form.companyType,
          '企业类型id': '',
          '组织形式': this.form.orgWay,
          '行政区划代码': this.form.areaCode,
          '企业名称': this.companyFullNameArray[this.form.nameId - 1].name,
          "namedistrict": this.form.companyAreaResult,// '冠区/县名'
          "nameType": this.form.nameType,// '冠区/县名'
          "addressArea": this.$utils.getLocalItem('curArea').provice + ' ' + this.$utils.getLocalItem('curArea').city + ' ' + this.$utils.getLocalItem('curArea').district,
          "selectedArea": [
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
          ], // '湖北省 武汉市 硚口区',
        },
        job: 'HUBEI_ENT_NAME_CHECK'
      }
      console.log(params)
      this.$api.startJob(params).then(res => {
        this.$api.hideLoading()
        if (+res.errCode !== 1 || res.outData.result !== 'success') {
          this.companyNameCanIUse = '2' // 不可用
          this.$utils.showError(res.outData.msg || res.errMsg)
          return
        }
        this.companyNameCanIUse = '1' // 可用
        this.form.companyName = this.companyFullNameArray[this.form.nameId - 1].name
      }).catch(() => {
        this.$api.hideLoading()
        this.$utils.showError('发生错误，请联系管理员！')
      })

      // const nameType = this.form.nameType === '冠市名' ? 2 : this.form.nameType === '冠区/县名' ? 3 : 1
      // const data = {
      //   'qylxdl': this.form.companyType === '个体工商户' ? '08' : '01',
      //   'industryphy': industryFormulated ? industryFormulated.charAt(0) : '', // R
      //   'industryco': industryFormulated ? industryFormulated.slice(1).split('-')[0] : '', // '9013',
      //   'enttra': this.form.number, // '三三',
      //   'entname': this.companyFullNameArray[this.form.nameId - 1].name.replace(this.form.orgWay, ''), // '武汉三三制造厂（普通合伙）',
      //   'nameind': industryFormulated ? industryFormulated.split('-')[1] : '', // '装修',
      //   'namedistrict': this.form.companyAreaResult, // '武汉',
      //   'preregorg': this.form.areaCode, // '420102'
      //   'isAddProvince': nameType === 1 ? 1 : 0,
      //   'isAddCity': nameType === 2 ? 1 : 0,
      //   'isAddCounty': nameType === 3 ? 1 : 0,
      //   'isAddBrackets': this.companyFullNameArray[this.form.nameId - 1].name.includes('（') ? 1 : 0,
      //   'mcywlx': nameType,
      //   'regorg': this.form.areaCode,
      //   'tradpiny': convert2Pinyin(this.form.number)
      // }
      // recheckNameSJ(data).then(res => {
      //   if (+res.flag !== 200) {
      //     this.companyNameCanIUse = '2' // 不可用
      //     // this.$utils.showError(res.outData.msg || res.errMsg)
      //     return
      //   }
      //   const resData = res.data && JSON.parse(res.data)
      //   console.log(`%c%s`, `color:blue`, `[Debug] ~ recheckNameSJ ~ resData`, resData)
      //   if (!resData.xtlist.length && !resData.jslist.length && !resData.jxlist.length) {
      //     this.companyNameCanIUse = '1' // 可用
      //     this.form.companyName = this.companyFullNameArray[this.form.nameId - 1].name
      //     return
      //   }
      //   this.$utils.showError(resData.content.replace(/\，\u4f9d\S+\：/, ''))
      //   this.companyNameCanIUse = '2' // 不可用
      // }).finally(() => {
      //   this.$api.hideLoading()
      // })
    },
    // 新名称接口 06-13
    nameCheckRepeatNew () {
      this.$api.showLoading({ text: '查重中...' })
      const params = {
        'job': 'HUBEI_NAME_QUERY',
        'inData': {
          'companyName': this.companyFullNameArray[this.form.nameId - 1].name, // 企业名称 '武汉桃花潭水商贸有限公司',
          'companyAreaResult': this.form.companyAreaResult, // 名称行政区划 '武汉',
          'companyType': this.form.companyType, // 企业类型 '一人有限责任公司',
          'industryType': { // 行业类型
            'IndustryCode': this.form.industryFormulated ? this.form.industryFormulated.slice(1).split('-')[0] : '', // 行业代码 '5283'
            'IndustryName': this.form.industryFormulated ? this.form.industryFormulated.split('-')[2] : '' // '家具零售'
          },
          'number': this.form.number, // 字号 '桃花潭水'
          'industryFormulated': this.form.industryFormulated ? this.form.industryFormulated.split('-')[1] : '', // 行业描述 '商贸',
          'orgWay': this.form.orgWay, // 组织形式 '有限公司',
          'addressArea': '湖北省 ' + this.form.area.join(' '), // '湖北省 武汉市 硚口区',
          'addressAreaStreet': '', // '汉中街道',
          'channel': '一体机',
          'device': this.$utils.getLocalItem('device') || '', // 'ZW'
          'oneMachineNum': this.$utils.getLocalItem('tId') || '', // '2022II-ZW-WHQKTES'
          'bizName': this.form.bizName,
          'nameType': this.form.nameType // '冠区/县名'
        }
      }
      console.log('[HUBEI_NAME_QUERY] Params:', params)
      this.$api.startJob(params).then(res => {
        this.$api.hideLoading()
        if (+res.errCode !== 1 || res.state !== 'successful') {
          this.companyNameCanIUse = '2' // 不可用
          this.$utils.showError(res.outData.errMsg || res.errMsg)
          return
        }
        this.companyNameCanIUse = '1' // 可用
        this.form.companyName = this.companyFullNameArray[this.form.nameId - 1].name
        if (res.errMsg) {
          res.errMsg.includes('相似') ? this.$utils.showWarn(res.errMsg) : this.$utils.showSuccess(res.errMsg)
        }
      }).catch(() => {
        this.$api.hideLoading()
        this.$utils.showError('发生错误，请联系管理员！')
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
/*
::v-deep .el-input--medium .el-input__inner {
  line-height: 40px;
} */
.z-page-form {
  width: 1200px;
  margin: 0 auto;
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
  padding-top: 60px;
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
