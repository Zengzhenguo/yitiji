<!--
 * @Author: your name
 * @Date: 2021-11-12 09:10:24
 * @LastEditTime: 2022-09-02 10:40:46
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /ec-gov-biz-hubei-pc/src/views/jobList/pdfPreview.vue
-->
<template>
  <div class="fullScreen">
    <el-button class="auth-btn" @click="doPrint()">打印</el-button><var></var>
    <div>
      <iframe id="fullScreenPDF" class="fullScreenPDF" :src="path" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
import { getPrefix } from '@/utils/index'
export default {
  components: {

  },
  data() {
    return {
      path: ''
    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {
    console.log(location)
    console.log(location.origin)
    this.path = location.origin + getPrefix() + '/open-platform/' + this.$route.query.path
    console.log(this.path)
  },
  beforeDestroy() {

  },

  methods: {
    doPrint() {
      console.log('fullScreenPDF')
      document.getElementById('fullScreenPDF').contentWindow.print()
    }
  }
}
</script>

<style lang="scss" scoped>
.fullScreen {
  .fullScreenPDF{
    width: 100vw;
    height: 100vh;
  }
}
</style>
