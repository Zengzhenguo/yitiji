<template>
  <div class="legal-dialog">
    <!--法人弹窗-->
    <el-dialog
      class="dialog"
      :visible.sync="showLegalDialog"
      :show-close="false"
      width="945px"
      :close-on-click-modal="false"
    >
      <div slot="title" class="custom-title">
        <div class="label">添加法人</div>
        <div class="close" @click="showLegalDialog = false">关闭</div>
      </div>
      <div>
        <el-form ref="legal-form" label-position="left" class="form" :model="memberForm" label-width="84px" style="padding-top: 0;">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="公司名称">
                <el-input v-model="memberForm.idcName" placeholder="请填写" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="证件类型">
                <el-select v-model="memberForm.idcType" placeholder="请选择">
                  <el-option label="营业执照" value="营业执照" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="证件号码">
                <el-input v-model="memberForm.idcNumber" placeholder="请填写统一社会信用代码" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="证件照片">
                <div class="pic-box">
                  <el-upload
                    action="/"
                    :limit="1"
                    :show-file-list="false"
                    :before-upload="beforeUploadLicense"
                  >
                    <div class="pic">
                      <div class="logo">

                        <img :src="memberForm.licensePic ? $utils.getFile(memberForm.licensePic) : license" />
                      </div>
                      <div class="desc">
                        <img src="../../assets/images/camera_icon.png" />
                        <span>点击上传营业执照</span>
                      </div>
                    </div>
                  </el-upload>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="法定代表人姓名" label-width="132px">
                <el-input v-model="memberForm.legalName" placeholder="请填写" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="移动号码">
                <el-input v-model="memberForm.phone" placeholder="请填写" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="证件类型">
                <el-select v-model="memberForm.legalIdType" placeholder="请选择">
                  <el-option label="身份证" value="身份证" />
                  <el-option label="香港往来内地通行证" value="香港往来内地通行证" />
                  <el-option label="澳门往来内地通行证" value="澳门往来内地通行证" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="证件号码">
                <el-input v-model="memberForm.legalIdNumber" placeholder="请填写" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="投资情况" />
            </el-col>
            <el-col :span="12" class="add-btn">
              <el-button class="plain" @click="handleAddInvestment">添加投资方式</el-button>
            </el-col>
          </el-row>
          <template v-if="memberForm.investorsList.length">
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
          <div v-else class="add-tips">请添加投资方式</div>
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
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddMember('showLegalDialog')">确定添加</el-button>
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
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
