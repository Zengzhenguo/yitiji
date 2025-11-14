<template>
  <div class="list_page">
    <breadcrumb v-show="$route.query.mode !== 'test'" title="个人空间" />

    <div class="main">
      <div class="left">
        <div class="user">{{ userInfo.name || '用户名' }}</div>
        <el-button class="btn" :type="currentStatus === 2 ?'primary': 'default' " @click="handleChangeTab(2)">我的办件</el-button>
        <el-button class="btn" :type="currentStatus === 1 ?'primary': 'default' " style="margin-left:0; margin-top:15px;" @click="handleChangeTab(1)">我的草稿</el-button>
      </div>
      <div class="right">
        <div class="search-box">
          <div v-if="currentStatus === 2" style="margin-left: 15px;">
            <span style="margin-right: 10px;">申请日期</span>
            <el-date-picker v-model="applyDate" style="width: 300px;" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" class="input-class" @change="handleDateChange" />
          </div>

          <!-- <div v-if="currentStatus === 2" style="margin-left: 15px;">
            <span style="margin-right: 10px;">业务状态</span>
            <el-select v-model="state" style="width:130px;height:43px;" class="input-class" placeholder="请选择" @change="handleStateChange">
              <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div> -->
          <div v-if="currentStatus === 2" style="margin-left: 15px;">
            <span style="margin-right: 10px;">业务状态</span>
            <el-select v-model="processStatus" style="width:130px;height:43px;" class="input-class" placeholder="请选择" @change="handleStateChange">
              <el-option v-for="item in processStatusList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>

          <div style="margin-left: 15px;">
            <el-input v-model="search" placeholder="请输入公司名称查找" clearable class="search_input input-class" />
            <el-button style="margin-left: 15px;height: 43px;" @click="handleSearch">搜索</el-button>
          </div>
        </div>
        <el-table :data="dataList" style="width: 100%;min-height: 400px;" class="z-table">
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column :label="`${currentStatus === 1 ? '草稿': '业务'}编号`">
            <template slot-scope="{row}">
              {{ row.bizSerialNumber || row.draftNumber }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="公司名称" />
          <el-table-column label="申请时间" width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.bizPushTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="processStatus" label="业务状态" width="140">
            <template slot-scope="{row}">
              {{ row.processStatus || row.bizStateName }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130">
            <template slot-scope="scope">
              <el-button v-if="scope.row.bizStateName !== '待签名' && currentStatus === 2 && scope.row.bizName !== '个体工商户公示信息填报' && scope.row.bizName !== '内资企业公示信息填报'" type="text" size="mini" @click="handleSign(scope.$index, scope.row)">签名</el-button>
              <el-button type="text" size="mini" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
              <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          class="z-pagination"
          background
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <el-dialog :visible.sync="dialogSign" width="500px" close-on-click-modal close-on-press-escape :show-close="true" class="sign_dialog">
      <div class="dialog_wrap">
        <img src="@/assets/images/signBoxCode.png" alt="" class="ewm" />
        <div style="font-size: 16px;">请用微信扫码签名</div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogProgress" width="700px" :close-on-click-modal="false" :close-on-press-escape="false" class="progress_dialog" title="业务进度详情">
      <!-- <div class="z_process_page">
        <ul class="z_process_header">
          <li><span>业务名称</span><span>{{ workDetail['业务名称'] }}</span></li>
          <li><span>办事主体</span><span>{{ workDetail['办事主体'] }}</span></li>
          <li><span>业务编号</span><span>{{ workDetail['业务编号'] }}</span></li>
        </ul>
        <div class="z_process_title">办理进度</div>
        <div class="z_process_body">
          <el-steps direction="vertical" active-color="#2163e0" :active="workDetail['当前状态编号']">
            <el-step v-for="item in workDetail['时间轴']" :key="item.id">

              <div slot="title" class="z_step_content">
                <div class="z_step_name">{{ item['名称'] }}</div>
                <div class="z_step_time">{{ item['时间'] }}</div>
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
        </div>
      </div> -->
      <iframe v-if="dialogProgress" :src="iframeUrl" width="700" height="620"></iframe>
    </el-dialog>
    <el-dialog
      title="查看章程PDF"
      :visible.sync="eventDialog"
      width="98%"
      top="1vh"
      destroy-on-close
      :modal="true"
      :modal-append-to-body="false"
    >
      <iframe width="100%" height="800" :src="pdfUrl" frameborder="0"></iframe>
      <!-- <embed :src="" type="application/pdf" /> -->
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/index'
import { createJobQueue, deleteDraft, editDothing } from '@/api/index'
import { filterBizName } from '@/filters'
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      pdfUrl: '',
      eventDialog: false,
      applyDate: '',
      startDate: '',
      endDate: '',
      search: '',
      iframeUrl: '',
      currentPage: 1,
      size: 10,
      total: 100,
      currentStatus: 2, // 状态 1-草稿 2-已提交
      state: '', // 业务状态
      stateList: [
        { label: '全部', value: '' },
        { label: '办理中', value: '办理中' },
        { label: '已办结', value: '已办结' }
      ],
      processStatus: '', // 业务进度
      processStatusList: [
        { label: '全部', value: '全部' },
        { label: '发起签名任务', value: '发起签名任务' },
        { label: '录入名称申报数据', value: '录入名称申报数据' },
        { label: '名称申报审批', value: '名称申报审批' },
        { label: '录入设立数据', value: '录入设立数据' },
        { label: '审核中', value: '审核中' },
        { label: '已办结', value: '已办结' }
      ],
      processList: [
        { 'processStatus': '已删除',
          'exclude': true }
      ],
      dataList: [],
      dialogSign: false,
      dialogProgress: false,
      workDetail: [],
      mockData: {
        '业务名称': '集群地址注册',
        '办事主体': '广州网融信息技术有限公司 ',
        '业务编号': '202002021010310001',
        '时间轴': [
          { 'id': 1, '名称': '创建业务申请', '时间': '2020-12-31 23:50:00' },
          { 'id': 2, '名称': '发起签名任务', '时间': '2020-12-31 23:52:12' },
          { 'id': 3, '名称': '提交申请', '时间': '2020-12-31 23:52:12' },
          { 'id': 4, '名称': '审批中', '时间': '2020-12-31 23:56:39' },
          { 'id': 5, '名称': '办结', '时间': '' }
          // { 'id': 5, '名称': '审批不通过', '时间': '2020-12-31 23:59:59' }
        ],
        '当前状态编号': 4,
        '签署情况': [
          { '签署人名称': '张三', '签署人证件号码': '440103198809195117', '签署状态': '已签名', '签署时间': '2020-12-31 23:54:59' },
          { '签署人名称': '李四', '签署人证件号码': '440103198809195119', '签署状态': '已签名', '签署时间': '2020-12-31 23:55:59' }
          // { '签署人名称': '广州网融信息技术有限公司', '签署人证件号码': '91440106788913867A', '签署状态': '未签名' }
        ],
        '认证信息': [
          {
            '姓名': '张三',
            '证件号码': '440103198809195117'
          },
          {
            '姓名': '李四',
            '证件号码': '440103198809195119'
          }
        ],
        '办件编号': {
          '事项A编号': '5e070a1d0fd6dec0da3dac84',
          '事项B编号': '1f00eb85a345421f98acc2564458de67'
        }
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.login.userInfo
    }
  },
  // mounted () {
  //   this.getList()
  // },
  created() {
    this.getList()
  },
  mounted() {
    window.handleSubmit = this.handleSubmit
  },
  methods: {
    handleSubmit(url) {
      this.eventDialog = true
      this.pdfUrl = url
    },
    getList() {
      this.$api.showLoading({ text: '获取数据中...' })
      const params = {
        inData: {
          'pageNo': this.currentPage,
          'pageSize': this.size,
          'status': this.currentStatus, // 状态 1-草稿 2-已提交
          'bizName': '',
          'before': this.endDate ? Math.round((new Date(this.endDate).getTime() + 86400000) / 1000) : '',
          'after': this.startDate ? Math.round(new Date(this.startDate).getTime() / 1000) : '',
          'bizStateName': this.state,
          'processStatusList': this.processList
        },
        job: this.currentStatus === 1 ? 'EC_BIZBOX_DRAFT_LIST' : 'EC_BIZBOX_QUERY_BIZITEMS_LIST'
      }
      this.$api.startJob(params).then(res => {
        this.$api.hideLoading()
        if (res.state !== 'successful') {
          this.$utils.showWarn(res.errMsg)
          return
        }
        this.total = res.outData.total
        this.dataList = res.outData.list
        // if (process.env.NODE_ENV === 'development' && this.currentPage < 4) {
        //   this.total = 30
        //   const demo = {
        //     bizStateName: '办理中',
        //     updatedTime: '修改时间',
        //     bizSerialNumber: '202012310001', // 平台流水号, 业务id
        //     updatedBy: 'number',
        //     bizPushTime: '业务事项推送时间',
        //     createdBy: 'number',
        //     bizName: '设立登记', // 事项名称
        //     bizCode: '平台代码',
        //     createdTime: '2020-08-25 14:30:00', // 创建时间
        //     id: 'number',
        //     status: '2', // 1-草稿 2-已提交
        //     name: '广州网融信息技术有限公司', // 新增,办事主体
        //     zgdw: '天河区市场监督局', // 新增,如主管单位
        //     businessType: '1', // 新增,1 -个人 2- 企业
        //     bizHandleUrl: 'http://47.112.129.40/ComCustomerForm/CommonCustomerMatter'
        //   }
        //   for (let index = 0; index < 10; index++) {
        //     this.dataList.push(demo)
        //   }
        // }
      }).catch(error => {
        this.$api.hideLoading()
        console.log(error)
        this.$utils.showError('发生错误，请联系管理员！')
      })
    },
    getDetail(ident) {
      this.$api.showLoading({ text: '获取数据中...' })
      const params = {
        'job': 'HUBEI_QUEUE_STATUS',
        'inData': {
          'bizSerialNumber': ident
        }
      }
      this.$api.startJob(params).then(res => {
        this.$api.hideLoading()
        if (res.state !== 'successful') {
          this.$utils.showWarn(res.errMsg)
          return
        }
        console.log('业务数据：', res.outData)
        // res.outData['当前状态编号'] = 3
        // res.outData['时间轴'][2]['时间'] = '2020-12-31 23:59:59'
        // res.outData['签署情况'][0]['签署状态'] = '已签名'
        // res.outData['签署情况'][1]['签署状态'] = '已签名'
        // res.outData['签署情况'][0]['签署时间'] = '2020-12-31 23:59:58'
        // res.outData['签署情况'][1]['签署时间'] = '2020-12-31 23:59:59'
        // res.outData['时间轴'][3]['时间'] = '2020-12-31 23:59:59'
        this.workDetail = res.outData
        // this.workDetail = this.mockData
        this.dialogProgress = true
      }).catch(error => {
        this.$api.hideLoading()
        console.log(error)
        this.$utils.showError('发生错误，请联系管理员！')
      })
    },
    handleSearch() {
      if (!this.search) {
        return this.$utils.showError('请先输入关键词！')
      }
      this.dataList = this.dataList.filter(item => item.name.includes(this.search))
    },
    // 业务类型改变
    handleChangeTab(index) {
      console.log(`业务类型改变 ${index} `)
      this.currentStatus = index
      this.getList()
    },
    // 业务状态改变
    handleStateChange(data) {
      console.log(`业务状态改变 ${data} `)
      // this.state = data
      this.processList = [{ 'processStatus': '已删除', 'exclude': true }]
      if (this.processStatus !== '全部') {
        const item = { 'processStatus': this.processStatus, 'exclude': false }
        this.processList.push(item)
      }
      this.getList()
    },
    // 日期改变
    handleDateChange(date) {
      date ? (this.startDate = date[0]) : (this.startDate = '')
      date ? (this.endDate = date[1]) : (this.endDate = '')
      this.getList()
    },
    // 点击签名
    handleSign(index, row) {
      console.log(`点击签名`)
      console.log(index, row)
      this.dialogSign = true
    },
    formatURL(url) {
      // 湖北的域名前缀暂时没用，暂时保持入参带域名，后期如果有用再另作处理
      if (!url) { // 兼容url为空的情况
        return `${location.origin + location.pathname}#/officeBox/progressDetails`
      }
      let value = url
      if (url.indexOf('#') > -1) {
        // 域名没用，如果是融平台直接采用融平台域名
        value = `${location.origin + location.pathname}#${url.split('#')[1]}`
      }
      return value
    },
    // 点击查看
    handleEdit(index, row) {
      console.log(`点击编辑`)
      console.log(index, row)
      if (!row.bizName) return this.$utils.showError('无该事项，请联系管理员！')
      const bizNameArr = ['个人独资企业公示信息填报', '个体工商户公示信息填报', '内资企业公示信息填报', '分公司公示信息填报', '农民专业合作社公示信息填报']
      if (bizNameArr.includes(row.bizName)) {
        return this.$utils.showWarn('年报详情请到小程序查看')
      }
      if (this.currentStatus === 2) { // 办件
        // 模拟后端数据
        // row.bizHandleUrl = 'https://scjg.hubei.gov.cn/zhkb/ecGovBizHubei/#/officeBox/progressDetails'
        // 过滤获取到URL，区分三端（PC、终端、小程序）
        const URL = this.formatURL(row.bizHandleUrl)
        this.iframeUrl = `${URL}?ident=${row.bizSerialNumber}&bizName=${row.bizName}`
        console.log(this.iframeUrl,'this.iframeUrl');
        console.log('办件详情：', this.iframeUrl)
        this.dialogProgress = true
        // this.getDetail(row.bizSerialNumber)
      } else { // 草稿
        this.$utils.showLoading()
        createJobQueue().then(res => {
          this.$utils.setItem('ident', res.outData.queueIdent)
          this.$utils.setLocalItem('bizCode', row.bizCode)
          this.$utils.setItem('draftNumber', row.draftNumber)
          this.$utils.hideLoading()
          if (row.bizName === '内资企业辅助开办') {
            this.$router.push({
              path: '/form/nameApply',
              query: { ...this.$route.query,
                type: 'company',
                bizName: row.bizName
              }
            })
          } else if (row.bizName === '个体工商户辅助开办') {
            if (row.name) {
              this.$router.push({
                path: '/form/nameApply',
                query: {
                  ...this.$route.query,
                  type: 'person',
                  bizName: row.bizName
                }
              })
            } else {
              this.$router.push({
                path: '/form/noNameApply',
                query: {
                  ...this.$route.query,
                  type: 'person',
                  bizName: row.bizName
                }
              })
            }
          } else if (row.bizName === '荆州9210企业开办') {
            this.$router.push({
              path: '/form/businessHandling',
              query: { ...this.$route.query,
                type: '9210commercial',
                bizName: row.bizName
              }
            })
          } else if (row.bizName === '商事主体确认登记') {
            // 06-17 硚口区商事主体登记功能调整
            if (this.$utils.getLocalItem('curArea').district === '硚口区') {
              this.$router.push({
                path: '/form/nameApply',
                query: {
                  ...this.$route.query,
                  type: 'commercialRegister',
                  bizName: row.bizName
                }
              })
              return
            }
            this.$router.push({
              path: '/form/businessHandling',
              query: { ...this.$route.query,
                type: 'commercialRegister',
                bizName: row.bizName
              }
            })
          } else {
            if (!filterBizName(row.bizName)) return this.$utils.showError('无该事项，请联系管理员！')
            this.$router.push({
              path: '/form/business',
              query: {
                ...this.$route.query,
                type: filterBizName(row.bizName),
                bizName: row.bizName
              }
            })
          }
        })
      }
    },
    // 点击删除
    handleDelete(index, row) {
      console.log(`点击删除`)
      console.log(index, row)
      this.$confirm('业务撤销后不可恢复, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'Logout', // 自定义类名
        center: true
      }).then(() => {
        if (row.bizStateName === '草稿') {
          this.removeDraft(row.draftNumber)
          return
        }
        if (row.bizStateName !== '草稿') {
          this.removeDothing(row)
        }
        // this.$utils.showWarn('正在建设中...')
      }).catch(() => {
        this.$utils.showWarn('已取消删除')
      })
    },
    // 删除草稿
    removeDraft(draftNumber) {
      deleteDraft(draftNumber).then(res => {
        if (res.state !== 'successful') {
          this.$utils.showWarn(res.errMsg)
          return
        }
        this.$utils.showSuccess('删除成功')
        this.getList()
      })
    },
    // 删除办件
    removeDothing(row) {
      const inData = {
        bizStateName: row.bizStateName,
        bizCode: row.bizCode,
        bizSerialNumber: row.bizSerialNumber
      }
      // 删除办件
      editDothing(inData).then(res => {
        if (res.state !== 'successful') {
          this.$utils.showError(`删除失败`)
          return
        }
        this.$utils.showSuccess('删除成功')
        this.getList()
      })
    },
    // 页面数量改变
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.size = val
      this.getList()
    },
    // 页码改变
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getList()
    }
  }
}
</script>

<style scoped>
::v-deep .el-dialog__body {
  padding: 0;
}
::v-deep .el-step__title.is-process {
  font-weight: normal;
}
::v-deep .el-table thead {
  color: #464646;
  font-weight: 600;
  font-size: 14px;
}
.z_step_result {
  margin-right: 10px;
}
::v-deep .el-step__description {
  padding-right:0;
}
.el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0;
}
.list_page{
  width: 1200px;
  margin: 0 auto;
  padding-bottom: 40px;
}
.header{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 35px 0;
  z-index: 99;
}
.header .btn {
  width: 120px;
  height: 43px;
}

/* 主体 */
.main {
  display: flex;
  margin-top: 30px;
}
.main .left {
  display: flex;
  flex-direction: column;
  width: 20%;
  /* border: 1px solid #ccc; */
  margin-right: 20px;
  padding: 15px;
  box-shadow: 0px 0px 15px rgb(229, 229, 229);
  padding-top: 0;
  /* min-height: 90%; */
  /* height: 500px; */
  /* height: 70vh; */
}
.main .left .user {
  text-align: center;
  padding: 50px 0;
  font-size: 20px;
}
.main .right {
  flex: 1;
}
.search-box {
  flex: 1;
  /* height: 43px; */
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.search_input{
  width: 210px;
}

.z-pagination{
  text-align: center;
  padding: 40px 0 0;
}
.sign_dialog .dialog_wrap{
  text-align: center;
  padding-bottom: 30px;
}

.sign_dialog .ewm{
  width: 300px;
  margin-bottom: 15px;
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
.input-class {
  height: 43px;

}
::v-deep .input-class .el-input {
  height: 43px;
}
::v-deep .input-class .el-input__inner {
    height: 43px;
}
::v-deep .input-class .el-input__inner input {
  height: 43px;
}
::v-deep .el-range__icon {
  line-height: 35px;
}
</style>

<style>
.z-table td, .z-table th{
  text-align: center;
}
</style>
