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
      <el-form ref="form" label-position="left" class="form" :model="form" label-width="84px">
        <el-row>
          <el-col :span="24">
            <el-table ref="singleTable" :data="form.equipmentList" highlight-current-row style="width: 100%">
              <el-table-column type="index" label="序号" width="80" align="center" />
              <el-table-column property="idcName" label="设备名称" width="300" align="center">
                <template slot-scope="{ row }">
                  <el-input v-model="row.name" placeholder="请输入" />
                </template>
              </el-table-column>
              <el-table-column label="数量" width="200" align="center">
                <template slot-scope="{ row }">
                  <el-input v-model="row.count" type="number" placeholder="请输入" />
                </template>
              </el-table-column>
              <el-table-column label="位置" align="center">
                <template slot-scope="{ row }">
                  <el-input v-model="row.position" placeholder="请输入" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <div class="btn-box"><el-button class="plain" @click="handleAdd">添加设备设施</el-button></div>
        </el-row>
        <el-form-item class="btn-group text-center" label-width="0">
          <el-button @click="handleSaveDraft(true)">暂存草稿</el-button>
          <el-button @click="$router.go(-1)">上一步</el-button>
          <el-button type="primary" @click="handleNext">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/index'
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      form: {
        equipmentList: [{ name: '', count: '', position: '' }]
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
        if (res.equipment) {
          this.form = res.equipment
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
          equipment: this.form, // 现在数据覆盖原有数据
          showTips // 是否显示提示
        }
        this.$store.dispatch('draft/saveDraft', data).then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 添加设备
    handleAdd() {
      this.form.equipmentList.push({ name: '', count: '', position: '' })
    },
    // 删除
    handleDelete(index) {
      this.form.equipmentList.splice(index, 1)
    },
    async handleNext() {
      if (this.form.equipmentList.length === 0) return this.$utils.showError(`至少要添加一条信息,请先添加后再进行下一步操作`)
      const equipmentList = JSON.parse(JSON.stringify(this.form.equipmentList))
      for (let i = 0; i < equipmentList.length; i++) {
        if (!equipmentList[i].name || !equipmentList[i].count || !equipmentList[i].position) {
          return this.$utils.showError('请确认是否完善设备信息！')
        }
      }
      await this.handleSaveDraft()
      this.$router.push({ path: '/form/uploadMaterial', query: { ...this.$route.query }})
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
          margin-top: 20px;
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
