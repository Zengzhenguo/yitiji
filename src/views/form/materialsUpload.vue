<template>
  <div class="base-form">
    <!-- <page-header /> -->
    <breadcrumb />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <div class="min-title">支持JPG,PNG,PDF</div>
    </div>
    <div class="box">
      <el-form ref="form" label-position="left" class="form" :model="form" label-width="94px">
        <el-table
          ref="materialsTable"
          :data="tableData"
          :span-method="spanMethod"
          border
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="parentCategory" label="类别名称" align="center" />
          <el-table-column prop="materialName" label="材料名称" align="center" />
          <el-table-column label="上传材料预览" width="480" align="center">
            <template slot-scope="scope">
              <div class="table-imgBox">
                <div v-for="(item,index) in scope.row.url" :key="index" class="table-imgLi">
                  <img v-if="!judgeIsPdf(item)" class="table-img" :src="$utils.getFile(item)" @click="handlePreview(item)" />
                  <div v-else class="pdf" @click="handlePreview(item)">
                    <pdf class="table-img" :src="baseUrl + item" style="overflow:hidden;" />
                  </div>
                  <span class="table-imgSpan" @click="handleDel(scope.$index, index)">删除</span>
                </div>
                <div v-if="scope.row.url.length === 0" style="color: red;">请上传对应的材料</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="110" align="center">
            <template slot-scope="scope">
              <upload-code placement="bottom-start" :alias="scope.$index" @update="updateFileList" />
            </template>
          </el-table-column>
        </el-table>
        <el-form-item class="btn-group text-center" label-width="0">
          <el-button @click="handleSaveDraft(true)">暂存草稿</el-button>
          <el-button @click="$router.go(-1)">上一步</el-button>
          <el-button type="primary" @click="handleNext">提交申请</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog :visible.sync="PDF.isOpen" width="60%">
      <embed
        :src="PDF.url"
        type="application/pdf"
        style="overflow:hidden;width:100%;height:500px;"
      />
    </el-dialog>
  </div>
</template>

<script>
import UploadCode from '@/components/UploadFile/uploadCode'
import Breadcrumb from '@/components/Breadcrumb/index'
import { getBusinessLicenseList, setYYYZInfo, setLogoutCompanyInfo } from '@/api/index'
import pdf from 'vue-pdf'
export default {
  components: {
    UploadCode,
    Breadcrumb,
    pdf
  },
  data() {
    return {
      // 不可选小于当前日期的
      newDateOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      tableData: [],
      baseUrl: window.location.origin + `${this.$utils.getPrefix()}/open-platform/`,
      PDF: {
        isOpen: false,
        uploadPdfData: [],
        url: ''
      },
      form: {
        materialList: []
      }
    }
  },
  computed: {
    draftInfo() {
      return this.$store.state.draft.draftInfo
    }
  },
  created() {
    if (this.$route.query.bizName === '简易注销') {
      // 获取注销材料
      this.getMaterialList()
      return
    }
    this.getBusinessLicenseConfig()
  },
  async mounted() {
  },
  activated() {
    // 获取草稿详情
    if (this.$utils.getItem('draftNumber')) {
      this.$store.dispatch('draft/getDraftDetail', this.$utils.getItem('draftNumber')).then(async res => {
      })
    }
  },
  methods: {
    // 获取需要上传的材料列表
    getBusinessLicenseConfig() {
      getBusinessLicenseList(this.$route.query.minType).then(res => {
        console.log(res.data)
        this.tableData = res.data
        for (const item of this.tableData) {
          item['url'] = []
        }
      })
    },
    // 获取注销材料
    getMaterialList() {
      const list = [
        {
          businessLicenseConfigList: null,
          category: null,
          id: null,
          level: null,
          materialName: '国家企业信用信息公司系统注销截图',
          parentCategory: '公司注销材料',
          parentId: null
        },
        {
          businessLicenseConfigList: null,
          category: null,
          id: null,
          level: null,
          materialName: '简易注销材料',
          parentCategory: '公司注销材料',
          parentId: null
        },
        {
          businessLicenseConfigList: null,
          category: null,
          id: null,
          level: null,
          materialName: '简易注销申请表',
          parentCategory: '公司注销材料',
          parentId: null
        }
      ]
      this.tableData = list
      for (const item of this.tableData) {
        item['url'] = []
      }
      // getBusinessLicenseList(this.$route.query.minType).then(res => {
      //   console.log(res.data)
      //   this.tableData = res.data
      //   for (const item of this.tableData) {
      //     item['url'] = []
      //   }
      // })
    },
    // 合并单元行或者列
    /**
     * @param {*} param0
     * row 当前行的数据
     * column 列的数据
     * rowIndex 行的下标
     * columnIndex 列的下标
     *
     */
    spanMethod({ row, column, rowIndex, columnIndex }) {
      const that = this
      function objectSpanMethod(row, column, rowIndex, columnIndex) {
        // columnIndex代表列，合并表格
        const newArr = that.formatRowspanAndColspan(
          that.tableData,
          'parentCategory'
        )
        // 合并第二列
        if (columnIndex === 1) {
          const num = newArr[rowIndex].num
          if (num > 1) {
            return {
              rowspan: num,
              colspan: 1
            }
          } else if (num < 1) {
            return {
              rowspan: 1,
              colspan: num
            }
          } else {
            return {
              rowspan: 1,
              colspan: 1
            }
          }
        }
      }
      return objectSpanMethod(row, column, rowIndex, columnIndex)
    },
    // 过滤重复数组
    formatRowspanAndColspan(tableData, tableKey) {
      const newArr = []
      // 分类检出tempList中的数据push到newArr中
      for (let i = 0; i < tableData.length;) {
        let count = 0
        for (let j = i; j < tableData.length; j++) {
          if (tableKey === 'parentCategory') {
            if (tableData[i].parentCategory === tableData[j].parentCategory) {
              count++
            }
          }
        }
        if (tableKey === 'parentCategory') {
          newArr.push({
            data: tableData[i].parentCategory,
            num: count
          })
        }
        i += count
      }
      // 根据此算法，格式化newArr中的数据
      for (let k = 0; k < newArr.length; k++) {
        if (newArr[k].num > 1 || newArr[k].num === 0) {
          for (let w = k; w < newArr[k].num + k - 1; w++) {
            newArr.splice(w + 1, 0, {
              data: newArr[k].data,
              num: 0
            })
          }
        }
      }
      return newArr
    },

    // 更新扫码上传数据
    updateFileList(val) {
      console.log('扫码上传回调：', val)
      const tableData = JSON.parse(JSON.stringify(this.tableData))
      tableData.forEach((item, index) => {
        if (+val.type === index) {
          item.url = item.url.concat(val.data)
        }
      })
      console.log(tableData)
      this.$set(this, 'tableData', tableData)
    },

    // 删除图片
    handleDel(tableIndex, index) {
      this.tableData[tableIndex].url.splice(index, 1)
    },
    // 判断文件 uuid是否为 pdf
    judgeIsPdf(url) {
      const type = url.slice(-3)
      return type === 'pdf'
    },
    // 查看图片或pdf
    handlePreview(url) {
      console.log(`${url}`)
      if (!this.judgeIsPdf(url)) {
        this.isPicturePreview = true
        this.dialogImageUrl = this.$utils.getFile(url)
      } else {
        this.isPdfPreview = true
        this.dialogPdfUrl = this.$utils.getFile(url)
      }
    },

    // 保存草稿
    handleSaveDraft(showTips = false) {
      return new Promise((resolve, reject) => {
        const data = {
          ...this.draftInfo, // 原有数据
          otherInfo: this.form, // 现在数据覆盖原有数据
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
    // 提交申请
    handleNext() {
      console.log(this.form)
      this.$refs['form'].validate(async valid => {
        if (valid) {
          let bold = false
          const materialPath = JSON.parse(JSON.stringify(this.tableData))
          materialPath.forEach(item => {
            if (item.url.length === 0) {
              bold = true
            } else {
              item.url = item.url.join(',')
            }
          })
          if (bold) {
            this.$utils.showError('材料请上传完整')
            return
          }
          const applicantInfo = this.$utils.getItem('applicantInfo')
          const data = {
            ...applicantInfo,
            materialPath,
            industryCategory: this.$route.query.minType,
            channelToken: this.$utils.getLocalItem('token')
          }
          // this.$loading({ text: '正在获取pdf内容' })
          // 传入标识做判断如果是this.$route.query.whatfrom === 'jointOffice',用一事联办job
          console.log(data)
          // 提交简易注销数据
          if (this.$route.query.bizName === '简易注销') {
            setLogoutCompanyInfo(data).then(res => {
              if (res.errCode === 500 || res.state === 'faulted') {
                return this.$utils.showError('提交失败，请重试！')
              }
              this.$utils.removeItem('applicantInfo')
              this.$utils.showSuccess('提交成功等待审核！')
              this.$router.replace('/')
            })
            return
          }
          // 提交一业一证数据
          setYYYZInfo(data).then(res => { // 提交数据获取预览pdf
            // this.$loading().close()
            if (res.errCode === 500 || res.state === 'faulted') {
              return this.$utils.showError('提交失败，请重试！')
            }
            this.$utils.removeItem('applicantInfo')
            this.$utils.showSuccess('提交成功等待审核！')
            this.$router.replace('/')
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
::v-deep .el-input-group__append, .el-input-group__prepend {
  background: #fff;
  border-left: 0;
}
// ::v-deep .el-input-group>.el-input__inner {
//   border-right: 0;
// }
// ::v-deep .el-input-group__append:focus, .el-input-group__prepend:focus  {
//   border: 1px solid #3162E8;
// }
.base-form {
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
    .min-title{
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      line-height: 40px;
    }
    .form {
      padding-top: 60px;
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
      .radio_group_bottom{
        font-size: 14px;
        padding: 10px 0 39px 100px;
      }
      .radio {
        // height: 43px;
        .el-radio {
          width: 120px;
          height: 43px;
          padding: 0;
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
        padding-top: 50px;
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
            width: 232px;
            color: #fff;
          }
        }
      }
    }
  }
}
      .table-imgBox {
        display: flex;
        flex-wrap: wrap;
        .table-imgLi {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 10px 10px 0;
          .table-img {
            width: 80px;
            height: 115px;
            border-radius: 5px;
            margin-bottom: 5px;
            border: 1px solid #DCDFE6;
          }
          &:hover {
            cursor: pointer;
            border-color: #C0C4CC;
            // opacity: .8;
          }
          // .pdf {
          //   width: 100%;
          //   height: 100%;
          // }
          .table-imgSpan {
            font-size: 12px;
            color: #169BD5;
            cursor: pointer;
            display: block;
          }
        }
      }
</style>
