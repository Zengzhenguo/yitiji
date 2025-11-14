<template>
  <div class="base-form">
    <!-- <page-header /> -->
    <breadcrumb />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <el-form ref="form" label-position="left" class="form" :model="form" :rules="rules" label-width="94px">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item class="radio" label="经济性质" label-width="100px" required>
              <el-radio v-model="companyType" :label="companyType" border>{{ companyType }}</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item class="radio" label="主体业态" label-width="100px" required>
              <el-radio v-model="form.formats" :label="form.formats" border>{{ form.formats }}</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="btn-group text-center" label-width="0">
          <!-- <el-button type="primary" @click="onSubmit">暂存草稿</el-button> -->
          <el-button @click="$router.go(-1)">上一步</el-button>
          <el-button type="primary" @click="handleNext">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/index'
import { filterFormats } from '@/filters'
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      companyType: '', // 企业类型
      type: '', // 业务类型
      form: {
        formats: '' // 主体业态
      },
      rules: {
        capital: [
          { required: true, message: '请填写注册资本', trigger: 'change' }
        ],
        employeesCount: [
          { required: true, message: '请填写从业人数', trigger: 'change' }
        ]
      }
    }
  },
  activated() {
    if (this.$utils.getItem('nameApply')) {
      const nameApply = this.$utils.getItem('nameApply')
      this.companyType = nameApply.companyType === '个体工商户' ? '个体工商户' : '企业'
      this.type = this.$route.query.type
      this.form.formats = filterFormats(this.type)
    }
  },
  methods: {
    handleNext() {
    },
    limitInput(value) {
      const str = (value && value.split('')) || []
      const reg1 = /\d/
      const reg2 = /\./
      // 第一个字符不能为小数点
      if (str[0] === '.') {
        this.form[name] = ''
        return
      }
      // 过滤掉除数字和小数点外的字符
      value = str.filter(e => reg1.test(e) || reg2.test(e))
      // 匹配小数点后只能有两位小数
      const valJoin = value.join('')
      this.form.capital = valJoin.match(/^\d*(\.?\d{0,3})/g)[0] || null
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
    width: 800px;
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
</style>
