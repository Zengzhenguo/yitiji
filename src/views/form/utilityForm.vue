<template>
  <div class="utilityForm">
    <breadcrumb v-show="$route.query.mode !== 'test'" />
    <div class="utilityContainer">
      <div class="utilityHeader">
        水、气、网信息填报
      </div>
      <div class="utilityMain">
        <el-form ref="form" :model="form" :rules="rules" label-position="left">
          <template v-if="work.waterRegistList&&work.waterRegistList.length>0">
            <el-form-item label="水务" prop="waterRegistAddress" label-width="80px">
              <el-row>
                <el-radio-group v-model="form.waterRegistAddress">
                  <el-col v-for="(item,index) in work.waterRegistList" :key="index" :span="work.waterRegistList.length<4?24/work.waterRegistList.length:6">
                    <el-radio :label="item.outletsName">{{ item.outletsName }}</el-radio>
                  </el-col>
                </el-radio-group>
              </el-row>
            </el-form-item>
            <!-- <el-form-item label="业务类型" prop="waterType" label-width="100px">
              <el-radio-group v-model="form.waterType">
                <el-radio-button label="新装" />
                <el-radio-button label="加装" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="用水性质" prop="waterNature" label-width="100px">
              <el-radio-group v-model="form.waterNature">
                <el-radio-button label="生活" />
                <el-radio-button label="非生活" />
                <el-radio-button label="特种" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="日用水量" prop="waterDemand" label-width="100px">
              <el-input v-model="form.waterDemand" style="width: 221px;" placeholder="请填写" /> 吨/日
            </el-form-item>
            <el-form-item label="水表口径" prop="waterMm" label-width="100px">
              <el-input v-model="form.waterMm" style="width: 221px;" placeholder="请填写" /> 毫米
            </el-form-item> -->
          </template>

          <template v-if="work.naturalGasRegistList&&work.naturalGasRegistList.length>0">
            <el-form-item label="天然气" prop="naturalGasRegistAddress" label-width="80px">
              <el-row>
                <el-radio-group v-model="form.naturalGasRegistAddress">
                  <el-col v-for="(item,index) in work.naturalGasRegistList" :key="index" :span="work.naturalGasRegistList.length<4?24/work.naturalGasRegistList.length:6">
                    <el-radio :label="item.outletsName">{{ item.outletsName }}</el-radio>
                  </el-col>
                </el-radio-group>
              </el-row>
            </el-form-item>
            <!-- <el-form-item label="业务类型" prop="gasType" label-width="120px">
              <el-radio-group v-model="form.gasType">
                <el-radio-button label="新装" />
                <el-radio-button label="扩容" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="用气性质" prop="gasNature" label-width="140px">
              <el-radio-group v-model="form.gasNature">
                <el-radio-button label="生产" />
                <el-radio-button label="生活" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="用气需求" prop="gasDemand" label-width="140px">
              <el-input v-model="form.gasDemand" style="width: 221px;" placeholder="请填写" /> 立方米/日
            </el-form-item> -->
          </template>
          <template v-if="work.internetRegistList&&work.internetRegistList.length>0">
            <el-form-item label="网络" prop="internetRegistAddress" label-width="80px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-checkbox-group v-model="form.internetRegistAddress">
                    <el-checkbox v-for="(item,index) in work.internetRegistList" :key="index" :label="item.outletsName">{{ item.outletsName }}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-row>
            </el-form-item>
            <!-- <el-form-item label="带宽需求" prop="internetMb" label-width="120px">
              <el-input v-model="form.internetMb" style="width: 200px;" placeholder="请填写" /> MB
            </el-form-item>
            <el-form-item label="固定电话安装数量" prop="telePhoneCount" label-width="180px">
              <el-input v-model="form.telePhoneCount" style="width: 200px;" placeholder="请填写" />
            </el-form-item>
            <el-form-item label="网络安装地址" prop="internetAddress" label-width="150px">
              <el-input v-model="form.internetAddress" style="width: 500px;" placeholder="请填写" />
            </el-form-item> -->
          </template>
          <el-form-item class="btn-group text-center" label-width="0">
            <el-button @click="handleSaveDraft(true)">暂存草稿</el-button>
            <el-button @click="$router.go(-1)">上一步</el-button>
            <el-button v-if="businessShow.dlchecked||businessShow.waterchecked||businessShow.rqchecked" type="primary" @click="handleNext">下一步</el-button>
            <el-button v-else type="primary" @click="handleNext">下一步，生成表单预览</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/index'
import { preview, queryWaterLectricityEtworkList } from '@/api/index'
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      baseInfo: {}, // 基础信息
      curArea: {}, // 当前地区数据
      companyType: '',
      type: '',
      work: {}, // 网点列表
      form: {
        internetRegistAddress: [],
        naturalGasRegistAddress: '',
        waterRegistAddress: '',
        // 07-07
        gasType: '',
        gasNature: '',
        gasDemand: '',
        waterType: '',
        waterDemand: '',
        waterMm: '',
        waterNature: '',
        internetMb: '',
        telePhoneCount: '',
        internetAddress: ''
      },
      rules: {
        waterRegistAddress: [{ required: true, message: '请至少选择一个水务单位', trigger: 'change' }],
        naturalGasRegistAddress: [{ required: true, message: '请至少选择一个天然气单位', trigger: 'change' }],
        internetRegistAddress: [{ type: 'array', required: true, message: '请至少选择一个网络', trigger: 'change' }],

        gasType: [{ required: true, message: '请选择', trigger: 'change' }],
        gasDemand: [{ required: true, message: '请选择', trigger: 'change' }],
        gasNature: [{ required: true, message: '请选择', trigger: 'change' }],

        waterMm: [{ required: true, message: '请输入', trigger: 'change' }],
        waterDemand: [{ required: true, message: '请选择', trigger: 'change' }],
        waterType: [{ required: true, message: '请选择', trigger: 'change' }],
        waterNature: [{ required: true, message: '请输入', trigger: 'change' }],

        internetMb: [{ required: true, message: '请输入', trigger: 'change' }],
        telePhoneCount: [{ required: true, message: '请输入', trigger: 'change' }],
        internetAddress: [{ required: true, message: '请输入', trigger: 'change' }]
      }
    }
  },
  computed: {
    draftInfo() {
      return this.$store.state.draft.draftInfo
    },
    businessShow() {
      return this.$utils.getItem('businessShow')
    },
    waterLectricityEtwork() {
      return this.$utils.getItem('waterLectricityEtwork')
    }
  },
  created() {
    // 获取网点
    let areacode = null
    areacode = this.$utils.getItem('nameApply').areaCode
    console.log(areacode, 'areacode')
    queryWaterLectricityEtworkList({ areacode,
      waterLectricityEtwork: {
        isWaterRegist: this.waterLectricityEtwork.isWaterRegist ? 1 : 0,
        isNaturalGasRegist: this.waterLectricityEtwork.isNaturalGasRegist ? 1 : 0,
        isInternetRegist: this.waterLectricityEtwork.isInternetRegist ? 1 : 0
      }}).then(res => {
      this.work = res.data
    })
  },
  activated() {
    this.type = this.$route.query.type
    if (this.$utils.getLocalItem('baseInfo')) {
      this.baseInfo = this.$utils.getLocalItem('baseInfo')
    }
    if (this.$utils.getLocalItem('curArea')) {
      this.curArea = this.$utils.getLocalItem('curArea')
    }
    // 先赋值再拿名称申报的名称覆盖
    this.getAreaInfo().then(async () => {
      // 获取草稿详情
      if (this.$utils.getItem('draftNumber')) {
        this.$store.dispatch('draft/getDraftDetail', this.$utils.getItem('draftNumber')).then(async res => {
          if (res.waterLectricityEtwork) {
            const waterLectricityEtwork = res.waterLectricityEtwork
            this.form = waterLectricityEtwork
            this.form.internetRegistAddress = this.form.internetRegistAddress.length > 0 ? this.form.internetRegistAddress.split(',') : []
          }
        })
      }
    })
  },
  methods: {
    clearValidate() {
      this.$refs['form'].clearValidate()
    },
    // 保存草稿
    handleSaveDraft(showTips = false) {
      return new Promise((resolve, reject) => {
        const data = {
          ...this.draftInfo, // 原有数据
          waterLectricityEtwork: this.waterLectricityEtwork, // 现在数据覆盖原有数据
          businessType: '2',
          showTips // 是否显示提示
        }
        this.$store.dispatch('draft/saveDraft', data).then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    getAreaInfo() {
      return new Promise(resolve => {
        const params = {
          'inData': {},
          'job': 'HuBei_DistCode'
        }
        this.$utils.showLoading()
        this.$api.startJob(params).then(async res => {
        // 后续远程更新完十堰经济技术开发区再处理
          const areaCode = this.curArea.areaCode
          const areaLabel = this.curArea.areaLabel
          const area = this.$utils.getItem('area')
          const arr = res.outData.data.filter(item => item.label.trim() === this.curArea.city)
          arr[0].children = arr[0].children.filter(item => item.label.trim() === area.label.trim())
          this.areaList = [
            {
              value: '420000',
              label: '湖北省',
              children: arr
            }
          ]
          areaCode.push(area.code)
          this.form.areaArr = areaCode // 地址码
          areaLabel.push(area.label)
          this.form.accountOpenArea = areaLabel.join(' ') // 地址label
          this.form.addressAreaCode = areaCode[2] // 赋值中文以后赋值code
          this.$utils.hideLoading()
          resolve()
        })
      })
    },
    handleNext() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          console.log(this.form)
          if (+this.form.internetRegistAddress.length === 0) {
            this.form.internetRegistAddress = ['中国电信', '中国移动', '中国联通']
          }
          this.waterLectricityEtwork.naturalGasRegistAddress = this.form.naturalGasRegistAddress
          this.waterLectricityEtwork.waterRegistAddress = this.form.waterRegistAddress
          this.waterLectricityEtwork.internetRegistAddress = this.form.internetRegistAddress.join(',')
          this.waterLectricityEtwork.outlets = this.form.internetRegistAddress.join(',')
          await this.handleSaveDraft()
          this.$utils.setItem('waterLectricityEtwork', this.waterLectricityEtwork)
          if (this.businessShow.waterchecked) {
            this.$router.push({ path: '/form/waterRegister', query: { ...this.$route.query }})
            return
          }
          if (this.businessShow.dlchecked) {
            this.$router.push({ path: '/form/electricityAllowed', query: { ...this.$route.query }})
            return
          }
          if (this.businessShow.rqchecked) {
            this.$router.push({ path: '/form/gasRegister', query: { ...this.$route.query }})
            return
          }
          console.log('waterLectricityEtwork', this.waterLectricityEtwork)
          console.log('draftInfo', this.draftInfo)
          const nameApply = this.draftInfo.nameApply // 名称申报
          const address = this.draftInfo.address
          const scope = this.draftInfo.scope
          const member = this.draftInfo.member // 人员信息+设立人员信息
          const otherInfo = this.draftInfo.otherInfo || this.$utils.getItem('otherInfo')
          const data = {
            ...nameApply,
            ...address, // 地址申报
            scope, // 经营范围
            ...member, // 人员信息
            ...otherInfo, // 其他信息
            // companyType: formatCompanyType(nameApply.companyType),
            industryType: { // 所选行业类型
              IndustryCode: nameApply.industryFormulated.split('-')[0], // 行业类型对应唯一标识
              IndustryName: nameApply.industryFormulated.split('-')[2] // 行业类型名称
            },
            industryFormulated: nameApply.industryFormulated.split('-')[1], // 行业描述
            area: nameApply.area.join(' ')
          }
          console.log(data)
          this.$loading({ text: '正在获取pdf内容' })
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .utilityForm{
    background: url('../../assets/images/homePage_bg.png') no-repeat;
    background-size: 100% auto;
    background-position: left bottom;
    position: relative;
    height: 100vh;
    .utilityContainer{
      width: 1250px;
      margin: 0 auto;
      .utilityHeader{
        text-align: center;
        font-size: 32px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        line-height: 54px;
        color: #464646;
        margin-top: 40px;
      }
      .utilityMain{
        // position: relative;
        margin-top: 10px;
        ::v-deep .el-form{
          .el-form-item{
            .el-form-item__label{
              width: 63.86px;
              margin-top: 4px;
              font-size: 16px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              line-height: 29px;
              color: #000000;
              vertical-align: baseline;
            }
            .el-row{
              .el-col-6{
                padding: 5px 0;
              }
            }
          }
        }
      }
      .btn-group {
        padding-top: 120px;
        padding-bottom: 30px;
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
            color: #fff;
          }
        }
      }
    }
  }
</style>
