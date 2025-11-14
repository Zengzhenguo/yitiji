<template>
  <div class="test">
    <!-- <div>---------活体START-----------</div>
    <iframe src="/iframe/face/Demo_websocket.html" frameborder="0" class="iframe"></iframe>
    <div>---------活体END-----------</div> -->
    <div>---------高拍仪START-----------</div>
    <iframe src="/iframe/camera.html" frameborder="0" class="iframe"></iframe>
    <div>---------高拍仪END-----------</div>
    <!-- <div>---------读卡START-----------</div>
    <iframe src="/iframe/MT8test.html" frameborder="0" class="iframe"></iframe>
    <div>---------读卡END-----------</div> -->
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
.test {
  .iframe {
    width: 100%;
    height: 1000px;
  }
}
</style>
