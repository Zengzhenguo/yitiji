<template>
    <div class="titleWarp">
        <div class="icon"></div><h4 >{{title}}</h4>
    </div>
</template>

<script type="text/javascript">
export default {
  name: 'caption',
  props: ['title'],
  data() {
    return {

    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
  .titleWarp{
    display: flex;
    align-items: center;
    margin: 25px 0;
    .icon{
      width: 5px;
      height: 15px;
      background-color: #464646;
      margin-right: 7px;
    }
  }
</style>
