<!--
 * @Author: your name
 * @Date: 2022-04-21 09:51:48
 * @LastEditTime: 2022-04-26 10:26:59
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \ec-gov-biz-hubei-terminal\src\views\form\gasRegistration.vue
-->
<template>
  <div class="address-form">
    <!-- <page-header /> -->
    <breadcrumb v-show="$route.query.mode !== 'test'" />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <el-form ref="form" label-position="left" class="form" :model="form" :rules="rules" label-width="94px">
        <el-row :gutter="20">
          <el-table ref="singleTable" :data="form.naturalGasEequipmentList" highlight-current-row style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column property="deviceName" label="设备名称" width="140" align="center">
              <template slot-scope="{ row }">
                <el-input v-model="row.deviceName" style="width: 110px;" placeholder="请填写设备名称" />
              </template>
            </el-table-column>
            <el-table-column property="num" label="数量" width="140" align="center">
              <template slot-scope="{ row }">
                <el-input v-model="row.num" style="width: 110px;" placeholder="请填写数量" />
              </template>
            </el-table-column>
            <el-table-column property="burnerDiameter" label="燃烧器口径" width="140" align="center">
              <template slot-scope="{ row }">
                <el-input v-model="row.burnerDiameter" style="width: 110px;" placeholder="请填写燃烧器口径" />
              </template>
            </el-table-column>
            <el-table-column label="用气压力（KPA）" align="center">
              <el-table-column property="work" label="工作" width="140" align="center">
                <template slot-scope="{ row }">
                  <el-input v-model="row.work" style="width: 110px;" placeholder="请填写工作" />
                </template>
              </el-table-column>
              <el-table-column property="equipment" label="设备" width="140" align="center">
                <template slot-scope="{ row }">
                  <el-input v-model="row.equipment" style="width: 110px;" placeholder="请填写设备" />
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="天然气负荷（方/小时）" align="center">
              <el-table-column property="normalWork" label="正常工作" width="140" align="center">
                <template slot-scope="{ row }">
                  <el-input v-model="row.normalWork" style="width: 110px;" placeholder="请填写正常工作" />
                </template>
              </el-table-column>
              <el-table-column property="fullLoad" label="满负荷" width="140" align="center">
                <template slot-scope="{ row }">
                  <el-input v-model="row.fullLoad" style="width: 110px;" placeholder="请填写满负荷" />
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="操作" width="88" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleAddRow(scope.$index, scope.row)">
                  添加
                </el-button>
                <el-button size="mini" type="text" @click="handleDeleteRow(scope.$index, scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>>
          </el-table>
        </el-row>
        <el-row :gutter="20" style="margin-top:20px">
          <el-col :span="12">
            <el-form-item label="预约时间" prop="reserveTime" label-width="140px">
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
          <!-- <el-button v-if="businessShow.dlchecked||businessShow.rqchecked" type="primary" @click="handleNext">下一步</el-button> -->
          <el-button type="primary" @click="handleNext">下一步，生成表单预览</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/index'
import { preview, getOutletsList } from '@/api/index'
export default {
  components: {
    Breadcrumb
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
        reserveTime: [
          { required: true, message: '请选择预约时间', trigger: 'change' }
        ],
        outlets: [
          { required: true, message: '请选择网点', trigger: 'change' }
        ]
      },
      // 天燃气网点
      outletsList: [],
      form: {
        outlets: '',
        reserveTime: '',
        naturalGasEequipmentList: [{
          deviceName: '',
          num: '',
          burnerDiameter: '',
          work: '',
          equipment: '',
          normalWork: '',
          fullLoad: ''
        }]
      }
    }
  },
  computed: {
    draftInfo() {
      return this.$store.state.draft.draftInfo
    },
    naturalGas() {
      return this.$utils.getItem('naturalGas')
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
    // 获取天然气网点
    getOutletsList({ areacode: areacode, serviceProvider: '天然气' }).then(res => {
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
        if (res.naturalGas) {
          const naturalGas = res.naturalGas
          this.form = naturalGas
        }
      })
    }
  },
  methods: {
    clearValidate() {
      this.$refs['form'].clearValidate()
    },
    // 添加行
    handleAddRow() {
      this.form.naturalGasEequipmentList.push({
        deviceName: '',
        num: '',
        burnerDiameter: '',
        work: '',
        equipment: '',
        normalWork: '',
        fullLoad: ''
      })
    },
    // 删除行
    handleDeleteRow(index) {
      if (this.form.naturalGasEequipmentList.length === 1) {
        this.$utils.showError('最少添加一条数据！')
        return
      }
      this.form.naturalGasEequipmentList.splice(index, 1)
    },
    // 保存草稿
    handleSaveDraft(showTips = false) {
      return new Promise((resolve, reject) => {
        const data = {
          ...this.draftInfo, // 原有数据
          naturalGas: this.form, // 现在数据覆盖原有数据
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
          let bold = true
          this.form.naturalGasEequipmentList.forEach(element => {
            if (!element.deviceName || !element.num || !element.burnerDiameter ||
            !element.work || !element.equipment || !element.normalWork || !element.fullLoad) {
              this.$utils.showError('请将表格信息补充完整！')
              bold = false
              return
            }
          })
          if (!bold) {
            return
          }
          await this.handleSaveDraft()
          this.$utils.setItem('naturalGas', this.form)
          //   if (this.businessShow.rqchecked) {
          //     this.$router.push({ path: '/form/gasRegister', query: { ...this.$route.query }})
          //     return
          //   }
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
    width: 1110px;
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
