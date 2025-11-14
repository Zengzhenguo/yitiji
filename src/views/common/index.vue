<template>
  <div>
    <page-header />
    <router-view />
  </div>
</template>
<script>
import PageHeader from '@/components/PageHeader/index'
export default {
  components: {
    PageHeader
  }
}
</script>
