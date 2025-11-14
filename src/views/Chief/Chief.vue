<template>
  <div class="list-page">
    <page-header />
    <breadcrumb title="湖北政务服务网" />
    <div class="title">{{ $route.meta.title }}</div>
    <div class="content">
        <iframe  :src="iframeUrl" class="contentMain" sandbox="allow-same-origin allow-scripts"></iframe>
    </div>
        <el-dialog
        title="是否打开湖北政务服务网"
        :visible.sync="centerDialogVisible"
        width="70%"
        class="diaolog"
        :close-on-press-escape="false" 
        :close-on-click-modal="false"
        center
        >
        <span slot="footer" class="dialog-footer">
            <div class="footer_text"></div>
            <el-button @click="cancelGo">取 消</el-button>
            <el-button type="primary" @click="OpenChief()">确 定</el-button>
        </span>
        </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/index'
import { print } from '@/api/terminal'
import myLoading from '@/components/Loading/index'
import { getPrintList, getLicenseInfo, uploadResult } from '@/api/index'
import PageHeader from '@/components/PageHeader/index'
import router from '@/router'
export default {
  components: {
    Breadcrumb,
    PageHeader
  },
  data() {
    return {
        iframeUrl:'http://zwfw.hubei.gov.cn/',
        centerDialogVisible: false
    }
  },
  created(){
    this.centerDialogVisible = true
  },
  methods: {
  OpenChief() {
    window.open("http://zwfw.hubei.gov.cn/");
  },
  cancelGo(){
    this.centerDialogVisible = false
    // router.push('/')
  }
}

}
</script>

<style lang="scss" scoped>

.list-page {
  .w-1000 {
    width: 1000px;
    margin: 0 auto;
  }
  .sign_dialog {
    .dialog_wrap {
      text-align: center;
      padding: 30px 0 30px 0;
      .ewm{
        width: 300px;
        margin-bottom: 15px;
      }
    }
  }

  .title {
    text-align: center;
    padding-bottom: 10px;
    font-size: 28px;
    font-weight: 600;
    color: #333333;
    line-height: 40px;
  }
  .content{
    width: 100vw;
    .contentMain{
        width: 100vw;
        height: 75vh;
    }
  }
  ::v-deep .el-dialog__header{

    font-weight: 600;
  }
  ::v-deep .el-dialog__title{
    font-size: 25px;
  }
}
.diaolog{
    transform: translateY(20%);
    // height: 500px;
}
::v-deep .el-dialog__body{
    height: 200px;
}

</style>
