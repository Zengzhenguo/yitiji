<template>
  <div class="natural-dialog">
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
            <el-col :span="10">
              <el-form-item label="人员姓名">
                <el-input v-model="memberForm.idcName" placeholder="请填写" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="移动电话">
                <el-input v-model="memberForm.phone" placeholder="请填写" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="证件类型">
                <el-select v-model="memberForm.idcType" placeholder="请选择">
                  <el-option label="身份证" value="身份证" />
                  <el-option label="香港往来内地通行证" value="香港往来内地通行证" />
                  <el-option label="澳门往来内地通行证" value="澳门往来内地通行证" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="证件号码">
                <el-input v-model="memberForm.idcNumber" placeholder="请填写" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="证件照片">
                <div class="pic-box">
                  <el-upload
                    action="/"
                    :limit="1"
                    :show-file-list="false"
                    :before-upload="beforeUploadFront"
                  >
                    <div class="pic">
                      <div class="logo">

                        <img :src="memberForm.front ? $utils.getFile(memberForm.front) : front" />
                      </div>
                      <div class="desc">
                        <img src="../../assets/images/camera_icon.png" />
                        <span>点击上传人像面</span>
                      </div>
                    </div>
                  </el-upload>
                  <el-upload
                    action="/"
                    :limit="1"
                    :show-file-list="false"
                    :before-upload="beforeUploadBack"
                  >
                    <div class="pic">
                      <div class="logo">

                        <img :src="memberForm.back ? $utils.getFile(memberForm.back) : back" />
                      </div>
                      <div class="desc">
                        <img src="../../assets/images/camera_icon.png" />
                        <span>点击上传人像背面</span>
                      </div>
                    </div>
                  </el-upload>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="radio" label="是否投资人" label-width="100">
                <el-radio v-model="memberForm.investors" :label="true" border @change="handleChangeRadio">是</el-radio>
                <el-radio v-model="memberForm.investors" :label="false" border @change="handleChangeRadio">否</el-radio>
              </el-form-item>
            </el-col>
            <el-col v-if="memberForm.investors" :span="12" class="add-btn">
              <el-button class="plain" @click="handleAddInvestment">添加投资方式</el-button>
            </el-col>
          </el-row>
          <template v-if="memberForm.investors && memberForm.investorsList.length > 0">
            <el-row v-for="(item,index) in memberForm.investorsList" :key="index + 10000" :gutter="20">
              <el-col :span="10">
                <el-form-item label="出资方式">
                  <el-select :value="item.way" placeholder="请选择" @change="handleChangeWay($event,index)">
                    <el-option
                      v-for="val in ways"
                      :key="val"
                      :label="val"
                      :value="val"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="认缴出资额" label-width="100px">
                  <el-select v-model="item.currency" placeholder="请选择">
                    <el-option label="人民币" value="人民币" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="0">
                  <el-input v-model="item.money" placeholder="请填写">
                    <template slot="append">万元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item label-width="0">
                  <el-button type="text" @click="handleDelInvestment(index)">删除</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <div v-if="memberForm.investors && memberForm.investorsList.length === 0" class="add-tips">请添加投资方式</div>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="出资时间">
                <el-date-picker
                  v-model="memberForm.time"
                  :editable="false"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择出资时间"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="担任职务" />
            </el-col>
            <el-col :span="12" class="add-btn">
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
                  <el-select v-model="item.id" placeholder="请选择" @change="handleChangeJob($event,index)">
                    <el-option
                      v-for="val in jobsList"
                      :key="val.id"
                      :label="val.name"
                      :value="val.id"
                      :disabled="val.disabled"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item v-if="keys.includes(item.id)" label="任免方式">
                  <el-select :value="item.ways" placeholder="请选择" @change="handleChangeWay($event,index)">
                    <el-option
                      v-for="val in item.waysList"
                      :key="val"
                      :label="val"
                      :value="val"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item v-if="keys.includes(item.id)" label="任免机构">
                  <el-select :value="item.institutions" placeholder="请选择" @change="handleChangeWay($event,index)">
                    <el-option
                      v-for="val in item.institutionsList"
                      :key="val"
                      :label="val"
                      :value="val"
                    />
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
  </div>
</template>

<script>
import { uploadFile } from '@/api/common'
export default {
  components: {},
  data() {
    return {
      memberForm: {
        idcName: '', // 人员姓名或企业名称
        idcType: '', // 证件类型
        idcNumber: '', // 证件号码
        idAddress: '', // 自然人证件地址
        legalName: '', // 法人姓名
        legalIdType: '身份证', // 法人证件类型
        legalIdNumber: '', // 法人证件号码
        front: '', // 自然人身份证人像面
        back: '', // 自然人身份证背面
        licensePic: '', // 法人营业执照照片
        phone: '', // 自然人或法人移动电话
        investors: false, // 是否投资人
        type: '', // 股东类型（自然人股东、法人股东）
        investorsList: [{ // 投资人列表
          way: '货币', // 自然人或法人出资方式
          currency: '人民币', // 币种
          money: '' // 自然人或法人出资金额,支持小数点后3位
        }],
        time: '', // 自然人或法人出资时间
        jobs: [
          // { // 自然人人员职务
          //   id: '', // 职务名称ID
          //   name: '', // 职务名称(显示项)
          //   ways: '', // 任免方式
          //   nationality: '中国', // 国籍
          //   institutions: '', // 任免机构
          //   waysList: [], // 该职务任免方式选项
          //   institutionsList: [] // 该职务任免机构选项
          // }
        ]
      }
    }
  },
  computed: {},
  mounted() {},
  created() {},
  methods: {
    // 添加职务
    handleAddJob() {
      this.memberForm.jobs.push({
        id: '', // 职务名称ID
        name: '', // 职务名称
        ways: '', // 任免方式
        institutions: '', // 任免机构
        waysList: [], // 该职务任免方式选项
        institutionsList: [] // 该职务任免机构选项
      })
    },
    // 删除职务
    handleDelJob(index) {
      this.memberForm.jobs.splice(index, 1)
      // if (!this.memberForm.investors && !this.memberForm.jobs.length) { // 如果不是投资人且删到没职务
      //   this.disabled = true
      // }
      this.handleChangeBtn(this.memberForm.investors)
    },
    // 修改职务
    handleChangeJob(value, index) {
      // 过滤出已选职务名称
      const name = this.jobsList.filter(item => item.id === value)[0].name
      const keys = this.memberForm.jobs.map(item => item.id)
      if (!this.memberForm.investors && keys.length) { // 如果不是投资人,且设置了职务
        this.disabled = false
      } else if (!this.memberForm.investors && keys.length === 0) {
        this.disabled = true
      }
      // 先清空值，满足条件再重新赋值
      this.memberForm.jobs[index].id = ''
      this.memberForm.jobs[index].name = ''
      // 选择拦截
      // 添加完成更新人员数量
      const currentCount = { // 初始化人数避免报错
        '法定代表人': 0,
        '经理': 0,
        '执行董事': 0,
        '财务负责人': 0,
        '联络员': 0,
        '委托代理人': 0,
        '监事会主席': 0,
        '监事': 0,
        '监事（职工代表）': 0,
        '董事长': 0,
        '副董事长': 0,
        '董事': 0,
        '董事（职工代表）': 0
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
      // 只允许一人的职务
      const names = ['法定代表人', '经理', '执行董事', '财务负责人', '联络员', '委托代理人', '董事长', '监事会主席']
      // const names2 = ['董事长', '副董事长', '董事', '董事（职工代表）']
      // const names3 = ['监事会主席', '监事', '监事（职工代表']
      if (names.includes(name) && currentCount[name] === 1) { // 已经设置过对应职务了
        return this.$utils.showError(`${name}最多只能添加1个，您已添加过了，无需再添加`)
      } else if (name === '监事' && currentCount[name] >= 2) {
        return this.$utils.showError(`${name}最多只能添加2个，您已添加过了，无需再添加`)
      }
      // else if (names2.includes(name) && (this.currentCount['董事长'] + this.currentCount['副董事长'] + this.currentCount['董事'] + this.currentCount['董事（职工代表）'] < 3)) { // 选择了董事会职务
      //   return this.$utils.showError(`董事会成员不得少于3个`)
      // }
      const count = keys.filter(item => item === value)

      // 查重
      if (count.length > 1) {
        return this.$utils.showError(`您已经选择过该职务了，无需重复选择`)
      }
      // 自动配置单个任免方式
      this.handleSetWays(index, value)
      switch (value) {
        case 10: // 选定法定代表人或者经理或执行董事，禁用监事会主席，监事，监事（职工代表）
        case 45:
        case 85:
        case 90:
          if (keys.includes(60) || keys.includes(70) || keys.includes(80)) {
            this.$utils.showError('您已选择了监事相关职务，不能选择该职务')
          } else {
            this.memberForm.jobs[index].id = value
            this.memberForm.jobs[index].name = name
          }
          break
        case 60: // 选了监事会主席
          if (keys.includes(10)) {
            this.$utils.showError(`您已选择了法定代表人，不能选择该职务`)
          } else if (keys.includes(45)) {
            this.$utils.showError(`您已选择了执行董事，不能选择该职务`)
          } else if (keys.includes(85)) {
            this.$utils.showError(`您已选择了经理，不能选择该职务`)
          } else if (keys.includes(90)) {
            this.$utils.showError(`您已选择了财务负责人，不能选择该职务`)
          } else if (keys.includes(70)) {
            this.$utils.showError(`您已选择了监事，不能选择该职务`)
          } else if (keys.includes(80)) {
            this.$utils.showError(`您已选择了监事（职工代表），不能选择该职务`)
          } else if (keys.includes(40)) {
            this.$utils.showError(`您已选择了董事，不能选择该职务`)
          } else {
            this.memberForm.jobs[index].id = value
            this.memberForm.jobs[index].name = name
          }
          break
        case 70: // 选了监事、监事（职工代表）
        case 80:
          if (keys.includes(10)) {
            this.$utils.showError(`您已选择了法定代表人，不能选择该职务`)
          } else if (keys.includes(45)) {
            this.$utils.showError(`您已选择了执行董事，不能选择该职务`)
          } else if (keys.includes(85)) {
            this.$utils.showError(`您已选择了经理，不能选择该职务`)
          } else if (keys.includes(90)) {
            this.$utils.showError(`您已选择了财务负责人，不能选择该职务`)
          } else if (keys.includes(60)) {
            this.$utils.showError(`您已选择了监事会主席，不能选择该职务`)
          } else if (value === 70 && keys.includes(80)) {
            this.$utils.showError(`您已选择了监事（职工代表），不能选择该职务`)
          } else if (value === 80 && keys.includes(70)) {
            this.$utils.showError(`您已选择了监事，不能选择该职务`)
          } else if (keys.includes(20)) {
            this.$utils.showError(`您已选择了董事长，不能选择该职务`)
          } else if (keys.includes(30)) {
            this.$utils.showError(`您已选择了副董事长，不能选择该职务`)
          } else if (keys.includes(40)) {
            this.$utils.showError(`您已选择了董事，不能选择该职务`)
          } else if (keys.includes(50)) {
            this.$utils.showError(`您已选择了董事（职工代表），不能选择该职务`)
          } else {
            this.memberForm.jobs[index].id = value
            this.memberForm.jobs[index].name = name
          }
          break
        case 20:
        case 30:
          if (keys.includes(60)) {
            this.$utils.showError(`您已选择了监事会主席，不能选择该职务`)
          } else if (keys.includes(80)) {
            this.$utils.showError(`您已选择了监事（职工代表），不能选择该职务`)
          } else if (keys.includes(70)) {
            this.$utils.showError(`您已选择了监事，不能选择该职务`)
          } else if (value === 30 && keys.includes(20)) {
            this.$utils.showError(`您已选择了董事长，不能选择该职务`)
          } else if (value === 20 && keys.includes(30)) {
            this.$utils.showError(`您已选择了副董事长，不能选择该职务`)
          } else if (keys.includes(40)) {
            this.$utils.showError(`您已选择了董事，不能选择该职务`)
          } else {
            this.memberForm.jobs[index].id = value
            this.memberForm.jobs[index].name = name
          }
          break
        case 40:
        case 50:
          if (keys.includes(60)) {
            this.$utils.showError(`您已选择了监事会主席，不能选择该职务`)
          } else if (keys.includes(80)) {
            this.$utils.showError(`您已选择了监事（职工代表），不能选择该职务`)
          } else if (keys.includes(70)) {
            this.$utils.showError(`您已选择了监事，不能选择该职务`)
          } else if (keys.includes(20)) {
            this.$utils.showError(`您已选择了董事长，不能选择该职务`)
          } else if (keys.includes(30)) {
            this.$utils.showError(`您已选择了副董事长，不能选择该职务`)
          } else if (value === 50 && keys.includes(40)) {
            this.$utils.showError(`您已选择了董事，不能选择该职务`)
          } else if (value === 40 && keys.includes(50)) {
            this.$utils.showError(`您已选择了董事（职工代表），不能选择该职务`)
          } else {
            this.memberForm.jobs[index].id = value
            this.memberForm.jobs[index].name = name
          }
          break
        default: // 其余职务不冲突，直接赋值
          this.memberForm.jobs[index].id = value
          this.memberForm.jobs[index].name = name
          break
      }
    },
    // 配置任免方式，有index单个，没index所有
    handleSetWays(index, value) {
      const way1 = ['任命']
      const way2 = ['聘任']
      const way3 = ['选举']
      const institutions1 = ['股东']
      const institutions2 = ['执行董事']
      const institutions3 = ['股东会（全体）', '股东会所持表决权2/3', '股东会所持表决权过半']
      const institutions4 = ['董事会全体', '董事会人数超过2/3', '董事会人数过半']
      const institutions5 = ['职工代表大会']
      const institutions6 = ['监事会人数过半选举']

      if (index >= 0) {
        switch (value) {
          case 10: // 法定代表人
          case 45: // 执行董事
          case 70: // 监事
          case 40: // 董事
            if (this.companyType === '一人有限责任公司') {
              if (this.memberForm.investors) { // 一人股东且是投资人
                this.memberForm.jobs[index].waysList = way1
                this.memberForm.jobs[index].ways = '任命'
              } else { // 一人股东不是投资人
                this.memberForm.jobs[index].waysList = way2
                this.memberForm.jobs[index].ways = '聘任'
              }
              // 一人股东，任免机构只有股东
              this.memberForm.jobs[index].institutionsList = institutions1
              this.memberForm.jobs[index].institutions = '股东'
            } else if (this.companyType === '有限责任公司（自然人投资或控股）') {
              if (this.memberForm.investors) { // 多人股东且是投资人
                this.memberForm.jobs[index].waysList = way3
                this.memberForm.jobs[index].ways = '选举'
              } else { // 多人股东且不是投资人
                this.memberForm.jobs[index].waysList = way2
                this.memberForm.jobs[index].ways = '聘任'
              }
              // 多人股东，股东大会
              this.memberForm.jobs[index].institutionsList = institutions3
              this.memberForm.jobs[index].institutions = '股东会（全体）'
            }
            break
          case 85: // 经理
            this.memberForm.jobs[index].waysList = way2
            this.memberForm.jobs[index].ways = '聘任'
            // 一人股东任免方式只有执行董事
            if (this.companyType === '一人有限责任公司') {
              this.memberForm.jobs[index].institutionsList = institutions2
              this.memberForm.jobs[index].institutions = '执行董事'
            } else { // 多人股东
              if (this.directors) { // 如果有董事会,则以董事会选项为准
                this.memberForm.jobs[index].institutionsList = institutions4
                this.memberForm.jobs[index].institutions = '董事会全体'
              } else {
                this.memberForm.jobs[index].institutionsList = institutions3
                this.memberForm.jobs[index].institutions = '股东会（全体）'
              }
            }

            break
          case 20: // 董事长
          case 30: // 副董事长
          case 50: // 董事（职工代表）
          case 60: // 监事会主席
          case 80: // 监事（职工代表）
            this.memberForm.jobs[index].waysList = way3
            this.memberForm.jobs[index].ways = '选举'
            if (value === 50 || value === 80) {
              this.memberForm.jobs[index].institutionsList = institutions5
              this.memberForm.jobs[index].institutions = '职工代表大会'
            } else if (value === 60) {
              this.memberForm.jobs[index].institutionsList = institutions6
              this.memberForm.jobs[index].institutions = '监事会人数过半选举'
            } else {
              this.memberForm.jobs[index].institutionsList = institutions4
              this.memberForm.jobs[index].institutions = '董事会全体'
            }
            break
          default:
            break
        }
      }
    },
    uploadFile(type, files) {
      if (files.name.indexOf('pdf') > -1 || files.name.indexOf('jpg') > -1 || files.name.indexOf('png') > -1 || files.name.indexOf('jpeg') > -1) {
        const formData = new FormData()
        formData.append('file', files)
        uploadFile(formData).then(res => {
          if (res.errCode === '1') {
            this.memberForm[type] = res.files.file
          } else {
            this.$utils.showError('上传失败，请重试！')
          }
        })
        return false
      } else {
        this.$utils.showError(`附件只能上传JPG、PNG、PDF`)
        return false
      }
    },
    beforeUploadLicense(files) {
      this.uploadFile('licensePic', files)
      return false
    },
    beforeUploadFront(files) {
      this.uploadFile('front', files)
      return false
    },
    beforeUploadBack(files) {
      this.uploadFile('back', files)
      return false
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
