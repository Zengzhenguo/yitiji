<template>
  <div class="page-header">
    <div class="header-wrapper w-1200">
      <div class="left">
        <img src="../../assets/images/logo.png" alt="" @click="handleGo" />
        <span @click="handleGo">湖北省企业开办智慧平台</span>
      </div>

      <div class="right">
        <div class="user-info">{{ $utils.userInfo('name') || '' }}</div>
        <div @click="signOut()">退出</div>
      </div>
    </div>
  </div>
</template>

<script>
import { removeLocalItem } from '@/utils/index'
export default {
  methods: {
    handleGo() {
      this.$router.replace('/')
    },
    signOut () {
      removeLocalItem('token')
      this.token = ''
      removeLocalItem('userInfo')
      this.userInfo = null
      this.$utils.showSuccess('退出登录成功')
      this.handleGo()
    }
  }
}
</script>
<style lang='scss' scoped>
.page-header {
  height: 100px;
  background: #3162E8;
  .header-wrapper {
    display: flex;
    .left {
      padding-top: 22px;
      flex: 1;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      img {
        width: 50px;
        height: 50px;
        margin-right: 12px;
        cursor: pointer;
      }
      span {
        font-size: 26px;
        font-weight: 500;
        color: #FFFFFF;
        cursor: pointer;
      }
    }
    .right {
      padding-top: 20px;
      display: flex;
      div {
        width: 99px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        background: #fff;
        border-radius: 4px;
        font-size: 16px;
        color: #3162E8;
        cursor: pointer;
        user-select:none;
        &:active {
          background: #9abdff;
        }
        &.user-info {
          background: none;
          color: #fff;
          cursor: default;
        }
      }
    }
  }
}
</style>
