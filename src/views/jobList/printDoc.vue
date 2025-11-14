<template>
  <div class="print-doc">
    <el-button class="btn" type="primary">返回</el-button>
    <div>
      <iframe src="http://scjg.hubei.gov.cn/JR-web/oauth/login_files.html" style="width: 100%;height:calc(100vh - 80px);overflow:auto;" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {

    }
  },
  computed: {},
  mounted() {},
  created() {},
  methods: {}
}
</script>
<style lang='scss' scoped>
.print-doc {
  .btn {
    margin: 15px 0 15px 15px;
  }
}
</style>
