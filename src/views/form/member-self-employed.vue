<template>
  <div class="member-form">
    <!-- <page-header /> -->
    <breadcrumb v-show="$route.query.mode !== 'test'" />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <div class="tips">
        <img src="../../assets/images/after.png" />
        <span>请经办人/委托代理人、全部经营者都下载《登记注册身份验证》APP认证身份，再提交申请</span>
      </div>

      <el-form ref="form" label-position="left" class="form" :model="form" label-width="84px">
        <el-row :gutter="20">
          <el-form-item class="radio z_radio_item" label="组织形式" label-width="100px">
            <el-radio-group v-model="form.memberOrgWay" @change="handleChangeType">
              <el-radio label="个人经营" border />
              <el-radio label="家庭经营" border />
            </el-radio-group>
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item class="z_radio_item" label="添加类型" label-width="100px">
            <el-button class="plain" @click="handleShowDialog(1)">添加自然人</el-button>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table ref="singleTable" :data="form.memberList" highlight-current-row style="width: 100%">
              <el-table-column type="index" label="序号" width="80" align="center" />
              <el-table-column property="idcName" label="姓名" width="200" align="center" />
              <el-table-column label="职务" align="center">
                <template slot-scope="{ row }">
                  {{ row.jobs.length ? row.jobs.map(item => item.name).join('、') : '/' }}
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
          <el-button @click="$router.go(0)">刷新当前页面</el-button>
          <el-button @click="handleSaveDraft(true)">暂存草稿</el-button>
          <el-button @click="$router.go(-1)">上一步</el-button>
          <el-button type="primary" @click="handleNext">下一步</el-button>
        </el-form-item>
      </el-form>
      <!--自然人弹窗-->
      <el-dialog
        class="dialog"
        :visible.sync="showNaturalDialog"
        :show-close="false"
        width="945px"
        :close-on-click-modal="false"
      >
        <div slot="title" class="custom-title">
          <div class="label">添加自然人</div>
          <div class="close" @click="showNaturalDialog = false">关闭</div>
        </div>
        <div>
          <el-form
            ref="natural-form"
            label-position="left"
            class="form"
            :model="memberForm"
            label-width="84px"
            style="padding-top: 0;"
          >
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="证件照片">
                  <div class="pic-box" v-if="validateFront || !dzform.base64DownPhoto">
                    <upload-card
                      type="single"
                      single-tips="点击上传人像面"
                      :default-image="front"
                      :path.sync="memberForm.front"
                      @setIdCard="handleSetIdCard($event,'front')"
                    />
                    <upload-card
                      type="single"
                      single-tips="点击上传徽章面"
                      :default-image="back"
                      :path.sync="memberForm.back"
                      :files-type="'pdf'"
                      @setIdCard="handleSetIdCard($event,'back')"
                    />
                  </div>
                  <div class="pic-box" v-else>
                    <el-image style="width: 200px;" :src="dzform.base64DownPhoto"></el-image>
                    <el-image style="width: 200px;margin-left:20px;" :src="dzform.base64UpPhoto"></el-image>
                  </div>
                  <el-col v-if="memberForm.idcType === '身份证'" :span="24" style="margin-top:10px;padding:0px;">
                    <upload-code placement="right-start" alias="personnel" @update="updateFileList" @setIdCard="handleSetIdCardForCode" />
                    <el-button type="primary" @click="openDzzz" v-if="$utils.getLocalItem('curArea').city=='十堰市'">电子证照库查询上传</el-button>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="人员姓名">
                  <el-input v-model="memberForm.idcName" placeholder="请填写" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="移动电话">
                  <el-input v-model="memberForm.phone" maxlength="11" placeholder="请填写" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="10">
                <el-form-item label="证件类型">
                  <el-select v-model="memberForm.idcType" placeholder="请选择">
                    <el-option label="身份证" value="身份证" />
                    <!-- <el-option label="香港往来内地通行证" value="香港往来内地通行证" />
                    <el-option label="澳门往来内地通行证" value="澳门往来内地通行证" /> -->
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="证件号码">
                  <el-input v-model="memberForm.idcNumber" maxlength="18" placeholder="请填写"  />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="证件地址">
                  <el-input v-model="memberForm.idAddress" placeholder="请填写" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="性别">
                  <el-select v-model="memberForm.sex" placeholder="请选择">
                    <el-option label="男" value="男" />
                    <el-option label="女" value="女" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="民族">
                  <el-select v-model="memberForm.nation" placeholder="请选择">
                    <el-option v-for="item in baseData.nations" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="政治面貌">
                  <el-select v-model="memberForm.politics" placeholder="请选择">
                    <el-option v-for="item in baseData.politics" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="文化程度">
                  <el-select v-model="memberForm.education" placeholder="请选择">
                    <el-option v-for="item in baseData.education" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="担任职务" />
              </el-col>
              <el-col v-if="jobsList.length>0" :span="12" class="add-btn">
                <el-button class="plain" @click="handleAddJob">添加职务</el-button>
              </el-col>
            </el-row>
            <template v-if="memberForm.jobs.length">
              <el-row v-for="(item,index) in memberForm.jobs" :key="index" :gutter="20">
                <el-col :span="1">
                  <div class="job-number">
                    <span>{{ $utils.formatNumber(1 + index) }}</span>
                  </div>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="职务名称">
                    <el-select v-model="item.id" placeholder="请选择" @change="handleChangeJob($event, index)">
                      <el-option v-for="val in jobsList" :key="val.id" :label="val.name" :value="val.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label-width="0">
                    <el-button type="text" @click="handleDelJob(index)">删除</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <div v-else class="add-tips">若担任职务请添加</div>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" :disabled="disabled" @click="handleAddMember('showNaturalDialog')">确定添加</el-button>
        </span>
      </el-dialog>
      <el-dialog
        class="dialog"
        :visible.sync="DzzzDialog"
        :show-close="false"
        width="40%"
        :close-on-click-modal="false"
      >
        <div slot="title" class="custom-title">
          <div class="label">电子证照库查询</div>
          <div class="close" @click="DzzzDialog = false">关闭</div>
        </div>
        <el-form
          ref="dzform"
          label-position="left"
          class="form"
          :model="dzform"
        >
          <el-row :gutter="20">
            <!-- <el-col :span="20">
              <el-form-item class="radio" label="证件号：" label-width="127px">
                <el-input
                  v-model="dzform.idcard"
                  placeholder="请输入证件号查询电子证照库信息"
                  disabled
                />
              </el-form-item>
            </el-col> -->
            <!-- <el-col :span="2">
              <el-button type="primary" @click="searchDzzz">查询</el-button>
            </el-col> -->
          </el-row>
          <el-row :gutter="20" v-if="dzform.base64DownPhoto">
            <el-col :span="12" style="height: auto;">
              <el-form-item
                label="证件照正面："
                label-width="127px"
              >
              <el-image style="width: 200px;" :src="dzform.base64DownPhoto"></el-image>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row :gutter="20" v-if="dzform.base64UpPhoto">
            <el-col :span="12" style="height: auto;">
              <el-form-item
                label="证件照反面："
                label-width="127px"
              >
              <el-image style="width: 200px;" :src="dzform.base64UpPhoto"></el-image>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="getIdCardInfos"
            >上传</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { GetCertificateDataByCertificateID, GetCertificateImageByCertificateID, checkIfLaoLai, checkIfBlack, SYRetrieval, getIdCardInfo } from '@/api'
import baseData from '@/config/baseData.js'
import Breadcrumb from '@/components/Breadcrumb/index'
import license from '@/assets/images/license.png'
import front from '@/assets/images/front.png'
import back from '@/assets/images/back.png'
import UploadCard from '@/components/UploadFile/camera'
import UploadCode from '@/components/UploadFile/uploadCode'
import { debounce } from '@/utils'
export default {
  components: {
    Breadcrumb,
    UploadCard,
    UploadCode
  },
  data() {
    return {
     dzform: {
        idcard: "",
        base64DownPhoto: "",
        base64UpPhoto: ''
      },
      printList: [],
      DzzzDialog: false,
      oneflag: false,
      blackflag: false,
      llflag: false,
      printList: [],
      DzzzDialog: false,
      validateFront: false, // 是否正确校验身份证正面
      validateBack: false, // 是否正确校验身份证反面
      baseData: baseData,
      editIndex: -1, // 编辑下标
      showNaturalDialog: false, // 自然人弹窗
      license,
      front,
      back,
      disabled: true, // 是否禁用自然人确认提交按钮
      jobsList: [], // 职务列表
      currentCount: { // 人数
        '主要经营者': 0,
        '参与经营者': 0,
        '经办人/委托代理人': 0
      },
      memberForm: {
        idcName: '', // 人员姓名
        idcType: '身份证', // 证件类型
        idcNumber: '', // 证件号码
        idAddress: '', // 证件地址
        phone: '', // 移动电话
        jobs: [], // 人员职务
        front: '', // 证件人面像
        back: '', // 证件反面
        politics: '群众', // 政治面貌
        education: '', // 文化程度
        nation: '汉族', // 民族
        sex: '', // 性别
        nationality: '中国' // 国籍
      },
      form: {
        memberOrgWay: '个人经营',
        memberList: []
      }
    }
  },
  computed: {
    draftInfo() {
      return this.$store.state.draft.draftInfo
    }
  },
  watch: {
    'memberForm.idcNumber': debounce(function (data) {
      if (data.length === 18 && this.memberForm.idcType === "身份证" && !this.memberForm.sex) {
        this.memberForm.sex = parseInt(this.memberForm.idcNumber.substr(16, 1)) % 2 === 1 ? "男" : "女";
      }
      this.handlecheck();
    }, 500),
    'memberForm.legalIdNumber': debounce(function (data) {
      this.handlecheck();
    }, 500)
  },
  activated() {
    if(localStorage.getItem('userInfo')&&JSON.parse(localStorage.getItem('userInfo')).idNumber){
      this.dzform.idcard = JSON.parse(localStorage.getItem('userInfo')).idNumber
    }else{
      return this.$utils.showError("发生错误，请联系管理员");
    }
    // 先赋值再拿名称申报的名称覆盖
    // if (this.$utils.getItem('member')) {
    //   const member = this.$utils.getItem('member')
    //   if (member.memberOrgWay) { // 含有组织方式字段,个体户
    //     this.form = member
    //   } else {
    //     this.$utils.removeItem('member')
    //   }
    // }
    // 获取草稿详情
    if (this.$utils.getItem('draftNumber')) {
      this.$store.dispatch('draft/getDraftDetail', this.$utils.getItem('draftNumber')).then(async res => {
        if (res.member) {
          this.form = res.member
        }
      })
    }
  },
  methods: {
    checkIdCardInfo(path, type) {
      return new Promise(resolve => {
        this.$utils.showLoading({ text: `正在识别身份证${type}面，请稍后...` })
        getIdCardInfo(path).then(res => {
          this.$utils.hideLoading()
          resolve(res.outData.cards)
        })
      })
    },
     searchDzzz() {
      this.$loading({ text: '加载中...' })
      let params = {
        CertificateHolderCode: this.dzform.idcard,
        CertificateType: "中华人民共和国居民身份证",
        CertificateTypeCode: "",
        CertificateNumber: "",
        CertificateName: "",
        Mode: "1",
      };
      if(params.CertificateHolderCode===''||params.CertificateHolderCode===null){
        return this.$utils.showError("发生错误，请联系管理员"); 
      }
      SYRetrieval(params).then((res) => {
        this.$loading().close()
        this.dzform.base64DownPhoto = res.data.base64DownPhoto;
        this.dzform.base64UpPhoto = res.data.base64UpPhoto;
        this.$utils.setItem('base64DownPhoto', res.data.base64DownPhoto)
        this.$utils.setItem('base64UpPhoto', res.data.base64UpPhoto)
      });
      // this.$loading().close()
      // return this.$utils.showError("证照库未查询到相关信息"); 
    },
    async getIdCardInfos() {
      let base64DownPhoto = this.$utils.getItem('base64DownPhoto')
      let base64UpPhoto = this.$utils.getItem('base64UpPhoto')
      if(!base64DownPhoto || !base64UpPhoto) {
        return this.$utils.showError("查询证照失败")
      }
      let img = base64DownPhoto.substring(20)
      let front = await this.checkIdCardInfo(img, '正')
      if(!front) return this.$utils.showError("身份证正面识别失败")
      this.memberForm.idcName = front.name;
      this.memberForm.idcNumber = front.id_card_number;
      this.memberForm.idAddress = front.address;
      this.memberForm.front = base64DownPhoto

      let img2 = base64UpPhoto.substring(20)
      let back = await this.checkIdCardInfo(img2, '反')
      if(!back) return this.$utils.showError("身份证反面识别失败")
      this.memberForm.back = base64UpPhoto
      this.validateFront = false
      this.DzzzDialog = false
    },

    async checkUser() {
      let title = this.$utils.getLocalItem("modaltitle");
      let type = this.$utils.setLocalItem("tabType");
      if (title == "内资企业辅助开办" && type == "法人") {
        let data = {
          cerno: this.memberForm.idcNumber,
          uniscid: memberForm.legalIdNumber,
        };
        await this.checkIfOnePerson(data);
      }
      this.checkIfLaoLai();
      this.checkIfBlack();
    },
     handlecheck() {
      this.disabled = false;
      this.checkUser();
    },

    checkIfOnePerson(data) {
      checkIfOnePerson(data).then((res) => {
        let message = JSON.parse(res.message);
        if (message.code == 200) {
          this.oneflag = true;
          this.disabled = true;
          this.$utils.showError("一人有限公司无法添加股东");
        }
      });
    },
    checkIfBlack() {
      let params = {
        cerno: this.memberForm.idcNumber
      }
      checkIfBlack(params).then(res => {
        let message = JSON.parse(res.message)
        if(message.code == 200 ) {
          this.blackflag = true
          this.disabled = true;
          this.$utils.showError('该自然人存在黑名单中，无法添加')
        }
      })
    },
    checkIfLaoLai() {
      let params = {
        cerno: this.memberForm.idcNumber
      }
      checkIfLaoLai(params).then(res => {
        let message = JSON.parse(res.message)
        if(message.code == 200) {
          this.llflag = true
          this.disabled = true;
          this.$utils.showError('该自然人存在老赖名单中，无法添加')
        }
      })

    },
    openDzzz() {
      this.DzzzDialog = true
      setTimeout(()=>{
        this.searchDzzz()
      },0)
      },
    singleElection(selection,row) {
      this.getuserimg(row)
      this.getuserinfo(row)
    },
    getuserimg(row) {
      let params = {
        AccountId: "11420300741794186H.017",
        CertificateID: row.certificateID,
      };
      GetCertificateImageByCertificateID(params).then((res) => {
        let result = JSON.parse(res.data);
        result.data = JSON.parse(result.data);
        console.log(result.data, "111111111");
      });
    },
    getuserinfo(row) {
      let params = {
        AccountId: "11420300741794186H.017",
        CertificateID: row.certificateID,
      };
      GetCertificateDataByCertificateID(params).then((res) => {
        let result = JSON.parse(res.data);
        result.data = JSON.parse(result.data);
        console.log(result.data, "111111111");
      });
    },
    // 保存草稿
    handleSaveDraft(showTips = false) {
      return new Promise((resolve, reject) => {
        const data = {
          ...this.draftInfo, // 原有数据
          member: this.form, // 现在数据覆盖原有数据
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
          this.memberForm.idcName = e[0].name
          this.memberForm.idcNumber = e[0].id_card_number
          this.memberForm.idAddress = e[0].address
          this.validateFront = true
        }
      }, 300)
    },
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
          this.memberForm.idcName = e.name
          this.memberForm.idcNumber = e.id_card_number
          this.memberForm.idAddress = e.address
          this.validateFront = true
        }
      }, 300)
    },
    // 添加人员成功以后重置数据
    handleReset() {
      this.jobsList = [] // 重置职务列表
      this.editIndex = -1 // 重置编辑下标
      this.memberForm = {
        idcName: '', // 人员姓名
        idcType: '身份证', // 证件类型
        idcNumber: '', // 证件号码
        idAddress: '', // 证件地址
        phone: '', // 移动电话
        jobs: [], // 人员职务
        front: '', // 证件人面像
        back: '', // 证件反面
        politics: '群众', // 政治面貌
        education: '', // 文化程度
        nation: '汉族', // 民族
        sex: '', // 性别
        nationality: '中国' // 国籍
      }
    },
    // 每次打开弹窗重置职务列表
    handleResetJobsList() {
      if (this.form.memberOrgWay === '个人经营') {
        this.jobsList = [
          {
            id: 100,
            name: '联络员'
          },
          {
            id: 120,
            name: '主要经营者'
          }, {
            id: 140,
            name: '经办人/委托代理人'
          }
        ]
      } else {
        this.jobsList = [
          {
            id: 100,
            name: '联络员'
          },
          {
            id: 120,
            name: '主要经营者'
          }, {
            id: 130,
            name: '参与经营者'
          }, {
            id: 140,
            name: '经办人/委托代理人'
          }
        ]
      }
    },
    // 切换类型时
    handleChangeType(value) {
      if (value === '个人经营') { // 个人经营删除所有参与经营者
        const names = ['参与经营者']
        if (this.form.memberList.length) { // 不设立监事会，清除names职务
          this.handleSpliceJob(names)
        }
        this.currentCount = this.handleGetCount()
      }
    },
    handleGetCount() {
      const currentCount = { // 初始化人数避免报错
        '主要经营者': 0,
        '参与经营者': 0,
        '经办人/委托代理人': 0,
        '联络员': 0
      }
      this.form.memberList.forEach(item => {
        if (item.jobs.length) { // 校验自然人职务人数
          item.jobs.forEach(val => {
            if (currentCount[val.name]) {
              currentCount[val.name] += 1
            } else {
              currentCount[val.name] = 1
            }
          })
        }
      })
      return currentCount
    },
    // 遍历清除对应职务
    handleSpliceJob(names) {
      for (let i = this.form.memberList.length - 1; i >= 0; i--) {
        if (this.form.memberList[i].jobs.length) {
          for (let j = this.form.memberList[i].jobs.length - 1; j >= 0; j--) {
            if (names.includes(this.form.memberList[i].jobs[j].name)) {
              this.form.memberList[i].jobs.splice(j, 1)
            }
          }
          if (!this.form.memberList[i].jobs.length) { // 如果对应人员没有职务，删除该人员
            this.form.memberList.splice(i, 1)
          }
        }
      }
    },
    // 更新扫码上传数据
    updateFileList(val) {
      this.$set(this.memberForm, 'back', val.data[0].back)
      this.$set(this.memberForm, 'front', val.data[0].front)
    },
    // 校验自然人身份证和手机号
    filterGD(memberForm) {
      // 编辑操作先重置
      if (this.editIndex !== -1) {
        this.form.memberList[this.editIndex].idcNumber = ''
        this.form.memberList[this.editIndex].phone = ''
      }
      // console.log(this.form.memberList, this.editIndex)
      for (const item of this.form.memberList) {
        if (item.idcNumber === memberForm.idcNumber) {
          return 'idcNumber'
        }
        if (item.phone === memberForm.phone) {
          return 'phone'
        }
      }
    },
    handleEdit(index) {
      this.handleReset()
      this.handleResetJobsList()
      this.memberForm = JSON.parse(JSON.stringify(this.form.memberList[index]))
      this.editIndex = index
      this.showNaturalDialog = true
    },
    handleDelete(index) {
      this.form.memberList.splice(index, 1)
    },

    // 点击添加
    handleShowDialog(type) {
      this.handleReset()
      this.handleResetJobsList()
      this.showNaturalDialog = true
    },

    // 添加职务 = dialog1
    handleAddJob() {
      this.memberForm.jobs.push({
        id: '', // 职务名称ID
        name: '' // 职务名称
      })
    },
    // 删除职务 = dialog2
    handleDelJob(index) {
      this.memberForm.jobs.splice(index, 1)
    },

    // 修改职务
    // 修改职务
    handleChangeJob(value, index) {
      const count = this.memberForm.jobs.filter(item => item.id === value)
      const name = this.jobsList.filter(item => item.id === value)[0].name
      // 获取目前有的职务
      const keys = this.memberForm.jobs.map(item => item.id)
      // 先清空值，满足条件再重新赋值
      this.memberForm.jobs[index].id = ''
      this.memberForm.jobs[index].name = ''
      // 选择拦截
      // 添加完成更新人员数量
      const currentCount = this.handleGetCount()
      // 校验同一个职务的互斥性
      if (count.length > 1) {
        this.$utils.showError('您已经选择过该职务了，无需重复选择')
        this.memberForm.jobs[index].id = ''
        this.memberForm.jobs[index].name = ''
      } else if (value === 120 && currentCount['主要经营者'] > 0) { // 主要经营者
        this.$utils.showError('您已经选择过主要经营者了，无需重复选择')
        this.memberForm.jobs[index].id = ''
        this.memberForm.jobs[index].name = ''
      } else if (value === 140 && currentCount['经办人/委托代理人'] > 0) {
        this.$utils.showError('您已经选择过经办人/委托代理人了，无需重复选择')
      } else if (value === 120 && keys.includes(130)) { // 如果选择的是主要经营者且已经选择参与经营者
        this.$utils.showError('您已经选择过参与经营者了，不能选择主要经营者')
      } else if (value === 120 && keys.includes(130)) { // 如果选择的是主要经营者且已经选择参与经营者
        this.$utils.showError('您已经选择过参与经营者了，不能选择主要经营者')
      } else if (value === 130 && keys.includes(120)) { // 如果选择的是参与经营者且已经选择主要经营者
        this.$utils.showError('您已经选择过主要经营者了，不能选择参与经营者')
      } else {
        this.memberForm.jobs[index].id = value
        this.memberForm.jobs[index].name = name
      }
    },
    // 确认添加人员
    handleAddMember(type) {
      if (window.location.href.includes('192.168.114')) {
        this.memberForm.back = 'd73100ee37244672b90f82fe722301c9.jpg'
        this.memberForm.front = 'd73100ee37244672b90f82fe722301c9.jpg'
      }
      const memberForm = this.memberForm
      console.log(`%c%s`, `color:blue`, `[Debug] ~ handleAddMember ~ memberForm`, memberForm)
      // 过滤完以后做非空校验
      if (!memberForm.idcName) { // 人员姓名
        return this.$utils.showError('请填写人员姓名')
      } else if (!memberForm.idcNumber) {
        return this.$utils.showError('请填写证件号码')
      } else if (memberForm.idcType === '身份证' && !this.$utils.regExp('idCard', memberForm.idcNumber)) {
        return this.$utils.showError('身份证格式不正确')
      } else if (this.filterGD(memberForm) === 'idcNumber') {
        return this.$utils.showError('身份证已占用，请修改！')
      } else if (!memberForm.idAddress) {
        return this.$utils.showError('请填写证件地址')
      } else if (!memberForm.front) {
        return this.$utils.showError('请上传身份证人像面')
      } else if (!memberForm.back) {
        return this.$utils.showError('请上传身份证人像背面')
      // } else if (!this.validateFront) {
        // return this.$utils.showError('身份证人像面识别失败，请重新上传!')
      // } else if (!this.validateBack) {
        // return this.$utils.showError('身份证国徽面识别失败或已过有效期，请重新上传!')
      } else if (!memberForm.phone) {
        return this.$utils.showError('请填写移动电话')
      } else if (!this.$utils.regExp('phone', memberForm.phone)) {
        return this.$utils.showError('移动电话格式不正确')
      } else if (this.filterGD(memberForm) === 'phone') {
        return this.$utils.showError('移动电话已占用，请修改！')
      } else if (!memberForm.politics) {
        return this.$utils.showError('请选择政治面貌')
      } else if (!memberForm.education) {
        return this.$utils.showError('请选择文化程度')
      }

      // 校验自然人身份证和手机号
      if (this.filterGD(memberForm) === 'idcNumber') {
        return this.$utils.showWarn('身份证已占用，请修改！')
      } else if (this.filterGD(memberForm) === 'phone') {
        return this.$utils.showWarn('手机号已占用，请修改！')
      }
      if (!memberForm.jobs.length) {
        return this.$utils.showWarn('请选择职务！')
      }
      // 校验人员是否未成年
      if (memberForm.idcType === '身份证') {
        const age = this.$utils.formatIdCard(memberForm.idcNumber, 3)
        if (+age < 18) {
          return this.$utils.showWarn('该人员年龄未满18周岁，不可作为企业管理人员！')
        }
      }
      if (type === 'showNaturalDialog') { // 添加前自然人过滤多余人员和出资方式
        this.memberForm.jobs = this.memberForm.jobs.filter(item => item.id)
      }
      if (this.editIndex === -1) { // 新增
        this.form.memberList.push(this.memberForm)
      } else { // 编辑
        this.form.memberList.splice(this.editIndex, 1, this.memberForm)
      }
      this.showNaturalDialog = false
      this.memberForm = {
        idcName: '', // 人员姓名
        idcType: '身份证', // 证件类型
        idcNumber: '', // 证件号码
        idAddress: '', // 证件地址
        phone: '', // 移动电话
        jobs: [], // 人员职务
        front: '', // 证件人面像
        back: '', // 证件反面
        politics: '群众', // 政治面貌
        education: '', // 文化程度
        nation: '汉族', // 民族
        sex: '', // 性别
        nationality: '中国' // 国籍
      }
    },

    async handleNext() {

      const userInfo=this.$utils.getLocalItem('userInfo')
      if (!this.form.memberList.some(item => item.idcName === userInfo.name)) {
        return this.$utils.showError(`登陆人 ${userInfo.name} 需担任至少一个职位`);
      }
      // 查出必须要有的职务缺少的部分
      const names = ['主要经营者', '经办人/委托代理人', '联络员'] // 基本选项
      // 查出必须要有的职务缺少的部分
      if (this.form.memberOrgWay === '家庭经营') {
        names.push('参与经营者')
      }
      this.currentCount = this.handleGetCount()
      for (const i in this.currentCount) {
        if (names.includes(i) && this.currentCount[i] === 0) {
          return this.$utils.showError(`至少要添加一个${i},请先添加后再进行下一步操作`)
        }
      }
      await this.handleSaveDraft()
      this.$utils.setItem('member', this.form)
      if (this.$route.query.whatfrom === 'jointOffice') { // 一事联办，继续填写数据
        this.$router.push({ path: '/form/personnel', query: { ...this.$route.query }})
        return
      }
      this.$router.push({ path: '/form/otherInfo', query: { ...this.$route.query }})
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
    width: 1200px;
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

      ::v-deep .z_radio_item .el-form-item__label{
        padding-left: 15px;
      }
      .plain {
        width: 120px;
        border: 1px solid #3162E8;
        color: #3162E8;
      }

      .radio {
        height: 43px;

        .el-radio {
          width: 120px;
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
