<template>
  <div class="member-form">
    <!-- <page-header /> -->
    <breadcrumb />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <div class="tips">
        <img src="../../assets/images/after.png" />
        <span>支持JPG,PNG,PDF</span>
      </div>
      <el-form ref="form" label-position="left" class="form" :model="form" label-width="84px">
        <el-row>
          <el-col :span="24">
            <el-table ref="singleTable" :data="form.materialList" highlight-current-row style="width: 100%" border>
              <el-table-column type="index" label="序号" width="80" align="center" />
              <el-table-column property="idcName" label="材料名称" width="300" align="center">
                <template slot-scope="{ row }">
                  {{ row.name }}
                </template>
              </el-table-column>
              <el-table-column label="上传材料预览" align="center">
                <template slot-scope="scope">
                  <div class="table-imgBox">
                    <div v-for="(item,index) in scope.row.imgs" :key="index" class="table-imgLi">
                      <img v-if="!judgeIsPdf(item)" class="table-img" :src="$utils.getFile(item)" @click="handlePreview(item)" />
                      <div v-else class="pdf" @click="handlePreview(item)">
                        <pdf class="table-img" :src="baseUrl + item" style="overflow:hidden;" />
                      </div>
                      <span class="table-imgSpan" @click="handleDel(scope.$index, index)">删除</span>
                    </div>
                    <div v-if="scope.row.imgs.length === 0" style="color: red;">请上传对应的材料</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                  <upload-code placement="bottom-start" :alias="scope.$index" @update="updateFileList" />
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-form-item class="btn-group text-center" label-width="0">
          <el-button @click="handleSaveDraft(true)">暂存草稿</el-button>
          <el-button @click="$router.go(-1)">上一步</el-button>
          <el-button type="primary" @click="handleNext">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog :visible.sync="isPicturePreview">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <el-dialog :visible.sync="isPdfPreview" width="70%">
      <embed
        :src="dialogPdfUrl"
        type="application/pdf"
        style="overflow:hidden;width:100%;height:500px;"
      />
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/index'
import UploadCode from '@/components/UploadFile/uploadCode'
import pdf from 'vue-pdf'
export default {
  components: {
    Breadcrumb,
    UploadCode,
    pdf
  },
  data() {
    return {
      isPicturePreview: false,
      isPdfPreview: false,
      dialogImageUrl: '',
      dialogPdfUrl: '',
      baseUrl: '', // 预览PDF域名
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
    // 获取草稿详情
    if (this.$utils.getItem('draftNumber')) {
      this.$store.dispatch('draft/getDraftDetail', this.$utils.getItem('draftNumber')).then(async res => {
        if (res.uploadMaterial) {
          this.form = res.uploadMaterial
        }
      })
    }
    this.baseUrl = window.location.origin + `${this.$utils.getPrefix()}/open-platform/`
    const materialList = []
    const business = this.$utils.getItem('business')
    console.log(business)
    business.mainForm.forEach((item, index) => {
      if (item.name === '食品销售经营者') {
        materialList.push({ name: '与食品销售相适应的设施设备清单及布局示意图（布局示意图上应标明长、宽，并注明面积）', imgs: [] },
          // { name: '从业人员健康管理、食品安全自查、进货查验记录等保证食品安全的规章制度', imgs: [] }
        )
        item.childs.forEach((child, childIndex) => {
          if (child.isSel && (child.name === '含自动售货' || child.name === '自动售货')) {
            materialList.push({ name: '与食品销售相适应的设施设备清单及布局示意图（布局示意图上应标明长、宽，并注明面积）', imgs: [] })
            materialList.push({ name: '自动售货设备的产品合格证明、具体放置地点，经营者名称、住所、联系方式、食品经营许可证的公示方法等', imgs: [] })
          }
          if (child.isSel && (child.name === '网络经营' || child.name === '含网络经营')) {
            materialList.push({ name: '符合食品安全要求的产品包装材料证明，以及与经营规模相适应、符合配送要求的设施设备等有关资料（运输车辆、容器等）', imgs: [] })
          }
        })
      } else if (item.name === '餐饮服务经营者') {
        materialList.push(
          { name: '经营场所、设备布局、加工流程、卫生设施等平面示意图及说明和经营设备或者设施清单（布局示意图上应标明长、宽，并注明面积）', imgs: [] }
          // ,{ name: '从业人员健康管理、食品安全自查、进货查验、食品安全事故处置等保证食品安全的规章制度', imgs: [] }
        )
        item.childs.forEach((child, childIndex) => {
          if (child.isSel && child.name === '含网络经营') {
            materialList.push({ name: '符合食品安全要求的产品包装材料证明，以及与经营规模相适应、符合配送要求的设施设备等有关资料（运输车辆、容器等）', imgs: [] })
          }
          if (child.isSel && (child.name === '中央厨房' || child.name === '集体用餐配送')) {
            materialList.push({ name: '关键环节食品加工操作规程、符合食品安全要求的产品包装材料证明、与实际产品内容相符合的标识说明样张、与经营规模相适应、符合配送要求的设施设备等有关资料（运输车辆、容器等）和开展食品及环节表面菌落总数、致病菌检验设施设备清单', imgs: [] })
          }
        })
      } else {
        materialList.push(
          { name: '经营场所、设备布局、加工流程、卫生设施等平面示意图及说明和经营设备或者设施清单（布局示意图上应标明长、宽，并注明面积）', imgs: [] },
          // { name: '从业人员健康管理、食品安全自查、进货查验、食品安全事故处置等保证食品安全的规章制度', imgs: [] }
          { name: '关键环节食品加工操作规程', imgs: [] })
      }
    })
    business.projectForm.forEach((item, index) => {
      if (item.isSel && item.name === '散装食品销售') {
        item.childs.forEach((child, childIndex) => {
          if (child.isSel && child.name === '含散装熟食') {
            materialList.push({ name: '与挂钩生产单位的合作协议（合同），生产单位的《食品生产许可证》', imgs: [] })
          }
        })
      } else if (item.isSel && item.name === '自制饮品制售') {
        item.childs.forEach((child, childIndex) => {
          if (child.isSel && child.name === '含自制生鲜乳饮品') {
            materialList.push({ name: '加工消毒等关键环节操作规程、加工设备、包装材料（容器）的生产合格证明、成品安全性检验合格报告和奶源供货合同及供货商资质等文件', imgs: [] })
          }
        })
      }
    })
    // 去重
    const hash = {}
    this.form.materialList = materialList.reduce((arr, item) => {
      hash[item.name] ? '' : hash[item.name] = true && arr.push(item)
      return arr
    }, [])
  },
  methods: {
    filterMaterial(arr) {
      return Array.from(new Set(arr))
    },
    // 保存草稿
    handleSaveDraft(showTips = false) {
      return new Promise((resolve, reject) => {
        const data = {
          ...this.draftInfo, // 原有数据
          uploadMaterial: this.form, // 现在数据覆盖原有数据
          showTips // 是否显示提示
        }
        this.$store.dispatch('draft/saveDraft', data).then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 更新扫码上传数据
    updateFileList(val) {
      console.log('扫码上传回调：', val)
      const materialList = JSON.parse(JSON.stringify(this.form.materialList))
      materialList.forEach((item, index) => {
        if (+val.type === index) {
          item.imgs = item.imgs.concat(val.data)
        }
      })

      // const arr = [
      //   ...this.form[val.type],
      //   ...val.data
      // ]
      console.log(materialList)

      this.$set(this.form, 'materialList', materialList)
    },
    // 删除图片
    handleDel(tableIndex, index) {
      this.form.materialList[tableIndex].imgs.splice(index, 1)
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
    // 下一步
    async handleNext() {
      const materialList = JSON.parse(JSON.stringify(this.form.materialList))
      for (let i = 0; i < materialList.length; i++) {
        if (materialList[i].imgs.length === 0) {
          return this.$utils.showError('请完善上传材料信息！')
        }
      }
      await this.handleSaveDraft()
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
      .btn-box {
          margin-bottom: 20px;
          padding-right: 20px;
          float: right;
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
