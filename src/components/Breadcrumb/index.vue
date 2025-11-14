<template>
  <div class="breadcrumb w-1200">
    <span @click="handleGoHome">首页</span>
    <span> >  </span>
    <!--如果不入参直接走数据字典-->
    <span v-if="title">{{ title }}</span>
    <span v-else>{{ $route.query.bizName }}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleGoHome() {
      this.$router.push('/')
    }
  }
}
</script>
<style lang='scss' scoped>
.breadcrumb {
  position: relative;
  padding-top: 30px;
  font-size: 16px;
  color: #464646;
  z-index: 99;
  span {
    &:first-child {
      cursor: pointer;
    }
  }
}
</style>
