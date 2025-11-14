<template>
  <div>
    <page-header v-if="this.$route.path!=='/form/previewDocInfoPerson'"/>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>
<script>
import PageHeader from '@/components/PageHeader/index'
export default {
  components: {
    PageHeader
  },
  created(){
    console.log(this.$route,'this.$route');
  }
}
</script>
