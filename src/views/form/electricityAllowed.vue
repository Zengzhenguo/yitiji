<!--
 * @Author: your name
 * @Date: 2022-03-16 09:46:55
 * @LastEditTime: 2022-04-26 10:33:50
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \ec-gov-biz-hubei-terminal\src\views\form\electricityAllowed.vue
-->
<template>
  <div class="address-form">
    <!-- <page-header /> -->
    <breadcrumb v-show="$route.query.mode !== 'test'" />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <el-form v-if="$route.query.type ==='9210commercial'" ref="form" label-position="left" class="form" :model="form" :rules="rules" label-width="94px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="报装类型" prop="newspaperType" label-width="140px">
              <el-select v-model="form.newspaperType" placeholder="请选择">
                <el-option
                  v-for="item in newspaperTypeList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请容量" prop="applyCapacity" label-width="140px">
              <el-input v-model="form.applyCapacity" style="width: 221px;" placeholder="请填写" /> kVA
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产权文件证明" prop="propertyDoc" label-width="140px">
              <el-select v-model="form.propertyDoc" placeholder="请选择">
                <el-option
                  v-for="item in propertyDocList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="" prop="pictureUrl" label-width="140px">
              <img v-if="form.pictureUrl" class="picture-img" :src="$utils.getFile(form.pictureUrl)" alt="" />
              <upload-code placement="bottom-start" alias="pictureUrl" @update="updateFileList" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="网点" prop="outlets" label-width="120px" />
          </el-col>
          <el-col :span="20">
            <div class="seal-adress-box">
              <div class="seal-adress-list">
                <el-radio-group v-model="form.outlets">
                  <el-radio v-for="(item,index) in outletsList" :key="index" :label="item.outletsName" class="seal-adress-item">
                    <div class="seal-adress-text">
                      <div style="color:#000">{{ item.outletsName }}<span style="font-size:14px">（{{ item.outletsAddr }}）</span></div>
                      <div style="margin-top:10px;color:#999;font-size:15px"><span>联系人：{{ item.outletsContactPerson }} </span><span style="margin-left:20px">联系电话：{{ item.outletsPhone }}</span></div>
                    </div>
                  </el-radio>
                </el-radio-group>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-form-item class="btn-group text-center" label-width="0">
          <el-button @click="handleSaveDraft(true)">暂存草稿</el-button>
          <el-button @click="$router.go(-1)">上一步</el-button>
          <el-button v-if="businessShow.rqchecked" type="primary" @click="handleNext">下一步</el-button>
          <el-button v-else type="primary" @click="handleNext">下一步，生成表单预览</el-button>
        </el-form-item>
      </el-form>
      <el-form v-if="$route.query.type ==='commercial'||$route.query.type ==='commercialRegister'" ref="form" label-position="left" class="form" :model="form" :rules="rules" label-width="94px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="业务类型" prop="newspaperType" label-width="120px">
              <el-radio-group v-model="form.newspaperType">
                <el-radio-button label="新装" />
                <el-radio-button label="增容" />
                <el-radio-button label="临时用电" />
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主供容量" prop="mainSupplyCapacity" label-width="120px">
              <el-input v-model="form.mainSupplyCapacity" style="width: 200px;" placeholder="请填写" /> 千伏安（千瓦）
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备供容量" prop="reserveCapacity" label-width="120px">
              <el-input v-model="form.reserveCapacity" style="width: 200px;" placeholder="请填写" /> 千伏安（千瓦）
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预约时间" prop="reserveTime" label-width="120px">
              <el-date-picker
                v-model="form.reserveTime"
                type="date"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="网点" prop="outlets" label-width="120px">
              <div class="seal-adress-box">
                <div class="seal-adress-list">
                  <el-radio-group v-model="form.outlets">
                    <el-radio v-for="(item,index) in outletsList" :key="index" :label="item.outletsName" class="seal-adress-item">
                      <div class="seal-adress-text">
                        <div style="color:#000">{{ item.outletsName }}<span style="font-size:14px">（{{ item.outletsAddr }}）</span></div>
                        <div style="margin-top:10px;color:#999;font-size:15px"><span>联系人：{{ item.outletsContactPerson }} </span><span style="margin-left:20px">联系电话：{{ item.outletsPhone }}</span></div>
                      </div>
                    </el-radio>
                  </el-radio-group>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="btn-group text-center" label-width="0">
          <el-button @click="handleSaveDraft(true)">暂存草稿</el-button>
          <el-button @click="$router.go(-1)">上一步</el-button>
          <el-button v-if="businessShow.rqchecked" type="primary" @click="handleNext">下一步</el-button>
          <el-button v-else type="primary" @click="handleNext">下一步，生成表单预览</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/index'
import { preview, getOutletsList } from '@/api/index'
import UploadCode from '@/components/UploadFile/uploadCode'
export default {
  components: {
    Breadcrumb,
    UploadCode
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      baseInfo: {}, // 基础信息
      curArea: {}, // 当前地区数据
      type: '',
      rules: {
        newspaperType: [
          { required: true, message: '请选择报装类型', trigger: 'change' }
        ],
        applyCapacity: [
          { required: true, message: '请填写申请容量', trigger: 'blur' },
          { pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/, message: '请填写大于零的小数或整数' }
        ],
        mainSupplyCapacity: [
          { required: true, message: '请填写主供容量', trigger: 'blur' },
          { pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/, message: '请填写大于零的小数或整数' }
        ],
        reserveCapacity: [
          { required: true, message: '请填写备供容量', trigger: 'blur' },
          { pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/, message: '请填写大于零的小数或整数' }
        ],
        reserveTime: [
          { required: true, message: '请选择预约时间', trigger: 'change' }
        ],
        propertyDoc: [
          { required: true, message: '请选择产权文件证明类型', trigger: 'change' }
        ],
        pictureUrl: [
          { required: true, message: '请上传产权文件证明', trigger: 'change' }
        ],
        outlets: [
          { required: true, message: '请选择网点', trigger: 'change' }
        ]
      },
      newspaperTypeList: ['高压新装', '低压非居民新装'], // 报装类型
      propertyDocList: ['产权证', '国有土地使用证', '集体土地使用证', '购房合同', '法律文书', '产权合法证明'], // 产权文件证明列表
      // 电力网点
      outletsList: [],
      form: {
        newspaperType: '',
        applyCapacity: '',
        propertyDoc: '',
        pictureUrl: '',
        outlets: '',
        mainSupplyCapacity: '',
        reserveCapacity: '',
        reserveTime: ''
      }
    }
  },
  computed: {
    draftInfo() {
      return this.$store.state.draft.draftInfo
    },
    businessShow() {
      return this.$utils.getItem('businessShow')
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
    // 获取电力网点
    getOutletsList({ areacode: areacode, serviceProvider: '电力' }).then(res => {
      this.outletsList = res.data || []
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
    // 获取草稿详情
    if (this.$utils.getItem('draftNumber')) {
      this.$store.dispatch('draft/getDraftDetail', this.$utils.getItem('draftNumber')).then(async res => {
        if (res.electricity) {
          const electricity = res.electricity
          this.form = electricity
        }
      })
    }
  },
  methods: {
    clearValidate() {
      this.$refs['form'].clearValidate()
    },
    // 更新扫码上传数据
    updateFileList(val) {
      console.log('扫码上传回调：', val)
      // const arr = [
      //   ...this.PDF.pictureUrl,
      //   ...val.data
      // ]
      this.form.pictureUrl = val.data[0]
    },
    // 保存草稿
    handleSaveDraft(showTips = false) {
      return new Promise((resolve, reject) => {
        const data = {
          ...this.draftInfo, // 原有数据
          electricity: this.form, // 现在数据覆盖原有数据
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
    handleNext() {
      console.log(this.form)
      this.$refs['form'].validate(async valid => {
        if (valid) {
          await this.handleSaveDraft()
          this.$utils.setItem('electricity', this.form)
          if (this.businessShow.rqchecked) {
            this.$router.push({ path: '/form/gasRegister', query: { ...this.$route.query }})
            return
          }
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
      .picture-img{
        width: 100%;
        height: 100%;
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
}
.socialSecurity /deep/ .el-form-item__label{
  line-height: 20px;
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
</style>
