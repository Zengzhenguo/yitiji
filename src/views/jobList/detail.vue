<template>
  <div class="z_process_page">
    <ul class="z_process_header">
      <li><span>业务名称</span><span>{{ workDetail['业务名称'] }}</span></li>
      <li><span>办事主体</span><span>{{ workDetail['办事主体'] }}</span></li>
      <li><span>业务编号</span><span>{{ workDetail['业务编号'] }}</span></li>
    </ul>
    <div class="z_process_title">
      办理进度
      <el-button v-if="+workDetail['当前状态编号'] === 5" type="text" class="pdf-btn" @click="getAndOpenSignPdf(workDetail['办件编号']['发起签名'])">查看章程PDF</el-button>
    </div>
    <div class="z_process_body">
      <el-steps direction="vertical" active-color="#2163e0" :active="active" process-status="finish">
        <el-step v-for="item in workDetail['时间轴']" :key="item.id" :class="{currentActive: item.id === workDetail['当前状态编号']}">

          <div slot="title" class="z_step_content">
            <div class="z_step_name">{{ item['名称'] }}</div>
            <!-- <div v-if="+workDetail['当前状态编号'] >= 4 && +item.id === 4" class="z_step_result">{{ +workDetail['当前状态编号'] === 4 ? '审批通过' : '审批不通过' }}</div> -->
            <div class="z_step_time" style="text-align: right;">{{ item['时间'] }}
              <br /><span style="color: red;">{{ item['信息'] }}</span>
            </div>
          </div>

          <div slot="description" style="padding: 15px 0">
            <ul v-if="+item.id === 2" class="z_sign">
              <li v-for="(j, jIndex) in workDetail['签署情况']" :key="jIndex" class="z_sign_item">
                <div class="z_sign_name">{{ j['签署人名称'] }}</div>
                <div v-if="j['签署状态'] === '未签名'" class="z_sign_status">{{ j['签署状态'] }}</div>
                <div v-if="j['签署状态'] === '已签名'" class="z_sign_time">{{ j['签署时间'] }}</div>
              </li>
            </ul>
            <ul v-if="+item.id === 4 && workDetail['认证信息'] && workDetail['认证信息'].length" class="z_sign">
              <li v-for="(j, jIndex) in workDetail['认证信息']" :key="jIndex" class="z_sign_item">
                <div class="z_sign_name">{{ j['姓名'] }}（{{ j['证件号码'].substring(j['证件号码'].length-4) }}）</div>
                <div class="z_sign_time">未认证授权</div>
              </li>
            </ul>
          </div>
        </el-step>
      </el-steps>
      <div style="display: flex;">
        <el-button type="primary" style="margin: auto;" @click="errorApplication" v-if="isshowCommitBTn">故障申报服务</el-button>
      </div>
    </div>
    <!-- 对话框 -->
    <el-dialog
        title="故障申报服务"
        center
        :close-on-click-modal="false"
        :visible.sync="ErrorAPPdialogVisible"
        width="70%"
        :before-close="handleClose">
        <!-- 表单开始 -->
        <el-form ref="form" :label-position="labelPosition" label-width="180px" :model="formLabelAlign" :rules="rules">
              <el-form-item label="业务编号" prop="bizSerialNumber">
                <el-input v-model="formLabelAlign.bizSerialNumber" disabled></el-input>
              </el-form-item>
              <el-form-item label="办件主题" prop="businessName">
                <el-input v-model="formLabelAlign.businessName" disabled></el-input>
              </el-form-item>
              <el-form-item label="办理人" prop="handler">
                <el-input v-model="formLabelAlign.handler"></el-input>
              </el-form-item> 
              <el-form-item label="办理人联系方式" prop="contactInfo">
                <el-input v-model="formLabelAlign.contactInfo"></el-input>
              </el-form-item> 
        </el-form>
        <!-- 表单结束 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="CommitApplication">申 请</el-button>
        </span>
    </el-dialog>
    <!-- 对话框结束 -->
  </div>
</template>

<script>
import { getBoxId, getSignPdf ,CommitError} from '@/api/index'
export default {
  components: {},
  data() {
    return {
      isshowCommitBTn:false,
      labelPosition:'right',
      formLabelAlign:{
        bizSerialNumber:'',//业务编号
        businessName:'',//办件主题
        handler:'',//办理人
        contactInfo:'',//办理人联系方式
      },
      rules: {
        bizSerialNumber: [{ required: true, message: '请输入业务编号', trigger: 'blur' },],
        businessName: [{ required: true, message: '请输入办件主题', trigger: 'blur' },],
        handler: [{ required: true, message: '请输入办理人', trigger: 'blur' },],
        contactInfo: [{ required: true, message: '请输入活动名称办理人联系方式', trigger: 'blur' },],
      },
      ErrorAPPdialogVisible:false,
      workDetail: [],
      active: 0
    }
  },
  created() {
    const query = this.$route.query
    this.getDetail(query.ident, query.bizName)
  },
  methods: {
    handleClose(){
    this.ErrorAPPdialogVisible =false
    this.$refs['form'].resetFields();
    },
    errorApplication(){
      this.ErrorAPPdialogVisible = true
      this.formLabelAlign.bizSerialNumber =this.workDetail['业务编号']
      this.formLabelAlign.businessName = this.workDetail['办事主体']
    },
    CommitApplication(){
      if(!this.formLabelAlign.bizSerialNumber||this.formLabelAlign.bizSerialNumber==null){
        return this.$utils.showError('请输入业务编号')
      }
      if(!this.formLabelAlign.businessName||this.formLabelAlign.businessName==null){
        return this.$utils.showError('请输入办件主题')
      }
      if(!this.formLabelAlign.handler||this.formLabelAlign.handler==null){
        return this.$utils.showError('请输入办理人')
      }
      if(!this.formLabelAlign.contactInfo||this.formLabelAlign.contactInfo==null){
        return this.$utils.showError('请输入活动名称办理人联系方式')
      }
      let data={
        bizSerialNumber:this.formLabelAlign.bizSerialNumber,
        businessName:this.formLabelAlign.businessName,
        handler:this.formLabelAlign.handler,
        contactInfo:this.formLabelAlign.contactInfo,
      }
      CommitError(data).then(res=>{
        if(res.flag===200){
          this.$utils.showSuccess(res.message)
          this.$refs['form'].resetFields();
         this.ErrorAPPdialogVisible =false
        }else{
          this.$utils.showError("申报失败，请重新申报")
        }
      })
    },
    getDetail(ident, bizName) {
      this.$api.showLoading({ text: '获取数据中...' })
      let params = {}
      const bizNameArr = ['个人独资企业公示信息填报', '个体工商户公示信息填报', '内资企业公示信息填报', '分公司公示信息填报', '农民专业合作社公示信息填报']
      if (bizNameArr.includes(bizName)) {
        params = {
          job: 'HUBEI_ANNUAL_DETAILS',
          inData: {
            ident
          }
        }
      } else {
        let job = 'HUBEI_QUEUE_STATUS'
        if (bizName === '咸宁一事联办') job = 'HUBEI_ACCEPTED_QUEUE' // 一事联办job
        params = {
          job,
          inData: {
            bizSerialNumber: ident
          }
        }
      }
      this.$api.startJob(params).then(res => {
        if(params.job ==='HUBEI_QUEUE_STATUS'){
          res.outData['时间轴'].forEach(item=>{
           if(item['名称']==='审批不通过'){
            this.isshowCommitBTn =true
           }
          })
        }
        this.$api.hideLoading()
        if (res.state !== 'successful') {
          this.$utils.showWarn(res.errMsg)
          return
        }
        this.workDetail = res.outData
        // 过滤出步骤条的高亮状态
        this.workDetail['时间轴'].forEach((item, index) => {
          if (+item.id === +this.workDetail['当前状态编号']) {
            this.active = index
          }
        })
        this.dialogProgress = true
      }).catch(error => {
        this.$api.hideLoading()
        console.log(error)
        this.$utils.showError('发生错误，请联系管理员！')
      })
    },
    async getAndOpenSignPdf (ident) {
      try {
        // const signBizNum = await getSignBizNum(ident)
        // if (!signBizNum.success || !signBizNum.data) {
        //   this.listLoading = false
        //   return this.$utils.showError('获取签署流水号失败，请重试！')
        // }
        this.$api.showLoading()
        const signData = await getBoxId(ident)
        if (!signData.data || !signData.data.boxId) {
          this.$api.hideLoading()
          return this.$utils.showError('获取签署信息失败，请重试！')
        }
        const pdfData = await getSignPdf(signData.data.boxId)
        this.$api.hideLoading()
        window.parent.handleSubmit(pdfData.data.signedFile)
        // window.open(pdfData.data.signedFile)
      } catch (error) {
        this.$api.hideLoading()
        console.log(error)
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.pdf-btn {
  float: right;
  padding: 0;
  margin-top: 2px;
}
.z_process_page{
  box-sizing: border-box;
  /* padding: 15px; */
  /* background: #f2f2f2; */
  /* display: flex; */
  /* flex-direction: column; */
}
.z_process_page .z_process_header{
  background: #fff;
  border-radius: 7px;
  font-size: 14px;
  padding: 15px 45px;
}
.z_process_page .z_process_header li{
  padding-bottom: 15px;
  display: flex;
  color: #656C74;
}
.z_process_page .z_process_header>li:last-child{
  padding-bottom: 0;
}
.z_process_page .z_process_header>li>span:last-child{
  flex: 1;
  text-align: right;
  padding-left: 15px;
  word-break: break-all;
}

.z_process_page .z_process_title{
  padding: 15px 45px;
  line-height: 20px;
  font-size: 14px;
  color: #333;
  font-weight: bold;
  background: #f2f2f2;
  margin-top: 10px;
}

.z_process_page .z_process_body{
  box-sizing: border-box;
  background: #fff;
  padding: 25px 45px 15px 45px;
  border-radius: 7px;
  /* flex: 1; */
  /* min-height: 400px; */
  /* height: 400px; */
}
.z_process_page .z_step_content{
  display: flex;
  font-size: 14px;

}
.z_process_page .z_step_content .z_step_name{
  flex: 1;
  font-size: 14px;
}
.z_process_page .z_step_content .z_step_time{
  color: #888;
  font-size: 14px;
}

.z_process_page .z_sign_item{
  display: flex;
  color: #888;
  padding: 5px 0;
  font-size: 14px;
}
.z_process_page .z_sign_item .z_sign_name{
  flex: 1;
}
.z_process_page .z_sign_item .z_sign_status{
  width: 50px;
  margin-right: 10%;
  box-sizing: border-box;
}
.z_process_page .z_sign_item .z_sign_time{
  width: 160px;
  text-align: right;
}
</style>
<style>
.z_process_body .is-finish .el-step__line{
  color: #025BFF;
  border-color: #025BFF;
  background-color: #025BFF;
}
.z_process_body .currentActive .el-step__line{
  background-color: #C0C4CC;
}
</style>
