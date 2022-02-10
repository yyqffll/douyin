<template>
  <swiper :options="swiperOption" class="swiper" ref="swiper">
    <swiper-slide v-for="(item, index) in videoLists" :key="index">
      <slot name="content" :content="item"></slot>
    </swiper-slide>
  </swiper>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  props: {
    videoLists: {
      default: null,
      type: Array
    },
    swiperOption: {
      default: null,
      type: Object
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
.swiper {
  height: 100%;
  width: 100%;
}
</style>
