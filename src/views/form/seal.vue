<template>
  <div class="address-form">
    <!-- <page-header /> -->
    <breadcrumb v-show="$route.query.mode !== 'test'" />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <el-form ref="form" label-position="left" class="form" :model="form" :rules="rules" label-width="94px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item class="radio" label="是否预约刻章印章" label-width="274px">
              <el-radio-group v-model="form.isReservationEngravedSeal" disabled>
                <el-radio :label="true" border @change="clearValidate">是</el-radio>
                <el-radio :label="false" border @change="clearValidate">否</el-radio>
              </el-radio-group>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所在地区" prop="addressArea" label-width="120px">
              <el-cascader
                ref="addressArea"
                v-model="form.addressArea"
                :options="areaList"
                separator=" "
                disabled
                :props="{ expandTrigger: 'hover' }"
                placeholder="请选择行政区划"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="印章领取方式" prop="receiveWay" label-width="120px">
              <el-select v-model="form.receiveWay" placeholder="请选择">
                <el-option
                  v-for="item in useWays"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item class="house-pic" label="法定代表人上半身照片" label-width="200px" prop="pictureUrl">
              <upload-code placement="bottom-start" alias="pictureUrl" @update="updateFileList" />
              <upload-file v-show="form.pictureUrl" :file-paths="[form.pictureUrl]" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <el-form-item label="刻章网点" prop="engravedChapterOutlets" label-width="120px" />
          </el-col>
          <el-col :span="21">
            <div class="seal-adress-box">
              <div class="seal-adress-list">
                <el-radio-group v-model="form.engravedChapterOutlets" :disabled="isAutoCheckSealBranch">
                  <el-radio v-for="(item,index) in printsShopList" :key="index" :label="item.outletsName" class="seal-adress-item">
                    <div class="seal-adress-text">
                      <div style="color:#000">{{ item.outletsName }}<span style="font-size:14px">（{{ item.outletsAddr }}）</span></div>
                      <div style="margin-top:10px;color:#999;font-size:15px"><span>联系人：{{ item.outletsContactPerson }} </span><span style="margin-left:20px">联系电话：{{ item.outletsPhone }}</span></div>
                    </div>
                  </el-radio>
                </el-radio-group>
              </div>
            </div>
            <div v-if="isAutoCheckSealBranch" class="alert">
              <span style="color: red;">温馨提示：</span>
              因业务调整，刻章网点暂不支持手动选择，待您提交业务后由系统自动分配刻章网点，请知悉！</div>
          </el-col>
        </el-row>
        <el-form-item class="btn-group text-center" label-width="0">
          <el-button @click="handleSaveDraft(true)">暂存草稿</el-button>
          <el-button @click="$router.go(-1)">上一步</el-button>
          <el-button v-if="businessShow.sbchecked||businessShow.swchecked||businessShow.yhchecked || businessShow.gjjchecked ||businessShow.ylchecked || businessShow.sdqwchecked||businessShow.dlchecked" type="primary" @click="handleNext">下一步</el-button>
          <el-button v-else type="primary" @click="handleNext">下一步，生成表单预览</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/index'
import { preview, getOutletsList } from '@/api/index'
import { qkSealList } from '@/config/baseData'
import UploadFile from '@/components/UploadFile/camera'
import UploadCode from '@/components/UploadFile/uploadCode'
export default {
  components: {
    Breadcrumb,
    UploadFile,
    UploadCode
  },
  data() {
    return {
      baseInfo: {}, // 基础信息
      curArea: {}, // 当前地区数据
      companyType: '',
      type: '',
      areaList: [], // 行政区划
      useWays: ['大厅领取'],
      rules: {
        isReservationEngravedSeal: [
          { required: true, message: '请选择是否预约刻章印章', trigger: 'change' }
        ],
        receiveWay: [
          { required: true, message: '请选择领取方式', trigger: 'change' }
        ],
        engravedChapterOutlets: [
          { required: true, message: '请选择刻章网点', trigger: 'change' }
        ],
        pictureUrl: [
          { required: true, message: '请上传法人上半身照片', trigger: 'change' }
        ]
      },
      printsShopList: [
      //   { // 刻章网点列表
      //   printsShopName: '十堰恒创制章有限公司',
      //   printsShopAdress: '(地址：十堰经济技术开发区广州路27号政务服务中心一楼)',
      //   contact: '吴志艳',
      //   phone: '13997820171'
      // }
      ],
      form: {
        isReservationEngravedSeal: true, // 是否预约刻章印章
        receiveWay: '大厅领取', // 领取方式
        engravedChapterOutlets: '', // 刻章网点
        address: '', // 经营场所详细地址
        addressArea: [], // 行政区划
        // areaArr: [], // 经营场所行政区划数组
        addressAreaCode: '', // 行政区划代码
        pictureUrl: '' // 法人半身照
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
    // 后台自动分配刻章网店，不给用户选择
    isAutoCheckSealBranch() {
      return this.$utils.getLocalItem('curArea').district === '硚口区'
    }
  },
  created() {
    let areacode = null
    // if (this.$utils.getLocalItem('curArea').city === '十堰市') {
    //   areacode = 420382
    // }
    // if (this.$utils.getLocalItem('curArea').city === '荆州市') {
    //   areacode = 421000
    // }
    areacode = this.$utils.getItem('nameApply').areaCode
    // 获取刻章网点
    // getOutletsList({ areacode: areacode, serviceProvider: '刻章' }).then(res => {
    //   this.printsShopList = res.data || []
    // })

    // 硚口区轮训刻章网店
    if (this.isAutoCheckSealBranch) {
      this.printsShopList = qkSealList
      this.rules.engravedChapterOutlets = []
    } else {
      // 获取刻章网点
      getOutletsList({ areacode: areacode, serviceProvider: '刻章' }).then(res => {
        this.printsShopList = res.data || []
      })
    }
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
          if (res.engravedSeal) {
            const engravedSealForm = res.engravedSeal
            this.form = engravedSealForm
          }
        })
      }
    })
  },
  methods: {
    clearValidate() {
      this.$refs['form'].clearValidate()
    },
    // 更新扫码上传数据
    updateFileList(val) {
      console.log('扫码上传回调：', val)
      if (val.type === 'pictureUrl' && val.data.length > 1) {
        this.$utils.showWarn('法人上半身照片仅支持单张，已去除多余照片')
      }
      const url = val.data[0]
      console.log('ssss:', url)
      this.$set(this.form, val.type, url)
    },
    // 保存草稿
    handleSaveDraft(showTips = false) {
      return new Promise((resolve, reject) => {
        const data = {
          ...this.draftInfo, // 原有数据
          engravedSeal: this.form, // 现在数据覆盖原有数据
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
          this.form.addressArea = areaCode // 地址码
          areaLabel.push(area.label)
          this.form.address = areaLabel.join(' ') // 地址label
          this.form.addressAreaCode = areaCode[2] // 赋值中文以后赋值code
          this.$utils.hideLoading()
          resolve()
        })
      })
    },
    handleNext() {
      console.log(this.form)
      this.$refs['form'].validate(async valid => {
        if (valid) {
          await this.handleSaveDraft()
          this.$utils.setItem('engravedSeal', this.form)
          const nextPageBox = this.draftInfo.businessShow
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
          console.log(this.draftInfo)
          const nameApply = this.draftInfo.nameApply // 名称申报
          const address = this.draftInfo.address
          const scope = this.draftInfo.scope
          const member = this.draftInfo.member // 人员信息+设立人员信息
          const otherInfo = this.draftInfo.otherInfo
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
<style lang='scss' scoped>
.address-form {
  .box {
    width: 900px;
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
      padding-top: 57px;
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
      .promise {
        width: 340px;
        margin: 0 auto;
        .link {
          color: #025BFF;
          cursor: pointer;
        }
      }
      .site-btn {
        text-align:right;
        .el-button {
          width: 130px;
          height: 43px;
          padding: 0;
          box-sizing: border-box;
          text-align: center;
          border: 1px solid #3162E8;
          color: #3162E8;
        }
      }
      .radio {
        height: 43px;
        .el-radio {
          min-width: 60px;
          height: 43px;
          padding: 0 20px;
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
        padding-top: 60px;
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
            color: #fff;
          }
        }
      }
    }
    .name_dialog .dialog_wrap{
      padding: 0 58px;
    }
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
      font-size: 15px;
      list-style: none;
      line-height: 26px;
      text-indent: 2em;
      p {
        padding-top: 10px;
        line-height: 26px;
        &:first-child {
          font-weight: bold;
          font-size: 18px;
          line-height: 32px;
        }
      }
    }
    .name_dialog .title2{
      padding-top: 35px;
      font-size: 15px;
      color: #464646;
      margin-left: -8px;
      line-height: 26px;
      text-indent:2em;
    }
    .name_dialog .button{
      width: 155px;
      padding: 15px 0;
      text-align: center;
      border-radius: 4px;
      margin: 30px auto 15px;
      cursor: pointer;
    }
  }
  .list-page {
  ::v-deep .el-dialog__header {
    padding: 0;
  }
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  .w-1000 {
    width: 1000px;
    margin: 0 auto;
  }
  .sign_dialog {
    .dialog_wrap {
      text-align: center;
      padding: 30px 0 30px 0;
      .ewm{
        width: 300px;
        margin-bottom: 15px;
      }
    }
  }

  .title {
    text-align: center;
    padding-top: 29px;
    font-size: 28px;
    font-weight: 600;
    color: #333333;
    line-height: 40px;
  }
  .tips {
    display: flex;
    height: 30px;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #7F7E7E;
    padding-top: 15px;
    img {
      width: 22px;
      height: 22px;
      margin-right: 4px;
    }
  }
  .form {
    padding-top: 36px;
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
    .promise {
      width: 340px;
      margin: 0 auto;
    }
    .radio {
      height: 43px;
      .el-radio {
        min-width: 60px;
        height: 43px;
        padding: 0 20px;
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
      padding-top: 30px;
      &.dialog-btn {
        padding-bottom: 20px;
      }
      .el-button {
        width: 100px;
        height: 48px;
        padding: 0;
        box-sizing: border-box;
        text-align: center;
        line-height: 48px;
        border: 1px solid #3162E8;
        color: #3162E8;
      }
    }
  }
  .dialog-wrap {
    padding-top: 76px;
    img {
      width: 86px;
      height: 86px;
    }
    .desc {
      font-size: 28px;
      font-weight: 600;
      color: #333333;
      padding-top: 59px;
      padding-bottom: 92px;
    }
    .print-tips {
      span {
        color: red;
      }

    }
  }
  .dialog-qrcode {
    padding: 45px;
    .dialog-title {
      font-size: 28px;
      font-weight: bold;
      color: #333333;
      padding-bottom: 35px;
    }
    img {
      display: block;
      width: 326px;
      height: 325px;
      margin: 0 auto;
    }
    .auth-btn {
      width: 155px;
      height: 48px;
      margin: 35px auto 0;
      color:#3162E8;
      border: 1px solid #3162E8;
    }
  }
}
}
.seal-adress-box{
    border: #ccc solid 1px;
    border-radius:10px ;
    .seal-adress-list{
        overflow-y: auto;
        height: 300px;
        width: 100%;
        padding: 20px;
        .seal-adress-item{
            display: block;
            .seal-adress-text{
                display: inline-block;
                vertical-align: middle;
                font-size: 18px;
                padding: 10px;
            }
        }
    }
}

.alert {
  color: #888;
	margin: 15px 0 0;
}
</style>
