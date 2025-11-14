<template>
  <div style="padding-bottom:60px;">
    <!-- <page-header /> -->
    <breadcrumb />
    <div class="notice_page">

      <div class="title">
        <img src="@/assets/images/handleNotice/line.png" alt="" class="img" />
        办理指南
        <img src="@/assets/images/handleNotice/line.png" alt="" class="img" />
      </div>
      <div>欢迎使用本系统，办理前仔细阅读以下内容,提前做好准备,以帮助您快速办理业务:</div>
      <div class="description">一业一证为“一个行业一个经营许可证”，减化原先需用户分别办理N个经营许可证，将多经营许可合一，形成《行业综合许可证》，使用户可一照一证营业经营，取代原来的一个营业执照N个经营许可证模式，为企业带来便利。</div>
      <template>
        <ul class="content">
          <li>本系统暂时仅支持已拥有营业执照的企业办理，请未获得营业执照的企业，先进行企业开办，获得营业执照后，再进行行业综合许可证申报；</li>
          <li>在进行业务申报前，请确认确认已携带好相关申报材料，如非企业法定代表，还需提供代理人身份证明文件及委托代理书；</li>
          <li v-if="$route.query.minType==='药店'">当前申报行业综合许可证的行业类别为“药店”，其中包含的许可项目为：药品经营许可、食品经营许可、第三类医疗器械经营许可，请企业确认与企业经营性质相符合，避免申报失败。</li>
          <li v-if="$route.query.minType==='书店'">当前申报行业综合许可证的行业类别为“书店”，其中包含的许可项目为：出版物经营许可证（零售)、食品经营许可，请企业确认与企业经营性质相符合，避免申报失败。</li>
        </ul>
      </template>
      <div class="notice_btn">
        <el-button type="primary" @click="nextPage()">开始办理</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import PageHeader from '@/components/PageHeader/index'
import Breadcrumb from '@/components/Breadcrumb/index'
import { createJobQueue, getBizCode } from '@/api/index'
export default {
  components: {
    // PageHeader,
    Breadcrumb
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    nextPage() {
      this.$loading({ text: '加载中...' })
      createJobQueue().then(async res => {
        this.$utils.setItem('ident', res.outData.queueIdent)
        // 没有平台代码，则去获取
        if (!this.$utils.getLocalItem('bizCode')) {
          const bizInfo = await getBizCode()
          this.$utils.setLocalItem('bizCode', bizInfo.outData.bizCode)
        }
        // 从须知页进入，清除草稿订单号，相当于新建订单
        this.$utils.removeItem('draftNumber')
        this.$loading().close()
        // 新建订单清除draftInfo
        this.$store.commit('draft/SET_DRAFT_INFO', null)
        this.$router.push({ path: '/form/applicantInfo', query: { ...this.$route.query }})
      }).catch(err => {
        this.$loading().close()
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.notice_page{
  font-size: 16px;
  width: 957px;
  margin: 0 auto;
  color: #464646;
}
.notice_page .title{
  font-size: 28px;
  color: #333;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px 0;
}
.notice_page .img{
  width: 27px;
  margin: 0 15px;
}
.notice_page .content{
  padding: 15px 0;
}
.notice_page .content li{
  padding: 12px 0;
  list-style-type: decimal;
  margin-left: 15px;
  line-height: 26px;
  /* list-style-position: inside; */
}
.notice_page .title2{
  padding-bottom: 30px;
}
.notice_btn {
  /* width: 155px; */
  padding: 0 25px!important;
  height: 48px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 80px auto 0 auto;
}
::v-deep .notice_btn .el-button:last-child {
  margin-left: 50px;
}
.button{
  width: 155px;
  padding: 15px 0;
  background: blue;
  color: #FFFFFF;
  text-align: center;
  border-radius: 4px;
  margin: 60px auto;
  cursor: pointer;
}
.link{
  color: blue;
  cursor: pointer;
}

.flex{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 27px;
}
.flex .flex-item{
  text-align: center;
  list-style: none;
  padding-bottom: 10px;
}
.flex .flex-item img{
  width: 185px;
  padding: 5px 0 0;
}
.dialog_title{
  text-align: center;
  font-weight: bold;
  color: #000;
  font-size: 20px;
  padding-top: 30px;
}
.el-table th>.cell {
  color: #464646;
}
.restaurant-title {
  padding: 30px 0 10px 0;
}
.tips-content{
  padding: 20px;
  line-height: 30px;
  font-size: 16px;
  text-indent: 20px;
}
.description{
    padding: 30px 0 10px 0;
    line-height: 30px;
}
</style>
