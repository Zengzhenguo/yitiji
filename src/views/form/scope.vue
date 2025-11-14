<template>
  <div v-loading="loading" class="scope-form">
    <!-- <page-header /> -->
    <breadcrumb v-show="$route.query.mode !== 'test'" />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <div class="tips">
        <img src="../../assets/images/after.png" />
        <span>如经营范围涉及前置审批事项，请到窗口办理</span>
      </div>
      <div class="search-box">
        <div class="name">添加方式</div>
        <el-button
          :type="active === 0 ? 'primary' : ''"
          :class="active === 0 ? '' : 'plain'"
          @click="active = 0; init('First')"
        >
          选择添加
        </el-button>
        <!-- <el-button
          :type="active === 1 ? 'primary' : ''"
          :class="active === 1 ? '' : 'plain'"
          @click="active = 1"
        >
          大数据推荐
        </el-button> -->
        <!-- <el-button
          :type="active === 2 ? 'primary' : ''"
          :class="active === 2 ? '' : 'plain'"
          @click="active = 2"
        >
          批量添加
        </el-button> -->
        <!-- <el-button>智能添加</el-button> -->
        <el-input
          v-model="search"
          class="search-input"
          placeholder="快速查找"
        />
        <el-button
          :type="active === 3 ? 'primary' : ''"
          :class="active === 3 ? '' : 'plain'"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button class="plain" @click="handleReset">重置</el-button>
      </div>
      <div v-show="active === 0" class="select-box">
        <div class="scope-box">
          <div class="name">请选择门类</div>
          <div class="scope-list">
            <div
              v-for="(item, index) in FirstCate"
              :key="item.id"
              class="scope"
              :class="item.active ? 'active' : ''"
              @click="init('Second', index)"
            >
              <!-- {{ item.BusinessName }} -->
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="scope-box">
          <div class="name">请选择大类</div>
          <div class="scope-list">
            <div
              v-for="(item, index) in SecondCate"
              :key="item.pd"
              class="scope"
              :class="item.active ? 'active' : ''"
              @click="init('Third', index)"
            >
              <!-- {{ item.BusinessName }} -->
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="scope-box">
          <div class="name">请选择经营范围</div>
          <div class="scope-list">
            <div
              v-for="(item, index) in ThirdCate"
              :key="item.pd"
              class="scope"
              :class="item.active ? 'active' : ''"
              @click="handleSelect(index)"
            >
              <!-- {{ item.BusinessName }} -->
              {{ item.label }}
            </div>
          </div>
        </div>
        <!-- <div class="scope-box">
          <div class="name">请选择经营范围</div>
          <div class="scope-list">
            <div
              v-for="(item,index) in FourthCate"
              :key="index"
              class="scope"
              :class="item.active ? 'active' : ''"
              @click="handleSelect(index)"
            >
              {{ item.BusinessName }}
            </div>
          </div>
        </div> -->
      </div>
      <div v-show="active === 2" class="selected-scope">
        <div class="selected-title">
          <div class="scope-tips" style="margin-left: 0;">
            <img src="../../assets/images/after.png" />
            <span>点击手动录入，支持复制黏贴，不同经营范围请用分号隔开</span>
          </div>
        </div>
        <div
          class="selected-content search-result"
          style="padding-bottom: 10px;"
        >
          <el-input
            v-model="smartScopes"
            rows="6"
            resize="none"
            class="textarea"
            placeholder="请输入需要匹配的经营范围"
            type="textarea"
          />
          <div class="smart-btn text-center">
            <el-button class="plain" @click="handleSmartSearch">
              智能匹配
            </el-button>
          </div>
        </div>
        <div v-if="errorArr" class="selected-title">
          <div class="scope-tips" style="margin-left: 0;">
            <img src="../../assets/images/before.png" />
            <span>以下经营范围无法匹配，请手动添加</span>
          </div>
        </div>
        <div
          v-if="errorArr"
          class="selected-content search-result"
          style="color: red;line-height: 1.5;"
        >
          {{ errorArr }}
        </div>
      </div>
      <div v-show="active === 3" class="selected-scope">
        <div class="selected-title">
          <div>搜索结果</div>
          <div class="scope-tips">
            <img src="../../assets/images/after.png" />
            <span>点击添加经营范围</span>
          </div>
        </div>
        <div class="selected-content search-result">
          <div
            v-for="(item, index) in searchList"
            :key="index"
            class="scope"
            @click="handleAddSearchResult(index)"
          >
            <!-- <span :class="item.active ? 'active' : ''">{{ item.BusinessName }}</span> -->
            <span :class="item.active ? 'active' : ''">{{ item.label }}</span>
            <template
              v-if="index < searchList.length - 1"
            >,</template>
          </div>
        </div>
      </div>
      <div class="selected-scope">
        <div class="selected-title">
          <div>已选一般经营范围</div>
        </div>
        <div class="selected-content">
          <div v-for="(item, index) in normalList" :key="index" class="scope">
            <!-- <span>{{ item.BusinessName }}</span> -->
            <span>{{ item.label }}</span>
            <div class="img">
              <img
                src="../../assets/images/del_scope_btn.png"
                @click="handleDelScope('normalList', index)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="selected-scope">
        <div class="selected-title">
          <div>已选后置经营范围</div>
          <div class="scope-tips">
            <img class="before" src="../../assets/images/after.png" />
            <span>涉及许可经营项目，应取得相关部门许可后方可经营</span>
          </div>
        </div>
        <div class="selected-content">
          <div v-for="(item, index) in afterList" :key="index" class="scope">
            <!-- <span>{{ item.BusinessName }}</span> -->
            <span>{{ item.label }}</span>
            <div class="img">
              <img
                src="../../assets/images/del_scope_btn.png"
                @click="handleDelScope('afterList', index)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="selected-scope">
        <div class="selected-title">
          <div>已选前置经营范围</div>
          <div class="scope-tips">
            <img class="before" src="../../assets/images/before.png" />
            <span>继续办理系统将自动移除前置经营项目，如需添加请到窗口办理</span>
          </div>
        </div>
        <div class="selected-content">
          <div v-for="(item, index) in beforeList" :key="index" class="scope">
            <!-- <span class="before">{{ item.BusinessName }}</span> -->
            <span class="before">{{ item.label }}</span>
          </div>
        </div>
      </div>
      <div class="btn-group">
        <el-button @click="$router.go(0)">刷新当前页面</el-button>
        <el-button @click="handleSaveDraft(true)">暂存草稿</el-button>
        <el-button @click="$router.go(-1)">上一步</el-button>
        <el-button type="primary" @click="handleSubmit">下一步</el-button>
      </div>
    </div>
  </div>
</template>
<script>
// import PageHeader from '@/components/PageHeader/index'
import Breadcrumb from '@/components/Breadcrumb/index'
import utilsform from '@/utils'
import { getScopeClassSJ, getthreeClassSJ, queryBusinessScopeSJ, getSmartScope, verifyScope, getDisableBusinessScope } from '@/api/index'
import baseData from '@/config/baseData.js'
// import E from 'wangeditor'
export default {
  components: {
    // PageHeader,
    Breadcrumb
  },
  data() {
    return {
      baseData,
      active: 3,
      // editor: null,
      loading: false,
      search: '',
      smartScopes: '', // 只能匹配的字符串
      errorArr: '', // 匹配失败字段，湖北库里面无此字段
      FirstValue: '',
      SecondValue: '',
      ThirdValue: '',
      FirstCate: [], // 门类数据
      SecondCate: [], // 大类数据
      ThirdCate: [], // 经营范围
      // FourthCate: [], // 小类数据
      selected: [], // 已选经营范围
      normalList: [], // 一般经营范围
      afterList: [], // 后置经营范围
      beforeList: [], // 前置经营范围
      searchList: [] // 搜索结果列表
    }
  },
  computed: {
    draftInfo() {
      return this.$store.state.draft.draftInfo
    }
  },
  mounted() {
    // this.editor = new E(this.$refs.toolbar, this.$refs.editor)
    // this.editor.config.menus = []
    // this.editor.config.pasteText = true
    // this.editor.config.placeholder = '请输入经营范围'
    // this.editor.config.focus = false
    // this.editor.create()
  },
  activated() {
    const industryFormulatedCode = this.$utils.getItem('nameApply').industryFormulated.split('-')[0].slice(0, 4)
    this.newGetthreeClassSJ('', industryFormulatedCode)
    // this.getMainScope()
  },
  created() {
    this.init('First') // 初始化数据
    // 获取草稿详情
    if (this.$utils.getItem('draftNumber')) {
      this.$store
        .dispatch('draft/getDraftDetail', this.$utils.getItem('draftNumber'))
        .then(res => {
          console.log(res.scope,'scope546545');
          if (res.scope) {
            console.log('123');
            this.selected = res.scope
            this.selected.forEach(item => {
              console.log(item.LicenseType,'item.LicenseType');
              if (item.LicenseType === 1) {
                this.afterList.push(item)
              } else if (item.LicenseType === 2) {
                this.beforeList.push(item)
              } else {
                this.normalList.push(item)
              }
            })
          }
        })
    }
  },
  methods: {
    async queryDisableBusinessScope(row) {
      const curArea = this.$utils.getLocalItem('curArea')
      if(!this.$route.query.bizName){
        this.$utils.showError('缺少变量')
      }
      const ISPERSONASSISTED = {
        '个体和合资':0,
        '个体工商户辅助开办':1,
        '内资企业辅助开办':2
      }
      const params = {
        city: curArea.district,
        area: curArea.city,
        type: '经营范围',
        businessScope: row,
        sign:ISPERSONASSISTED[this.$route.query.bizName]
      }
      let res = await getDisableBusinessScope(params) 
      if(res.success == true && res.data) {
        return res.data
      }
    },
    // 保存草稿
    handleSaveDraft(showTips = false) {
      const scopeList = []
      for (const item of this.selected) {
        if(item.scopeType!== '前置事项') {
          scopeList.push(item)
        }
      }
      console.log('保存草稿参数scopeList', scopeList)
      return new Promise((resolve, reject) => {
        if(this.draftInfo.nameApply.companyName == '') {
          this.draftInfo.nameApply.companyName = utilsform.getItem('companyName')
        }
        const data = {
          ...this.draftInfo, // 原有数据
          scope: scopeList, // 现在数据覆盖原有数据
          businessType: this.$route.query.type === 'person' ? '1' : '2',
          showTips // 是否显示提示
        }
        console.log(data, '保存草稿参数data')
        this.$store
          .dispatch('draft/saveDraft', data)
          .then(res => {
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    // 返回点击对象的key
    formatClickObj(key) {
      switch (key) {
        case 'Second':
          return 'First'
        case 'Third':
          return 'Second'
        case 'Fourth':
          return 'Third'
        default:
          break
      }
    },
    /*
     *@Description: 获取经营范围
     *@params: name：获取的是第几级数据
     *@params: key：点击的是第几个元素
     *@MethodAuthor:  Liangguojiang
     *@Date: 2020-11-04 17:54:02
     */
    init(name, key) {
      const keyName = this.formatClickObj(name)
      // 本身就处于高亮状态，不调用接口
      if (key >= 0 && this[`${keyName}Cate`][key].active) return
      // PC端手动赋值
      if (key >= 0) {
        console.log(this[`${keyName}Cate`][key].value)
        // this[`${keyName}Value`] = this[`${keyName}Cate`][key].BusinessCode
        this[`${keyName}Value`] = this[`${keyName}Cate`][key].value
        this[`${keyName}Cate`].forEach((item, index) => {
          if (index === key) {
            item.active = true
          } else {
            item.active = false
          }
        })
      }
      // let type = '2'
      // if (
      //   this.$utils.getItem('nameApply').bizName === '内资企业辅助开办' ||
      //   this.$utils.getItem('nameApply').bizName === '商事确认一链通'
      // ) { type = '1' }
      // const data = {
      //   company_type: type, //  1 企业  2 个体工商户
      //   city: this.$utils.getLocalItem('curArea').district
      // }
      // if (key >= 0) {
      //   data[`${keyName}CategoryCode`] = this[`${keyName}Cate`][
      //     key
      //   ].BusinessCode
      // }
      // this.loading = true
      // getScope(data).then(res => {
      //   this.loading = false
      //   if (+res.errCode === 1 && res.outData && res.outData.code === 0) {
      //     this[`${name}Cate`] = res.outData.data.map(item => {
      //       return {
      //         ...item,
      //         active:
      //           name === 'ThirdCate'
      //             ? this.selected
      //               .map(item => item.BusinessName)
      //               .includes(item.BusinessName)
      //             : false // 过滤出对应的code，然后判断对应的选项中是否有高亮选中的值false
      //       }
      //     })
      //   }
      //   if (name === 'First') {
      //     // 拿第一级
      //     this.SecondCate = []
      //     this.SecondValue = ''
      //     this.ThirdCate = []
      //     this.ThirdValue = ''
      //   }
      //   if (name === 'Second') {
      //     // 拿第二级数据,清空对应数据
      //     this.SecondValue = ''
      //     this.ThirdCate = []
      //     this.ThirdValue = ''
      //   }
      //   if (name === 'Third') {
      //     // 拿第三级数据
      //     this.ThirdValue = ''
      //   }
      // })
      if (name === 'First') {
        // 拿第一级
        this.loading = true
        getScopeClassSJ().then(res => {
          this.FirstCate = res.data
          // 拿第一级
          this.SecondCate = []
          this.SecondValue = ''
          this.ThirdCate = []
          this.ThirdValue = ''
        }).finally(() => {
          this.loading = false
        })
      }
      if (name === 'Second') {
        // 拿第二级数据,清空对应数据
        // this.loading = true
        this.SecondCate = this.FirstCate[key].dictionaryList
        this.SecondValue = ''
          this.ThirdCate = []
          this.ThirdValue = ''
        // getScopeCategoSJ(this[`${keyName}Cate`][key].value).then(res => {
        //   this.SecondCate = res.data.filter(item => item.pd === this[`${keyName}Cate`][key].value)[0].children
        //   this.SecondValue = ''
        //   this.ThirdCate = []
        //   this.ThirdValue = ''
        // }).finally(() => {
        //   this.loading = false
        // })
      }
      if (name === 'Third') {
        // 拿第三级数据
        this.ThirdValue = ''
        let params = {
          heading: this.SecondCate[key].value,
          pageNum: 1,
          pageSize: 300
        }
        getthreeClassSJ(params).then(res => {
          if (res.success == true) {
            let list = res.data.records
            list.forEach(item => {
              item.label = item.opScopeItem
            })
            this.ThirdCate = list
          }
        })
      }
    },
    // 添加选中类别
    handleAddCate() {
      // 先合并数组再去重
      const selectedCate = this.ThirdCate.filter(item => item.active)
      this.selected = this.selected.concat(selectedCate)
      console.log(selectedCate,'selectedCate');
      this.filterSelected()
    },
    // 通用去重方法
    filterSelected() {
      // 清空状态列表
      this.beforeList = []
      this.normalList = []
      this.afterList = []
      // 数组去重
      const hash = {}
      this.selected = this.selected.reduce((arr, item) => {
        // 对应的code如果不存在且是高亮状态的，对象中加入key标识，然后push
        if (!hash[item.label] && item.active) {
          hash[item.label] = true
          arr.push(item)
          // if (item.LicenseType === 1) {
          //   this.afterList.push(item)
          // } else if (item.LicenseType === 2) {
          //   this.beforeList.push(item)
          // } else {
          //   this.normalList.push(item)
          // }
          if (item.scopeType === '后置事项') {
            this.afterList.push(item)
          } else if (item.scopeType === '前置事项') {
            this.beforeList.push(item)
          } else {
            this.normalList.push(item)
          }
        }
        // 返回arr继续遍历
        return arr
      }, [])
      console.log(this.selected)
    },
    // 重置类别
    handleReset() {
      this.search = ''
      this.FirstValue = ''
      this.SecondValue = ''
      this.ThirdValue = ''
      this.SecondCate = [] // 大类数据
      this.ThirdCate = [] // 经营范围
      this.selected = [] // 已选经营范围
      this.normalList = [] // 一般经营范围
      this.afterList = [] // 后置经营范围
      this.beforeList = [] // 前置经营范围
      this.searchList = []
      location.reload()
    },
    handleSelect(index) {
      this.ThirdCate[index].active = !this.ThirdCate[index].active
      // 和移动端逻辑不一样，过滤前先清除active为false的项
      if (!this.ThirdCate[index].active) {
        this.selected.forEach((item, key) => {
          if (item.BusinessName === this.ThirdCate[index].label) {
            this.selected.splice(key, 1)
          }
        })
      }

      this.handleAddCate()
    },
    // 删除经营范围
    handleDelScope(type, index) {
      // 删除对应的项
      const obj = this[type][index]
      this[type].splice(index, 1)
      // 清除对应高亮
      this.ThirdCate.forEach(item => {
        if (item.BusinessName === obj.BusinessName) {
          item.active = false
        }
      })
      this.searchList.forEach(item => {
        if (item.BusinessName === obj.BusinessName) {
          item.active = false
        }
      })
      // 去除选择,防止删除完以后马上提交
      this.selected.forEach((item, key) => {
        if (item.BusinessName === obj.BusinessName) {
          this.selected.splice(key, 1)
        }
      })
    },
    // 提交后保存数据
    async handleSubmit() {
      if (this.selected.length) {
        let bool = false
        this.selected.forEach(item => {
          if (item.LicenseType !== 2) {
            bool = true
          }
        })
        if (!bool) {
          return this.$utils.showError('请先选择经营范围')
        }
        var newArr = this.selected.filter(item => {
          if (item.LicenseType !== 2) {
            return true
          }
        })

        this.selected = newArr
        const scopeList = []
        for (const item of this.selected) {
          if(item.scopeType!== '前置事项') {
            scopeList.push(item.label)
          }
        }
        const scopeListLength = String(scopeList)
        console.log('scopeListLength', scopeListLength, scopeListLength.length)
        if (scopeListLength.length > 300) {
          return this.$utils.showError('当前经营范围过长，请重新选择，建议不超过300个字符！')
        }

        let count = this.afterList.length + this.normalList.length
        if (count > 30) {
          return this.$utils.showError('当前经营范围过多，请重新选择，建议不超过30个经营范围！')
        }
        // 06-21 新增禁用关键字
        let disabledKeyData = await this.queryDisableBusinessScope(scopeListLength)
        if (disabledKeyData && disabledKeyData !== '') {
          return this.$utils.showError(`经营范围中含有禁止使用的关键字: ${disabledKeyData}`)
        }
        // this.queryDisableBusinessScope(scopeListLength)
        // const disabledKeyData = this.baseData.isHasDisabledKey(scopeListLength)
        // if (disabledKeyData.flag) {
        //   return this.$utils.showError(`经营范围中含有禁止使用的关键字: ${disabledKeyData.key}`)
        // }
        if (this.beforeList.length > 0) {
          // this.$utils.showWarn(`当前经营范围含有前置经营项目，继续办理系统将自动移除前置经营项目，如需添加请到窗口办理`)
          await this.$alert('当前经营范围含有前置经营项目，继续办理系统将自动移除前置经营项目，如需添加请到窗口办理', '温馨提示', {
            distinguishCancelAndClose: true,
            confirmButtonText: '我已知晓'
          })
        }
        const industryCategoryCode = this.$utils.getItem('nameApply').industryFormulated.split('-')[0]
        verifyScope({ scope: scopeList,
          IndustryCategoryCode: industryCategoryCode }).then(async res => {
          console.log(res.outData)

          if (res.outData.isTrue) {
            await this.handleSaveDraft(true)
            this.$utils.setItem('scope', this.selected)
            this.$router.push({
              path: '/form/address',
              query: { ...this.$route.query }
            })
          } else {
            this.$utils.showError(res.outData.msg)
          }
          
        })
        return
      } else {
        this.$utils.showError('请先选择经营范围')
      }
    },
    // 智能匹配
    handleSmartSearch() {
      if (this.smartScopes) {
        const value = this.smartScopes.replace(/；/g, ';')
        const arr = value.split(';')
        getSmartScope(value).then(res => {
          if (res.outData && res.outData.code === 0) {
            // 重构后端数据
            const after = res.outData.data.AfterLicense.map(item => {
              return { BusinessName: item, LicenseType: 1, active: true }
            })
            const before = res.outData.data.BeforeLicense.map(item => {
              return { BusinessName: item, LicenseType: 2, active: true }
            })
            const normal = res.outData.data.NoneLicense.map(item => {
              return { BusinessName: item, LicenseType: 0, active: true }
            })
            const result = after.concat(before).concat(normal)
            if (result.length) {
              // 插入数据并去重
              this.selected = this.selected.concat(result)
              this.filterSelected()
              // 处理查不出来的数据
              const keys = result.map(item => item.BusinessName)
              // 重置匹配数据
              this.smartScopes = keys.join(';')
              const errorArr = []
              arr.forEach((item, index) => {
                if (!keys.includes(item)) {
                  errorArr.push(item)
                }
              })
              this.errorArr = errorArr.join(';')
            } else {
              // 匹配内容都不合法
              this.errorArr = this.smartScopes
              // 没有匹配项，置空
              this.smartScopes = ''
            }
          }
        })
      }
    },
    // 通用去重方法

    // 搜索
    handleSearch() {
      if (this.search) {
        this.active = 3
        // const keys = this.selected.filter(item => item.BusinessName)
        // console.log(keys)
        // let type = '2'
        // if (
        //   this.$utils.getItem('nameApply').bizName === '内资企业辅助开办' ||
        //   this.$utils.getItem('nameApply').bizName === '商事确认一链通'
        // ) { type = '1' }
        // getScope({
        //   BusinessKeyword: this.search,
        //   company_type: type,
        //   city: this.$utils.getLocalItem('curArea').district
        // }).then(res => {
        //   if (+res.errCode === 1 && res.outData && res.outData.code === 0) {
        //     this.searchList = res.outData.data.map(item => {
        //       return {
        //         ...item,
        //         active: keys.includes(item.BusinessName)
        //       }
        //     })
        //     console.log(this.searchList)
        //   }
        // })
        


      
        // this.newGetthreeClassSJ(this.search) ///这里多了一次查询，注释掉了，如有问题可放开
        this.getMainScope(this.search)
      } else {
        this.$utils.showError('请输入关键字！')
      }
    },
    // 添加
    handleAddSearchResult(index) {
      this.searchList[index].active = !this.searchList[index].active
      if (!this.searchList[index].active) {
        this.selected.forEach((item, key) => {
          if (item.label === this.searchList[index].label) {
            this.selected.splice(key, 1)
          }
        })
      }
      // 先合并数组再去重
      const selectedCate = this.searchList.filter(item => item.active)
      this.selected = this.selected.concat(selectedCate)
      this.filterSelected()
    },
      //最新省局获取经营范围
    newGetthreeClassSJ(value, head) {
      let params = {
        // heading: head || '',
        keyWord: head,
        pageNum: 1,
        pageSize: 300,
        'industryphy': ''
      }
      // getthreeClassSJ(params).then(res => {
      //   if (res.success == true) {
      //     this.searchList = res.data.records.map(item => {
      //       return {
      //         ...item,
      //         label: item.opScopeItem,
      //         active: item.label ? keys.includes(item.label) : ''
      //       }
      //     })
      //   }
      // })


      queryBusinessScopeSJ(params).then(res => {
        if (+res.flag === 200) {
          this.searchList = res.data.records.map(item => {
            return {
              ...item,
              label: item.opScopeItem,
              active:item.label ? keys.includes(item.label):''
            }
          })
        }else if(+res.flag === 500 && res.message ==="查询经营范围失败"){
          let keyword = this.$utils.getItem('nameApply').industryFormulated.split('-')[0].slice(0, 2)
          const newParams = {
            'keyWord': keyword || industryFormulatedCode,
            'pageSize': 300,
            'pageNum': 1,
            'industryphy': '' // industryFormulatedCategory
          }
          queryBusinessScopeSJ(newParams).then(res=>{
            if (+res.flag === 200) {
          this.searchList = res.data.records.map(item => {
            return {
              ...item,
              label: item.opScopeItem,
              active:item.label ? keys.includes(item.label):''
            }
          })
        }
        })
      }
        console.log(this.searchList);
      })
    },  
    // 获取主营范围
    getMainScope(keyWord) {
      this.$api.showLoading()
      // const industryCategoryCode = this.$utils.getItem('nameApply').industryFormulated.split('-')[0]
      // const industryFormulatedCategory = this.$utils.getItem('nameApply').industryFormulatedCategory
      const industryFormulatedCode = this.$utils.getItem('nameApply').industryFormulated.split('-')[0].slice(0, 2)
      // console.log(industryCategoryCode)
      const keys = this.selected.filter(item => item.lebel)
      // console.log(keys)
      // let type = '2'
      // if (
      //   this.$utils.getItem('nameApply').bizName === '内资企业辅助开办' ||
      //     this.$utils.getItem('nameApply').bizName === '商事确认一链通'
      // ) { type = '1' }
      // getScope({ IndustryCategoryCode: industryCategoryCode, company_type: type,
      //   city: this.$utils.getLocalItem('curArea').district }).then(res => {
      //   if (+res.errCode === 1 && res.outData && res.outData.code === 0) {
      //     this.searchList = res.outData.data.map(item => {
      //       return {
      //         ...item,
      //         active: keys.includes(item.BusinessName)
      //       }
      //     })
      //     console.log(this.searchList)
      //   }
      // })
      const data = {
        'keyWord': keyWord || industryFormulatedCode,
        'pageSize': 100,
        'pageNum': 1,
        'industryphy': '' // industryFormulatedCategory
      }
      queryBusinessScopeSJ(data).then(res => {
        if (+res.flag === 200) {
          this.searchList = res.data.records.map(item => {
            return {
              ...item,
              label: item.opScopeItem,
              active: keys.includes(item.label)
            }
          })
        }
        console.log(this.searchList);
      }).finally(() => {
        this.$api.hideLoading()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-textarea__inner {
  border: none;
  padding: 0;
  font-size: 16px;
}
::v-deep .w-e-toolbar {
  display: none;
}
::v-deep .w-e-text-container {
  border: none !important;
  height: 230px !important;
  margin-bottom: 10px;
}
.scope-form {
  .plain {
    border: 1px solid #3162e8;
    color: #3162e8;
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
      color: #7f7e7e;
      padding-top: 15px;
      img {
        width: 22px;
        height: 22px;
        margin-right: 5px;
      }
    }
    .search-box {
      display: flex;
      align-items: center;
      padding-top: 30px;
      .name {
        flex: 0 0 84px;
        font-size: 16px;
        font-weight: 600;
        color: #606266;
      }
      .el-button {
        flex: 0 0 120px;
        width: 120px;
        height: 45px;
      }
      .search-input {
        height: 45px;
        font-size: 16px;
        ::v-deep .el-input__inner {
          height: 45px;
        }
        margin-left: 20px;
        margin-right: 20px;
      }
    }
    .select-box {
      height: 350px;
      display: flex;
      margin-top: 35px;
      border: 1px solid #eaeaea;
      box-sizing: border-box;
      border-radius: 4px;
      .scope-box {
        flex: 0 0 33.3%;
        .name {
          height: 57px;
          line-height: 57px;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          padding-left: 24px;
        }
        .scope-list {
          width: 100%;
          height: 292px;
          border-right: 1px solid #eaeaea;
          border-top: 1px solid #eaeaea;
          box-sizing: border-box;
          overflow-y: auto;
          .scope {
            line-height: 32px;
            padding-left: 24px;
            cursor: pointer;
            &.active {
              background: rgba(0, 0, 0, 0.06);
            }
          }
        }
        &:last-child {
          flex: 1;
          .scope-list {
            border-right: 0;
          }
        }
      }
    }
    .selected-scope {
      .selected-title {
        font-size: 16px;
        font-weight: bold;
        color: #606266;
        padding-top: 35px;
        display: flex;
        .scope-tips {
          margin-left: 25px;
          display: flex;
          align-items: center;
          img {
            width: 22px;
            height: 22px;
            margin-right: 5px;
            &.before {
              width: 22px;
              height: 22px;
            }
          }
          span {
            font-size: 14px;
            color: #7f7e7e;
            font-weight: 400;
          }
        }
      }
      .selected-content {
        width: 100%;
        height: 220px;
        padding: 10px 20px 20px 20px;
        margin-top: 15px;
        box-sizing: border-box;
        border-radius: 8px;
        border: 2px solid #e8e8e8;
        overflow-y: auto;
        .scope {
          display: inline-block;
          margin-right: 33px;
          margin-top: 10px;
          &:last-child {
            margin-right: 0;
          }
          span {
            font-size: 16px;
            font-weight: 500;
            color: #464646;
            line-height: 20px;
            &.before {
              color: #e56767;
            }
          }
          .img {
            width: 16px;
            height: 20px;
            vertical-align: middle;
            display: inline-block;
            margin-left: 6px;
            img {
              width: 16px;
              height: 16px;
              cursor: pointer;
            }
          }
        }
        &.search-result {
          .smart-btn {
            .scope-tips {
              display: flex;
              align-items: center;
              justify-content: center;
              padding-top: 10px;
              .before {
                width: 22px;
                height: 22px;
                margin-right: 5px;
              }
              span {
                font-size: 14px;
                color: #7f7e7e;
                font-weight: 400;
              }
            }
          }
          .scope {
            margin-right: 5px;
            cursor: pointer;
            color: #7f7e7e;
            span {
              color: #7f7e7e;
              &.active {
                color: #464646;
              }
            }
          }
        }
      }
    }
    .btn-group {
      padding-top: 60px;
      padding-bottom: 60px;
      text-align: center;
      .el-button {
        width: 155px;
        height: 48px;
        padding: 0;
        box-sizing: border-box;
        text-align: center;
        line-height: 48px;
        border: 1px solid #3162e8;
        color: #3162e8;
        &:last-child {
          color: #fff;
        }
      }
    }
  }
}
</style>
