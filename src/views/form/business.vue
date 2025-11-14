<template>
  <div class="base-form">
    <!-- <page-header /> -->
    <breadcrumb />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <el-form ref="form" label-position="left" class="form" :model="form" label-width="160px">
        <div class="business-box">
          <div class="box-title">经济性质</div>
          <div class="box-content">
            <el-button class="btn-jjxz" :type="form.economicNature === 0 ? 'primary' : ''" @click="form.economicNature = 0">企业</el-button>
            <el-button class="btn-jjxz" :type="form.economicNature === 1 ? 'primary' : ''" @click="form.economicNature = 1">个体工商户有字号</el-button>
            <el-button class="btn-jjxz" :type="form.economicNature === 2 ? 'primary' : ''" @click="form.economicNature = 2">个体工商户无字号</el-button>
          </div>
        </div>
        <div class="business-box ncenter">
          <div class="box-title pt">主体业态</div>
          <div class="box-main">
            <div v-for="(item, index) in form.mainForm" :key="index" class="box-content">
              <el-button class="btn-ztyt" :type="item.isSel ? 'primary' : ''">{{ item.name }}</el-button>
              <span class="parentheses">(</span>
              <el-button v-for="(child,childIndex) in item.childs" :key="childIndex" class="btn-ztytChild" :type="child.isSel ? 'primary' : ''" @click="handleMainChild(item.name,child.name)">{{ child.name }}</el-button>
              <span class="parentheses">)</span>
            </div>
          </div>
        </div>
        <div class="business-box ncenter">
          <div class="box-title pt">经营项目</div>
          <div class="box-main">
            <div v-for="(item, index) in form.projectForm" :key="index" class="box-content">
              <el-button class="btn-ztyt" :type="item.isSel ? 'primary' : ''" @click="handleProject(item.name)">{{ item.name }}</el-button>
              <template v-if="item.isSel">
                <span v-if="item.childs.length !== 0" class="parentheses">(</span>
                <el-button v-for="(child,childIndex) in item.childs" :key="childIndex" class="btn-ztytChild" :type="child.isSel ? 'primary' : ''" @click="handleProjectChild(item.name,child.name,childIndex)">{{ child.name }}</el-button>
                <span v-if="item.childs.length !== 0" class="parentheses">)</span>
              </template>
            </div>
          </div>
        </div>
        <el-form-item class="btn-group text-center" label-width="0">
          <el-button @click="handleSaveDraft(true)">暂存草稿</el-button>
          <el-button @click="$router.go(-1)">上一步</el-button>
          <el-button type="primary" @click="submitForm">下一步</el-button>
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
      bizName: '',
      companyType: '',
      form: {
        economicNature: 0, // 经济类型0企业，1个体工商户有字，2个体工商户无字
        mainForm: this.$route.query.type === 'supermarket' ? [
          { name: '食品销售经营者', isSel: true, childs: [{ name: '批发', isSel: false }, { name: '批零兼营', isSel: false }, { name: '含网络经营', isSel: false }, { name: '网络经营', isSel: false }, { name: '含自动售货', isSel: false }, { name: '自动售货', isSel: false }] }
        ] : (this.$route.query.type === 'canteen' ? [
          { name: '单位食堂', isSel: true, childs: [{ name: '学校食堂', isSel: false }, { name: '托幼机构食堂', isSel: false }, { name: '养老机构食堂', isSel: false }, { name: '工地食堂', isSel: false }, { name: '含中央厨房', isSel: false }, { name: '含集体用餐配送', isSel: false }] }
        ] : [
          { name: '餐饮服务经营者', isSel: true, childs: [{ name: '小型', isSel: false }, { name: '中型', isSel: false }, { name: '大型', isSel: false }, { name: '特大型', isSel: false }, { name: '含网络经营', isSel: false }, { name: '集体用餐配送', isSel: false }, { name: '中央厨房', isSel: false }] }
        ]),
        projectForm: [
          { name: '预包装食品销售', isSel: false, childs: [{ name: '含冷藏冷冻食品', isSel: true }, { name: '不含冷藏冷冻食品', isSel: false }] },
          { name: '散装食品销售', isSel: false, childs: [{ name: '含冷藏冷冻食品', isSel: true }, { name: '不含冷藏冷冻食品', isSel: false }, { name: '含散装熟食', isSel: true }, { name: '不含散装熟食', isSel: false }] },
          { name: '特殊食品销售', isSel: false, childs: [{ name: '保健食品', isSel: false }, { name: '特殊医学用途配方食品', isSel: false }, { name: '婴幼儿配方乳粉', isSel: false }, { name: '其他婴幼儿配方食品', isSel: false }] },
          { name: '热食类食品制售', isSel: false, childs: [] },
          { name: '冷食类食品制售', isSel: false, childs: [] },
          { name: '生食类食品制售', isSel: false, childs: [] },
          { name: '半成品类食品制售', isSel: false, childs: [] },
          { name: '糕点类食品制售', isSel: false, childs: [{ name: '含裱花类糕点', isSel: false }, { name: '不含裱花类糕点', isSel: true }] },
          { name: '自制饮品制售', isSel: false, childs: [{ name: '含自制生鲜乳饮品', isSel: false }, { name: '不含自制生鲜乳饮品', isSel: true }] },
          { name: '其他类食品制售', isSel: false, childs: [] },
          { name: '其他类食品销售', isSel: false, childs: [] }
        ]
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
        if (res.business) {
          this.form = res.business
        }
      })
    }
    this.bizName = this.$route.query.bizName
  },
  methods: {
    // 保存草稿
    handleSaveDraft(showTips = false) {
      return new Promise((resolve, reject) => {
        const data = {
          ...this.draftInfo, // 原有数据
          businessType: this.form.economicNature === 0 ? '2' : '1',
          business: this.form, // 现在数据覆盖原有数据
          showTips // 是否显示提示
        }
        if (!this.$utils.getItem('draftNumber')) { // 新建需要添加
          data.nameApply = {
            bizName: this.bizName,
            companyName: ''
          }
        }
        console.log(data)
        this.$store.dispatch('draft/saveDraft', data).then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 主体业态-子类
    handleMainChild(parentName, childName) {
      const mainForm = JSON.parse(JSON.stringify(this.form.mainForm))
      mainForm.forEach((item, index) => {
        if (item.name === parentName) {
          item.childs.forEach((child, childIndex) => {
            if (child.name === childName) {
              child.isSel = !child.isSel
              const nameArr = ['小型', '中型', '大型', '特大型']
              if (nameArr.includes(childName)) {
                mainForm[index].childs.forEach((item1, index1) => {
                  if (item1.name !== childName && nameArr.includes(item1.name)) item1.isSel = false
                })
              }
            }
          })
        }
      })
      this.form.mainForm = mainForm
    },
    // 点击选择项目
    handleProject(parentName) {
      const projectForm = JSON.parse(JSON.stringify(this.form.projectForm))
      projectForm.forEach((item, index) => {
        if (item.name === parentName) {
          item.isSel = !item.isSel
        }
      })
      this.form.projectForm = projectForm
    },
    // 点击选择项目对应的子类
    handleProjectChild(parentName, childName, childIndex) {
      const projectForm = JSON.parse(JSON.stringify(this.form.projectForm))
      let nameArr
      switch (parentName) {
        case '预包装食品销售':
        case '散装食品销售':
          if (childName === '含散装熟食' || childName === '不含散装熟食') {
            nameArr = ['含散装熟食', '不含散装熟食']
          } else {
            nameArr = ['含冷藏冷冻食品', '不含冷藏冷冻食品']
          }
          break
        case '糕点类食品制售':
          nameArr = ['含裱花类糕点', '不含裱花类糕点']
          break
        case '自制饮品制售':
          nameArr = ['含自制生鲜乳饮品', '不含自制生鲜乳饮品']
          break
      }
      // console.log(nameArr)
      projectForm.forEach((item, index) => {
        if (item.name === parentName) {
          item.childs.forEach((child, childIndex) => {
            if (child.name === childName) {
              const parentNameArr = ['预包装食品销售', '散装食品销售', '糕点类食品制售', '自制饮品制售'] // 需要判断互斥
              if (parentNameArr.includes(parentName)) {
                if (nameArr.includes(childName)) {
                  if (!child.isSel) child.isSel = !child.isSel
                  projectForm[index].childs.forEach((item1, index1) => {
                    if (item1.name !== childName && nameArr.includes(item1.name)) item1.isSel = false
                  })
                }
              } else {
                child.isSel = !child.isSel
              }
            }
          })
        }
      })
      this.form.projectForm = projectForm
    },
    async submitForm () {
      let bool = true
      const projectForm = JSON.parse(JSON.stringify(this.form.projectForm))
      projectForm.forEach((item, index) => {
        if (item.isSel) {
          bool = false
        }
      })
      if (bool) return this.$utils.showError('请先选择经营项目')
      await this.handleSaveDraft()
      this.$utils.setItem('business', this.form)
      let type = 'company'
      if (this.form.economicNature === 1) type = 'person' // 个体工商户有字号办理
      if (this.form.economicNature === 2) { // 个体工商户无字号办理
        this.$router.push({ path: '/form/noNameApply', query: { ...this.$route.query, type: 'person', whatfrom: 'jointOffice' }})
      } else { // 企业
        this.$router.push({ path: '/form/nameApply', query: { ...this.$route.query, type: type, whatfrom: 'jointOffice' }})
      }
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
        .business-box {
            display: flex;
            align-items: center;
            padding: 10px 0;
            .box-title {
                flex: 0 0 80px;
            }
            .box-title.pt {
                padding-top: 15px;
            }
            .box-content {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                .btn-jjxz {
                    min-width: 103px;
                }
            }
            .box-main {
                display: flex;
                flex-direction: column;
                .box-content {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    .btn-ztyt {
                        width: 200px;
                        margin-bottom: 15px;
                    }
                    .btn-ztytChild {
                        margin-bottom: 15px;
                    }
                    .parentheses {
                        padding: 0 20px 15px;
                    }
                }
            }
        }
        .business-box.ncenter {
            align-items: unset;
        }
    }
  }
}
</style>
