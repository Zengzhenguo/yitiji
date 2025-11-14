<template>
  <div class="list-page">
    <page-header />
    <breadcrumb title="打印证照" />
    <div class="title">{{ $route.meta.title }}</div>
    <div class="tips">
      <img src="../../assets/images/tips.png" />
      <span>法定代表人、主要经营者或委托代理人才能查看和打印证照</span>
    </div>
    <el-form ref="form" label-position="left" class="w-1000 form" :model="form" :rules="rules" label-width="94px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item class="radio" label="请选择身份" label-width="110px" prop="role">
            <el-radio v-model="form.role" label="法定代表人" border @change="handleChangeType">法定代表人/主要经营者</el-radio>
            <el-radio v-model="form.role" label="经办人" border @change="handleChangeType">经办人/委托代理人</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="单位名称" prop="companyName">
            <el-input v-model="form.companyName" placeholder="请输入要打印证照的单位名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="领取人电话" prop="phone" label-width="104px">
            <el-input v-model="form.phone" placeholder="请输入领取人电话号码" maxlength="11" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="法定代表人/主要经营者姓名" prop="legalPerson" label-width="220px">
            <el-input v-model="form.legalPerson" placeholder="请输入法定代表人/主要经营者姓名" :disabled="form.role === '法定代表人'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证件号码" prop="legalPersonCerNo">
            <el-input v-model="form.legalPersonCerNo" placeholder="请输入证件号码" :disabled="form.role === '法定代表人'" maxlength="18" />
          </el-form-item>
        </el-col>
        <template v-if="form.role === '经办人'">
          <el-col :span="12">
            <el-form-item label="经办人/委托代理人姓名" label-width="190px" required>
              <el-input v-model="form.agentName" placeholder="请输入经办人/委托代理人姓名" :disabled="form.role === '经办人'" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码" required>
              <el-input v-model="form.agentCerNo" maxlength="18" placeholder="请填写证件号码" :disabled="form.role === '经办人'" />
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="24" style="padding-top: 30px;">
          <el-form-item label-width="0" class="promise text-center" prop="promise">
            <el-checkbox v-model="form.promise">本人同意系统采集刷脸认证登录时的人像作为打印证照签收凭证</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="btn-group text-center" label-width="0">
        <!-- <el-button type="primary" @click="onSubmit">暂存草稿</el-button> -->
        <el-button @click="handleSearch">查询</el-button>
      </el-form-item>
      <template v-if="search">
        <el-table ref="singleTable" :data="printList" highlight-current-row style="width: 100%;padding-top: 30px;">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column property="companyName" label="单位名称" width="300" align="center" />
          <el-table-column property="name" label="证件名称" width="300" align="center" />
          <el-table-column property="num" label="数量" width="100" align="center" />
          <el-table-column label="打印状态" align="center">
            <template slot-scope="{ row }">
              {{ row.status ? '已打印' : '未打印' }}
            </template>
          </el-table-column>
        </el-table>
        <div class="btn-group text-center">
          <el-button @click="handleNext">打印</el-button>
        </div>
      </template>
      <template>
        <el-table ref="singleTable" :data="printList1" highlight-current-row style="width: 100%;padding-top: 30px;">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column property="companyName" label="单位名称" width="300" align="center" />
          <el-table-column property="name" label="证件名称" width="300" align="center" />
          <el-table-column property="num" label="数量" width="100" align="center" />
          <el-table-column label="打印状态" align="center">
            <template slot-scope="{ row }">
              {{ row.status ? '已打印' : '未打印' }}
            </template>
          </el-table-column>
        </el-table>
        <div class="btn-group text-center">
          <el-button @click="hanldePrintImg">去打印</el-button>
        </div>
      </template>
    </el-form>
    <el-dialog :visible.sync="showDialog" width="506px" close-on-click-modal close-on-press-escape :show-close="false">
      <div class="dialog-wrap text-center">
        <img v-if="type" src="../../assets/images/success.png" alt="" />
        <my-loading v-else width="56" height="56" :src="loadingImg" />
        <div class="desc" :style="type ? 'padding-bottom: 20px;' : ''">{{ type ? '打印完成，请取走文件' : '正在打印中，请不要离开' }}</div>
        <div v-if="type" class="print-tips">如果<span>{{ second }}</span>S内未操作，系统将自动退出</div>
        <div v-if="type" class="btn-group" style="padding: 20px 0 56px;">
          <el-button type="primary" @click="handleGoHome">返回首页</el-button>
          <el-button @click="logOut">立即退出</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="qrcodeDialog" width="598px" close-on-click-modal close-on-press-escape :show-close="false">
      <div class="dialog-qrcode text-center">
        <div class="dialog-title">请法定代表人/主要经营者，搜索“湖北市场监督融平台”微信小程序，或扫描下方二维码，找到授权委托申请，完成电子签名</div>
        <img src="../../assets/images/auth_qrcode.png" alt="" />
        <el-button class="auth-btn" @click="qrcodeDialog = false">完成授权</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogSign" width="500px" close-on-click-modal close-on-press-escape :show-close="true" class="sign_dialog">
      <div class="dialog_wrap">
        <img src="@/assets/images/qrcode.png" alt="" class="ewm" />
        <div style="font-size: 16px;">请用微信扫码签名,过程中请不要关掉弹窗</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/index'
import { print } from '@/api/terminal'
import myLoading from '@/components/Loading/index'
import loadingImg from '@/assets/images/loading_blue.png'
import { getPrintList, getLicenseInfo, uploadResult } from '@/api/index'
import PageHeader from '@/components/PageHeader/index'
export default {
  components: {
    Breadcrumb,
    myLoading,
    PageHeader
  },
  data() {
    const { validateField } = this.$utils
    const validatePromise = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择承诺'))
      } else {
        callback()
      }
    }
    return {
      search: false, // 是否已经查询
      showDialog: false, // 显示加载弹窗
      qrcodeDialog: false, // 显示二维码弹窗
      dialogSign: false, // 签名弹窗
      signTimer: null, // 签名定时器
      ident: '', // 轮询ident
      type: 1, // 弹窗类型，0：loading 1：成功
      loadingImg, // loading图片
      printData: null, // 打印数据
      conum: '1', // 营业执照数量，默认1
      second: 30,
      timer: null,
      form: {
        role: '',
        companyName: '', // 单位名称
        phone: '', // 领取人电话
        legalPerson: '', // 法人名称
        legalPersonCerNo: '', // 法人证件号
        agentName: '', // 代理人姓名
        agentCerNo: '', // 代理人身份证
        promise: false
      },
      rules: {
        role: [
          { required: true, message: '请选择身份', trigger: 'change' }
        ],
        companyName: [
          { required: true, message: '请填写单位名称', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请填写领取人电话', trigger: 'change' },
          { validator: validateField('mobile') }
        ],
        legalPerson: [
          { required: true, message: '请填写法定代表人/主要经营者姓名', trigger: 'change' }
        ],
        legalPersonCerNo: [
          { required: true, message: '请填写法定代表人/主要经营者姓名证件号码', trigger: 'change' },
          { validator: validateField('id') }
        ],
        promise: [
          { required: true, validator: validatePromise, trigger: 'blur' }
        ]
      },
      printList: [],
      printList1: [
        { companyName: '咸安区荀彧餐饮店', name: '食品经营许可证', num: 1, status: 0 },
        { companyName: '咸安区荀彧餐饮店', name: '食品经营许可证(副本)', num: 1, status: 0 }]
    }
  },
  watch: {
    dialogSign(val) {
      if (!val) {
        this.clearSignTimer()
      }
    }
  },
  created() {
    this.clearTimer()
    this.clearSignTimer()
    // this.setTimer()
  },
  beforeDestroy() {
    this.clearTimer()
    this.clearSignTimer()
  },
  methods: {
    hanldePrintImg() {
      this.$router.push('/printImg')
    },
    clearSignTimer() {
      clearInterval(this.signTimer)
    },
    handleChangeType(val) {
      const userInfo = this.$utils.getLocalItem('userInfo')
      if (val === '法定代表人') {
        this.form.agentName = ''
        this.form.agentCerNo = ''
        this.form.legalPerson = userInfo.name
        this.form.legalPersonCerNo = userInfo.idNumber
      } else {
        this.form.legalPerson = ''
        this.form.legalPersonCerNo = ''
        this.form.agentName = userInfo.name
        this.form.agentCerNo = userInfo.idNumber
      }
    },
    handleSearch() {
      // getLicenseInfo('2021012910014899700000080').then(data => {
      //   console.log(typeof data)
      //   const printData = data.outData
      //   console.log(data.outData, printData)
      // })
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const data = {
            ...this.form,
            creditCode: ''
          }
          this.$loading({ text: '查询中，请稍后' })

          getPrintList(data).then(res => {
            this.$loading().close()
            if (res.state === 'successful') { // 获取成功
              this.search = true
              const outData = res.outData
              this.ident = res.outData.serialNo
              // this.form.creditCode = res.data.outData.creditCode
              this.printList = res.outData['print_list'].map(item => {
                if (item.name === '营业执照副本') {
                  this.conum = item.num
                }
                return {
                  ...item,
                  companyName: outData.companyName,
                  status: 0
                }
              })
            } else { // 获取失败
              if (res.errMsg === '企业未授权') {
                this.qrcodeDialog = true
              } else {
                this.$utils.showError(res.errMsg)
              }
            }
          })
        } else {
          this.$utils.showError('请按提示填写必填项')
        }
      })
    },
    setTimer() {
      this.timer = setInterval(() => {
        if (this.second > 0) {
          this.second--
        } else {
          this.clearTimer()
          this.logOut()
        }
      }, 1000)
    },
    clearTimer() {
      clearInterval(this.timer)
      this.second = 30
    },
    handleGoHome() {
      this.clearTimer()
      this.$router.replace('/')
    },
    logOut() {
      // 退出登录
      this.$router.replace('/')
      this.$utils.removeLocalItem('token')
      this.$utils.removeLocalItem('userInfo')
      this.$utils.removeLocalItem('expiryDate')
      this.$store.commit('login/SET_USER_INFO', null)
    },
    handleNext() {
      const that = this
      if (this.form.role === '法定代表人') {
        this.handlePrint()
      } else {
        this.dialogSign = true
        // 开始轮询
        this.signTimer = setInterval(() => {
          that.handlePrint()
        }, 5000)
      }
    },
    handlePrint() {
      this.$loading({ text: '正在打印，请稍后' })
      getLicenseInfo(this.ident).then(resp => {
        this.$loading().close()
        if (resp.state === 'successful') {
          this.dialogSign = false
          // 这个应该可以去掉
          this.clearSignTimer()
          const printData = resp.outData
          let busscope = ''
          if (printData.businessScope.length >= 800) { // 处理经营范围，超出部分只显示800个字
            busscope = printData.businessScope.substring(0, 800)
          } else {
            busscope = printData.businessScope
          }
          const data = {
            apprdate: printData.entEstDateF, // 核准日期
            busscope, // 经营范围
            ewm: '', // 采用网址+社会统一信用代码 方式，上层传空值即可
            compform: printData.constitute, // 经营方式 1：个人经营 2：家庭经营
            conum: this.conum || '1', // 副本数
            dom: printData.address, // 经营住所
            dymb: printData.dymb, // A-H，服务根据执行不同时用不同打印模板
            entname: printData.companyName, // 公司名称
            enttypemc: printData.companyType, // 企业类型
            // 'enttypemc': printData.companyType, // 企业类型
            estdate: printData.entEstDateF, // 成立日期 格式 YYYY-MM-DD
            lerep: printData.legalPerson, // 法人姓名
            opfrom: printData.startDateF, // 营业期限起
            opto: printData.endDateF, // 营业执照止
            regcapDx: printData.capitalCN.replace('元', '圆'), // 注册资本中文，小写元替换成圆
            regcapcur: '', // 币种
            uniscid: printData.creditCode, // 统一社会信用代码
            printername: 'yyzz' // 终端使用时固定为 yyzz，为后 续多打印机预留
          }
          this.type = 0
          this.showDialog = true
          print(data).then(res => {
            this.$loading().close()
            if (+res.code === 10000) {
              const userInfo = this.$utils.getLocalItem('userInfo')
              const result = {
                'companyName': printData.companyName,
                'creditCode': printData.creditCode,
                'name': userInfo.name,
                'cerNo': userInfo.idNumber,
                'image': userInfo.facePic,
                'print_list': this.printList
              }
              uploadResult(result).then(() => {
                this.type = 1
                this.showDialog = true
                this.setTimer()
              })
            } else {
              this.$utils.showError(res.msg)
            }
          }).catch(res => {
            this.showDialog = false
            this.$utils.showError(res.msg)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

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
</style>
