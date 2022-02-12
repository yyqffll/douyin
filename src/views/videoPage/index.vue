<template>
  <div class="video-page">
    <swiper :options="swiperOption" class="swiper" ref="swiper">
      <swiper-slide v-for="(item, index) in videoLists" :key="index">
        <VideoPlayer ref="video" :option="item"></VideoPlayer>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import VideoPlayer from '@/components/VideoPlayer'

export default {
  name: 'videoPage',
  components: {
    swiper,
    swiperSlide,
    VideoPlayer
  },
  data () {
    return {
      videoLists: [
        {
          src: '',
          img: '',
        },
        {
          src: '',
          img: '',
        }
      ],
      swiperOption: {
        direction: 'vertical',
        spaceBetween: 30,
        mousewheel: true,
        keyboard: {
          enabled: true
        },
        on: {
          init: () => {
            const activeVideo = this.$refs.swiper.$el.querySelector('.swiper-slide-active')
            const videoList = this.$refs.video
            videoList.forEach(item => {
              if (activeVideo.contains(item.$el)) {
                item.play()
              }
            })
          },
          slideChangeTransitionStart: () => {
            const activeVideo = this.$refs.swiper.$el.querySelector('.swiper-slide-active')
            const videoList = this.$refs.video
            videoList.forEach(item => {
              item.pause()
            })
            videoList.forEach(item => {
              if (activeVideo.contains(item.$el)) {
                item.init()
                item.play()
              }
            })
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.video-page {
  height: 100%;
  .swiper {
    height: 100%;
  }
}
</style>
