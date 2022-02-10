<template>
  <div class="main">
    <SideMenu></SideMenu>
    <MainLayout></MainLayout>
  </div>
</template>

<script>
import SideMenu from '@/views/SideMenu'
import MainLayout from '@/views/MainLayout'
export default {
  components: {
    SideMenu,
    MainLayout
  },
  mounted () {
    this.$axios.post('/api/user')
  }
}
</script>

<style lang="less" scoped>
.main {
  display: flex;
}
</style>
