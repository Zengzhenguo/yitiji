<template>
  <div class="member-form">
    <!-- <page-header /> -->
    <breadcrumb />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <!-- <div class="tips">
        <img src="../../assets/images/after.png" />
        <span>请经办人、全体股东、董监高管理人员都下载《登记注册身份验证》APP认证身份，再提交申请</span>
      </div> -->
      <el-form ref="form" label-position="left" class="form" :model="form" :rules="rules" label-width="84px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="职工人数（人）" prop="workerNumber" label-width="140px">
              <el-input v-model="form.workerNumber" placeholder="请输入职工人数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应体检人数（人）" prop="medicalNumber" label-width="160px">
              <el-input v-model="form.medicalNumber" placeholder="请输入应体检人数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="添加类型">
              <el-button class="plain" @click="handleShowDialog(1)">添加食品安全管理人员</el-button>
              <el-button class="plain" @click="handleShowDialog(2)">添加从业人员</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table ref="singleTable" :data="form.personnelList" highlight-current-row style="width: 100%">
              <el-table-column type="index" label="序号" width="80" align="center" />
              <el-table-column property="idcName" label="姓名/名称" width="200" align="center" />
              <el-table-column label="类型" width="200" align="center">
                <template slot-scope="{ row }">
                  {{ row.type }}
                </template>
              </el-table-column>
              <el-table-column label="证件号码" align="center">
                <template slot-scope="{ row }">
                  {{ row.idcNumber }}
                </template>
              </el-table-column>
              <el-table-column label="联系电话" align="center">
                <template slot-scope="{ row }">
                  {{ row.phone }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">
                    编辑
                  </el-button>
                  <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>>
            </el-table>
          </el-col>
        </el-row>
        <el-form-item class="btn-group text-center" label-width="0">
          <el-button @click="handleSaveDraft(true)">暂存草稿</el-button>
          <el-button @click="$router.go(-1)">上一步</el-button>
          <el-button type="primary" @click="handleNext">下一步</el-button>
        </el-form-item>
      </el-form>
      <!--食品安全管理人员弹窗-->
      <el-dialog
        class="dialog"
        :visible.sync="showNaturalDialog"
        :show-close="false"
        width="945px"
        :close-on-click-modal="false"
      >
        <div slot="title" class="custom-title">
          <div class="label">{{ dialogType == 1 ? '添加食品安全管理人员' : '添加从业人员' }}</div>
          <div class="close" @click="showNaturalDialog = false">关闭</div>
        </div>
        <div>
          <el-form
            ref="natural-form"
            label-position="left"
            class="form"
            :model="personnelForm"
            label-width="84px"
            style="padding-top: 0;"
          >
            <el-row :gutter="20">
              <el-col :span="10">
                <el-form-item label="人员姓名">
                  <el-input v-model="personnelForm.idcName" placeholder="请填写" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="移动电话">
                  <el-input v-model="personnelForm.phone" maxlength="11" placeholder="请填写" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="10">
                <el-form-item label="证件类型">
                  <el-select v-model="personnelForm.idcType" placeholder="请选择">
                    <el-option label="身份证" value="身份证" />
                    <!-- <el-option label="香港往来内地通行证" value="香港往来内地通行证" />
                    <el-option label="澳门往来内地通行证" value="澳门往来内地通行证" /> -->
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="证件号码">
                  <el-input v-model="personnelForm.idcNumber" maxlength="18" placeholder="请填写" />
                </el-form-item>
              </el-col>
              <el-col :span="20">
                <el-form-item label="证件地址">
                  <el-input v-model="personnelForm.idAddress" placeholder="请填写" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="性别">
                  <el-select v-model="personnelForm.sex" placeholder="请选择">
                    <el-option label="男" value="男" />
                    <el-option label="女" value="女" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="民族">
                  <el-select v-model="personnelForm.nation" placeholder="请选择">
                    <el-option v-for="item in baseData.nations" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="证件照片">
                  <div class="pic-box">
                    <upload-card
                      type="single"
                      single-tips="点击上传人像面"
                      :default-image="front"
                      :path.sync="personnelForm.front"
                      @setIdCard="handleSetIdCard($event,'front')"
                    />
                    <upload-card
                      type="single"
                      single-tips="点击上传徽章面"
                      :default-image="back"
                      :path.sync="personnelForm.back"
                      @setIdCard="handleSetIdCard($event,'back')"
                    />
                  </div>
                  <el-col v-if="personnelForm.idcType === '身份证'" :span="24" style="margin-top:10px;padding:0px;">
                    <upload-code placement="right-start" alias="personnel" @update="updateFileList" @setIdCard="handleSetIdCardForCode" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col v-if="+dialogType === 1" :span="24">
                <el-form-item label="培训证明">
                  <div class="pic-box">
                    <upload-card
                      type="single"
                      single-tips="点击上传食品人员培训证明"
                      :default-image="defaultImg"
                      :path.sync="personnelForm.pxCertificate"
                      @setIdCard="handleSetIdCard($event,'pxCertificate')"
                    />
                  </div>
                  <el-col :span="24" style="margin-top:10px;padding:0px;">
                    <upload-code placement="right-start" alias="pxCertificate" @update="updateFileList" />
                  </el-col>
                </el-form-item>
              </el-col>
              <template v-if="+dialogType === 2">
                <el-col :span="24">
                  <el-form-item class="radio" label="从事接触直接入口食品工作" label-width="244px">
                    <el-radio v-model="personnelForm.contactFoodWork" :label="true" border>是</el-radio>
                    <el-radio v-model="personnelForm.contactFoodWork" :label="false" border>否</el-radio>
                  </el-form-item>
                </el-col>
                <template v-if="personnelForm.contactFoodWork">
                  <el-col :span="24">
                    <el-form-item label="健康证明">
                      <div class="pic-box">
                        <upload-card
                          type="single"
                          single-tips="点击上传健康证明"
                          :default-image="defaultImg"
                          :path.sync="personnelForm.jkCertificate"
                          @setIdCard="handleSetIdCard($event,'jkCertificate')"
                        />
                      </div>
                      <el-col :span="24" style="margin-top:10px;padding:0px;">
                        <upload-code placement="right-start" alias="jkCertificate" @update="updateFileList" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </template>
              </template>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleAddMember('showNaturalDialog')">确定添加</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import baseData from '@/config/baseData.js'
import Breadcrumb from '@/components/Breadcrumb/index'
import license from '@/assets/images/license.png'
import front from '@/assets/images/front.png'
import back from '@/assets/images/back.png'
import defaultImg from '@/assets/images/defaultImg.png'
import UploadCard from '@/components/UploadFile/camera'
import UploadCode from '@/components/UploadFile/uploadCode'
export default {
  components: {
    Breadcrumb,
    UploadCard,
    UploadCode
  },
  data() {
    return {
      dialogType: 1, // 区分什么类型填写1安全管理员，2从业人员
      validateFront: false, // 是否正确校验身份证正面
      validateBack: false, // 是否正确校验身份证反面
      baseData, // 基础信息
      editIndex: -1, // 编辑下标
      showNaturalDialog: false, // 弹窗
      license,
      front,
      back,
      defaultImg,
      disabled: true, // 是否禁用自然人确认提交按钮
      personnelForm: {
        type: '食品安全管理人员', // 类型:食品安全管理人员,从业人员
        idcName: '', // 人员姓名或企业名称
        idcType: '身份证', // 证件类型
        idcNumber: '', // 证件号码
        idAddress: '', // 自然人证件地址
        sex: '', // 性别
        nation: '汉族', // 民族
        front: '', // 自然人身份证人像面
        back: '', // 自然人身份证背面
        licensePic: '', // 法人营业执照照片
        phone: '', // 自然人或法人移动电话
        pxCertificate: '', // 食品培训证明图片
        jkCertificate: '', // 健康证明图片
        contactFoodWork: false // 是否接触食品工作
      },
      form: {
        workerNumber: '',
        medicalNumber: '',
        personnelList: []
      },
      rules: {
        workerNumber: [
          { required: true, message: '请输入从业人数', trigger: 'change' }
        ],
        medicalNumber: [
          { required: true, message: '请输入应体检人数', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    draftInfo() {
      return this.$store.state.draft.draftInfo
    }
  },
  watch: {
    'personnelForm.idcNumber'(data) {
      if (data.length === 18 && this.personnelForm.idcType === '身份证' && !this.personnelForm.sex) {
        this.personnelForm.sex = parseInt(this.personnelForm.idcNumber.substr(16, 1)) % 2 === 1 ? '男' : '女'
      }
    }
  },
  created() {
    // 获取草稿详情
    if (this.$utils.getItem('draftNumber')) {
      this.$store.dispatch('draft/getDraftDetail', this.$utils.getItem('draftNumber')).then(async res => {
        if (res.personnel) {
          this.form = res.personnel
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
          personnel: this.form, // 现在数据覆盖原有数据
          showTips // 是否显示提示
        }
        this.$store.dispatch('draft/saveDraft', data).then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 扫码上传身份证识别信息回调
    handleSetIdCardForCode(e) {
      setTimeout(() => {
        if (e[0].type && !e[0].id_card_number) { // 有识别正面
          this.validateFront = false
          return this.$utils.showError('身份证正面识别失败！')
        }
        if (e[1].type && !e[1].valid_date) { // 有识别反面
          this.validateBack = false
          return this.$utils.showError('身份证反面识别失败！')
        } else if (e[1].type && e[1].valid_date) { // 校验是否过期
          const time = new Date(e[1].valid_date.split('-')[1].replace(/\./g, '\-')).getTime()
          const nowTime = new Date().getTime()
          if (parseFloat(time) - parseFloat(nowTime) < 0) { // 证件已过有效期
            this.validateBack = false
            return this.$utils.showError('身份证已过期，请上传有效的身份证！')
          } else { // 反面校验，证件未过有效期
            this.validateBack = true
          }
        }
        if (e[0].type && e[0].id_card_number) { // 校验正面
          this.personnelForm.idcName = e[0].name
          this.personnelForm.idcNumber = e[0].id_card_number
          this.personnelForm.idAddress = e[0].address
          this.validateFront = true
        }
      }, 300)
    },
    // 本地上传身份证图片回调
    handleSetIdCard(e, type) {
      // 延迟0.3秒，保证附件成功上传
      setTimeout(() => {
        /* 用户上传身份证图片后，自动识别身份证姓名，证件号，证件地址并自动填写到页面对应的位置
        用户上传身份证图片后，自动识别身份证有效期，如证件已过期，提示用户：证件已过期
        过期的证件信息不允许保存提交
      */
        if (type === 'front' && !e.id_card_number) {
          this.validateFront = false
          return this.$utils.showError('身份证正面识别失败！')
        }
        if (type === 'back' && !e.valid_date) {
          this.validateBack = false
          return this.$utils.showError('身份证反面识别失败！')
        } else if (type === 'back' && e.valid_date) { // 校验是否过期
          const time = new Date(e.valid_date.split('-')[1].replace(/\./g, '\-')).getTime()
          const nowTime = new Date().getTime()
          if (parseFloat(time) - parseFloat(nowTime) < 0) { // 证件已过有效期
            this.validateBack = false
            return this.$utils.showError('身份证已过期，请上传有效的身份证！')
          } else { // 反面校验，证件未过有效期
            this.validateBack = true
          }
        }
        if (type === 'front' && e.id_card_number) { // 校验正面
          this.personnelForm.idcName = e.name
          this.personnelForm.idcNumber = e.id_card_number
          this.personnelForm.idAddress = e.address
          this.validateFront = true
        }
      }, 300)
    },
    // 更新扫码上传数据
    updateFileList(val) {
      if (val.type === 'personnel') {
        this.$set(this.personnelForm, 'back', val.data[0].back)
        this.$set(this.personnelForm, 'front', val.data[0].front)
      } else if (val.type === 'pxCertificate') {
        this.$set(this.personnelForm, 'pxCertificate', val.data[0])
      } else if (val.type === 'jkCertificate') {
        this.$set(this.personnelForm, 'jkCertificate', val.data[0])
      }
    },
    // 校验自然人身份证和手机号
    filterGD(personnelForm) {
      // 编辑操作先重置
      if (this.editIndex !== -1) {
        this.form.personnelList[this.editIndex].idcNumber = ''
        this.form.personnelList[this.editIndex].phone = ''
      }
      // console.log(this.form.personnelList, this.editIndex)
      const personnelList = this.form.personnelList.filter(item => item.type === personnelForm.type)
      for (const item of personnelList) {
        if (item.idcNumber === personnelForm.idcNumber) {
          return 'idcNumber'
        }
        if (item.phone === personnelForm.phone) {
          return 'phone'
        }
      }
    },
    // 编辑
    handleEdit(index) {
      // 每次调用弹窗重置职务选项
      this.validateFront = true // 是否正确校验身份证正面
      this.validateBack = true // 是否正确校验身份证反面
      this.personnelForm = JSON.parse(JSON.stringify(this.form.personnelList[index]))
      this.editIndex = index
      this.personnelForm.type === '食品安全管理人员' ? (this.dialogType = 1) : (this.dialogType = 2)
      this.showNaturalDialog = true
    },
    handleDelete(index) {
      this.form.personnelList.splice(index, 1)
    },
    // 点击添加类型信息
    handleShowDialog(type) {
      this.dialogType = type // 显示类型
      this.showNaturalDialog = true
      // 显示弹窗是重置数据
      this.handleReset()
    },
    // 添加人员成功以后重置数据
    handleReset() {
      this.disabled = true // 禁用添加按钮
      this.editIndex = -1 // 重置编辑下标
      this.personnelForm = {
        type: this.dialogType === 1 ? '食品安全管理人员' : '从业人员', // 类型
        idcName: '', // 人员姓名或企业名称
        idcType: '身份证', // 证件类型
        idcNumber: '', // 证件号码
        idAddress: '', // 自然人证件地址
        sex: '', // 性别
        nation: '汉族', // 民族
        front: '', // 自然人身份证人像面
        back: '', // 自然人身份证背面
        phone: '', // 自然人或法人移动电话
        pxCertificate: '', // 食品培训证明图片
        jkCertificate: '', // 健康证明图片
        contactFoodWork: false // 是否接触食品工作
      }
    },
    // 确认添加人员
    handleAddMember(type) {
      const personnelForm = this.personnelForm
      // 过滤完以后做非空校验
      if (!personnelForm.idcName) { // 人员姓名
        return this.$utils.showError('请填写人员姓名')
      } else if (!personnelForm.phone) {
        return this.$utils.showError('请填写移动电话')
      } else if (!this.$utils.regExp('phone', personnelForm.phone)) {
        return this.$utils.showError('移动电话格式不正确')
      } else if (!personnelForm.idcNumber) {
        return this.$utils.showError('请填写证件号码')
      } else if (personnelForm.idcType === '身份证' && !this.$utils.regExp('idCard', personnelForm.idcNumber)) {
        return this.$utils.showError('身份证格式不正确')
      } else if (!personnelForm.idAddress) {
        return this.$utils.showError('请填写证件地址')
      } else if (!personnelForm.front) {
        return this.$utils.showError('请上传身份证人像面')
      } else if (!personnelForm.back) {
        return this.$utils.showError('请上传身份证人像背面')
      } else if (!this.validateFront) {
        return this.$utils.showError('身份证人像面识别失败，请重新上传!')
      } else if (!this.validateBack) {
        return this.$utils.showError('身份证国徽面识别失败或已过有效期，请重新上传!')
      }
      if (+this.dialogType === 1 && !personnelForm.pxCertificate) return this.$utils.showError('请上传培训证明')
      if (+this.dialogType === 2 && personnelForm.contactFoodWork && !personnelForm.jkCertificate) return this.$utils.showError('请上传健康证明')

      // 校验自然人身份证和手机号，允许食品管理员和从业人员是同一人
      if (this.filterGD(personnelForm) === 'idcNumber') {
        return this.$utils.showWarn('身份证已占用，请修改！')
      } else if (this.filterGD(personnelForm) === 'phone') {
        return this.$utils.showWarn('手机号已占用，请修改！')
      }
      if (this.editIndex === -1) { // 新增
        this.form.personnelList.push(this.personnelForm)
      } else { // 编辑
        this.form.personnelList.splice(this.editIndex, 1, this.personnelForm)
      }
      this.handleReset()
      this.showNaturalDialog = false
    },
    // 下一步
    async handleNext() {
      const personnelList = JSON.parse(JSON.stringify(this.form.personnelList))
      if (personnelList.length === 0) return this.$utils.showError(`请添加人员信息,请先添加后再进行下一步操作`)
      const spArr = personnelList.filter(item => item.type === '食品安全管理人员')
      if (spArr.length === 0) return this.$utils.showError(`至少需要添加一条食品安全管理人员信息,请先添加后再进行下一步操作`)
      const cyArr = personnelList.filter(item => item.type === '从业人员')
      if (cyArr.length === 0) return this.$utils.showError(`至少需要添加一条从业人员信息,请先添加后再进行下一步操作`)
      this.$refs['form'].validate(async valid => {
        if (valid) {
          await this.handleSaveDraft()
          this.$router.push({ path: '/form/equipment', query: { ...this.$route.query }})
        } else {
          this.$utils.showError('请按提示信息补充完整表单！')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
  padding-bottom: 15vh;
}
::v-deep .el-dialog__body {
  padding: 30px 45px;
}
::v-deep .el-table thead {
  color: #464646;
  font-weight: 600;
  font-size: 14px;
}
.member-form {
  .el-table::before {
    height: 0;
  }

  .box {
    width: 1100px;
    margin: 0 auto;

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
        margin-right: 5px;
      }
    }

    .form {
      padding-top: 35px;
      padding-top: 57px;

      ::v-deep .el-select,
      .el-cascader {
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

      .plain {
        border: 1px solid #3162E8;
        color: #3162E8;
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
      .add-btn {
        display: flex;
        justify-content: flex-end;
        box-sizing: border-box;
        // .el-button {
        //   margin-right: 26px;
        // }
      }
      .add-tips {
        font-size: 16px;
        font-weight: 500;
        color: #7F7E7E;
        text-align: center;
        padding-bottom: 25px;
      }
      .job-number {
        display: flex;
        height: 43px;
        align-items: center;
        span {
          flex: 0 0 23px;
          width: 23px;
          height: 23px;
          font-size: 14px;
          text-align: center;
          line-height: 23px;
          background: #E0EBFF;
          color: #3162E8;
          border-radius: 50%;
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

      .pic-box {
        display: flex;
        .pic {
          width: 300px;
          height: 165px;
          border: 1px dashed #E0E0E0;
          border-radius: 8px;
          margin-right: 30px;
          .logo {
            width: 218px;
            height: 108px;
            margin: 18px auto 0 auto;
            img {
              width: 218px;
              height: 108px;
            }
          }
          .desc {
            display: flex;
            height: 21px;
            align-items: center;
            justify-content: center;
            margin-top: 9px;
            img {
              width: 21px;
              height: 21px;
            }
            span {
              height: 21px;
              line-height: 21px;
              font-size: 14px;
              font-weight: 500;
              color: #7F7E7E;
              margin-left: 4px;
            }
          }
        }
      }
    }

    .custom-title {
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 40px;
      background: #F3F6FE;

      .label {
        flex: 1;
        font-size: 20px;
        font-weight: 600;
        color: #333333;
      }

      .close {
        font-size: 16px;
        font-weight: 500;
        color: #3162E8;
        cursor: pointer;
      }
    }

    ::v-deep .el-dialog__header {
      padding: 0;
    }

    ::v-deep .el-dialog__footer {
      text-align: center;
      padding-bottom: 40px;

      .el-button {
        width: 155px;
        height: 48px;
      }
    }
  }
}
</style>
