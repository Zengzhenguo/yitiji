<!--
 * @Author: your name
 * @Date: 2021-10-08 15:03:45
 * @LastEditTime: 2021-12-07 10:36:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ec-gov-biz-hubei-terminal\src\views\jobList\yyyzList.vue
-->
<template>
  <div class="list_page">
    <breadcrumb title="办件查询" />
    <div class="header">

      <div class="search-box">
        <div style="margin-left: 15px;">
          <span style="margin-right: 10px;">申请日期</span>
          <el-date-picker v-model="applyDate" style="width: 300px;" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" class="input-class" @change="handleDateChange" />
        </div>
        <div style="margin-left: 15px;">
          <span style="margin-right: 10px;">业务状态</span>
          <el-select v-model="state" style="width:130px;height:43px;" class="input-class" placeholder="请选择" @change="handleStateChange">
            <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <div style="margin-left: 15px;">
          <el-input v-model="search" placeholder="请输入公司名称查找" clearable class="search_input input-class" />
          <el-button type="primary" style="margin-left: 10px;height: 43px;" @click="handleSearch">查询</el-button>
          <el-button style="margin-left: 10px;height: 43px;" @click="resetSearchQuery">重置</el-button>
        </div>
      </div>
    </div>
    <el-table :data="dataList" style="width: 100%;min-height: 400px;" class="z-table">
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="业务编号">
        <template slot-scope="{row}">
          {{ row.ident }}
        </template>
      </el-table-column>
      <el-table-column prop="companyName" label="公司名称" />
      <el-table-column label="申请时间">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="业务状态">
        <template slot-scope="{row}">
          {{ row.status }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleEdit(scope.$index, scope.row)">查看详情</el-button>
          <!-- <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
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

    <el-dialog :visible.sync="dialogSign" width="500px" close-on-click-modal close-on-press-escape :show-close="true" class="sign_dialog">
      <div class="dialog_wrap">
        <img src="@/assets/images/qrcode.png" alt="" class="ewm" />
        <div style="font-size: 16px;">请用微信扫码签名</div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogProgress" width="500px" :close-on-click-modal="false" :close-on-press-escape="false" class="progress_dialog" title="业务进度详情">
      <div class="z_process_page">
        <ul class="z_process_header">
          <li><span>业务名称</span><span>{{ workDetail['bizName'] }}</span></li>
          <li><span>办事主体</span><span>{{ workDetail['companyName'] }}</span></li>
          <li><span>业务编号</span><span>{{ workDetail['ident'] }}</span></li>
        </ul>
        <div class="z_process_title">办理进度</div>
        <div class="z_process_body">
          <el-steps direction="vertical" active-color="#2163e0" :active="workDetail['status']+1">
            <el-step v-for="item in workDetail['list']" :key="item.id">

              <div slot="title" class="z_step_content">
                <div class="z_step_name">{{ item['节点'] }}</div>
                <div class="z_step_time">{{ item['时间'] }}</div>
              </div>

              <div slot="description" style="padding: 15px 0">
                <ul v-if="item['子节点']" class="z_sign">
                  <li v-for="(j, jIndex) in item['子节点']['list']" :key="jIndex" class="z_sign_item">
                    <div class="z_sign_name">{{ j['tabName'] }}<br />{{ j['updateTime'] }}</div>
                    <div class="z_sign_time">{{ j['status'] }}</div>
                  </li>
                </ul>
              </div>
            </el-step>
          </el-steps>
        </div>
      </div>
      <!-- <iframe v-if="dialogProgress" :src="iframeUrl" width="500" height="540"></iframe> -->
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/index'
import { getLicenseDetail, editDothing, queryLicenseList, queryLogoutCompanyList, queryLogoutCompanyDetail } from '@/api/index'
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      applyDate: [],
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
      dataList: [],
      dialogSign: false,
      dialogProgress: false,
      workDetail: []
    }
  },
  // mounted () {
  //   this.getList()
  // },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$api.showLoading({ text: '获取数据中...' })
      const data = {
        token: this.$utils.getLocalItem('token'),
        pageNum: this.currentPage,
        pageSize: this.size,
        status: this.state,
        startTime: this.startDate,
        endTime: this.endDate,
        keyWord: this.search
      }
      if (this.$route.query.bizName === '简易注销') {
      // 获取注销材料
        queryLogoutCompanyList(data).then(res => {
          this.$api.hideLoading()
          if (res.state !== 'successful') {
            this.$utils.showWarn(res.errMsg)
            return
          }
          this.total = res.outData.pageInfo.total
          this.dataList = res.outData.pageInfo.list
        }).catch(error => {
          this.$api.hideLoading()
          console.log(error)
          this.$utils.showError('发生错误，请联系管理员！')
        })
        return
      }
      queryLicenseList(data).then(res => {
        this.$api.hideLoading()
        if (res.state !== 'successful') {
          this.$utils.showWarn(res.errMsg)
          return
        }
        this.total = res.outData.pageInfo.total
        this.dataList = res.outData.pageInfo.list
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
      this.getList()
    },
    // 重置
    resetSearchQuery() {
      this.state = ''
      this.startDate = ''
      this.endDate = ''
      this.applyDate = []
      this.search = ''
      this.getList()
    },
    // 业务状态改变
    handleStateChange(data) {
      console.log(`业务状态改变 ${data} `)
      this.state = data
      this.getList()
    },
    // 日期改变
    handleDateChange(date) {
      date ? (this.startDate = date[0]) : (this.startDate = '')
      date ? (this.endDate = date[1]) : (this.endDate = '')
      this.getList()
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
      console.log(`点击查看`)
      console.log(index, row)
      this.$api.showLoading({ text: '获取数据中...' })
      if (this.$route.query.bizName === '简易注销') {
        queryLogoutCompanyDetail({ ident: row.ident }).then(res => {
          this.$api.hideLoading()
          if (res.state !== 'successful') {
            this.$utils.showWarn(res.errMsg)
            return
          }
          console.log('业务数据：', res.outData)
          this.workDetail = res.outData
          this.dialogProgress = true
        })
        return
      }
      getLicenseDetail({ ident: row.ident }).then(res => {
        this.$api.hideLoading()
        if (res.state !== 'successful') {
          this.$utils.showWarn(res.errMsg)
          return
        }
        console.log('业务数据：', res.outData)
        this.workDetail = res.outData
        this.dialogProgress = true
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
.search-box {
  flex: 1;
  height: 43px;
  display: flex;
  /* justify-content: flex-end; */
}
.search_input{
  width: 210px;
}
.z-pagination{
  text-align: center;
  padding: 40px 0;
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
