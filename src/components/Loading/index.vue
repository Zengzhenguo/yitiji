<template>
  <div class="loading-img" :style="`width: ${width}px;height: ${height}px;`">
    <img :src="src" alt="loading" />
  </div>
</template>

<script>
import loadImg from '../../assets/images/loading_white.png'
export default {
  props: {
    src: {
      type: String,
      default: loadImg
    },
    width: {
      type: String,
      default: '96'
    },
    height: {
      type: String,
      default: '102'
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss">
@keyframes myRotate {
  from {transform: rotate(0deg);}
  to {transform: rotate(359deg);}
}
.loading-img {
  margin: 0 auto;
  animation: myRotate 3s infinite linear;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
