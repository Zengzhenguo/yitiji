<template>
  <div>
    <div class="help">
      <div class="btn" @click="handleOpenHelpList">操作指引</div>
      <div v-show="showHelpFileList" class="list" @click="handleOpenHelpFile">
        <span v-for="item in list" :key="item.url" :data-item="JSON.stringify(item)">{{ item.name }}</span>
      </div>
    </div>

    <el-dialog
      :title="iframeItem.name"
      :visible.sync="openIframeDialog"
      width="70%"
      top="8vh"
      destroy-on-close
      :modal-append-to-body="false"
    >
      <!-- <iframe :src="iframeItem.url" frameborder="0"></iframe> -->
      <embed :src="iframeItem.url" type="application/pdf" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      helpDialogOpenFlag: false,
      showHelpFileList: false, // 指南列表标识
      openIframeDialog: false, // iframe标识
      iframeItem: {},
      timeOut: null, // 定时器标识
      list: []
    }
  },
  created() {
    this.initList()
  },
  methods: {
    initList() {
      const host = window.location.host
      let list = [
        { url: 'https://rong.wetruetech.cn/zhkb/gth.pdf', name: '智慧开办一体机个体户登记操作指引' },
        { url: 'https://rong.wetruetech.cn/zhkb/nzqy.pdf', name: '智慧开办一体机内资企业登记操作指引' },
        { url: 'https://rong.wetruetech.cn/zhkb/xcx.pdf', name: '智慧开办小程序操作指引' }
        // { url: 'https://scjg.hubei.gov.cn/zhkb/iwd-ylt.pdf', name: '“i武当”App市场主体一链通操作指引' }
      ]
      if (host.includes('jingzhou')) {
        // 荆州特有文件
        list = [
          { url: 'https://qydj.scjgj.jingzhou.gov.cn/jz/ytj.pdf', name: '荆州9210一体机操作指引' },
          { url: 'https://qydj.scjgj.jingzhou.gov.cn/jz/zww.pdf', name: '荆州9210政务网操作指引' },
          { url: 'https://qydj.scjgj.jingzhou.gov.cn/jz/xcx.pdf', name: '荆州9210小程序操作指引' }
        ]
      }
      if (this.$utils.getLocalItem('curArea').district === '通山县') {
        list.push({ url: 'https://rong.wetruetech.cn/zhkb/xcygzh.pdf', name: '小餐饮承诺告知书' })
      }
      this.list = list
    },
    handleOpenHelpList() {
      this.showHelpFileList = !this.showHelpFileList
      clearTimeout(this.timeOut)
      if (this.showHelpFileList) {
        this.timeOut = setTimeout(() => {
          this.showHelpFileList = false
        }, 8000)
      }
    },
    handleOpenHelpFile(e) {
      const item = JSON.parse(e.target.dataset.item)
      console.log(item)
      if (!item.url) return
      clearTimeout(this.timeOut)
      this.iframeItem = item
      this.showHelpFileList = false
      this.openIframeDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.help {
  position: fixed;
  right: 0;
  bottom: 10%;
  display: flex;
  z-index: 99;
  .btn {
    width: 28px;
    line-height: 1.6;
    color: white;
    font-weight: 700;
    background-color: red;
    border-radius: 5px;
    padding: 5px;
    font-size: 18px;
    // margin-right: 5px;
  }
  .list {
    background-color: rgb(242, 242, 242);
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 0 5px;
    border-radius: 5px;
    span {
      color: #025BFF;
      cursor: pointer;
      text-decoration: underline;
      font-size: 16px;
    }
  }
}
.el-dialog__wrapper {
  & >>> .el-dialog {
    height: 85%;
    .el-dialog__body {
      height: 100%;
      padding: 0 5px 55px;
      iframe, embed {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
