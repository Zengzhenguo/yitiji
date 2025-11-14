<template>
  <div>
    <page-header />
    <div class="camera-guide">
      <div class="title">请将需要拍照的文件横向放入扫描入口</div>
      <img src="../../assets/images/camera_guide.gif" alt="" />
      <div class="btn-group">
        <el-button type="primary" @click="$router.go(-1)">取消拍照</el-button>
        <!-- <el-button type="primary" @click="handleOpen">打开高拍仪</el-button> -->
        <el-button type="primary" @click="handleNext">下一步</el-button>
      </div>
    </div>
  </div>

</template>

<script>
import PageHeader from '@/components/PageHeader/index'
export default {
  name: '',
  components: { PageHeader },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    handleNext() {
      this.$router.push(`/form/camera?type=${this.$route.query.type}`)
    }
  }
}
</script>

<style scoped lang="scss">
.camera-guide {
  width: 868px;
  margin: 0 auto;
  .title {
    font-size: 28px;
    font-weight: 600;
    color: #333333;
    padding-top: 50px;
    padding-bottom: 40px;
    text-align: center;
  }
  img {
    width: 868px;
    height: 563px;
  }
  .btn-group {
    padding-top: 60px;
    padding-bottom: 20px;
    text-align: center;
    .el-button {
      width: 155px;
      height: 48px;
      padding: 0;
      box-sizing: border-box;
      text-align: center;
      line-height: 48px;
      border: 1px solid #3162E8;
      color: #fff;
    }
  }
}
</style>
