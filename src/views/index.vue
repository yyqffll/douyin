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
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
