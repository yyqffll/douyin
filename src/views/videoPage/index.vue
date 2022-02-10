<template>
  <div class="video-page">
    <Swiper :swiperOption="swiperOption" :videoLists="videoLists">
      <template v-slot:content="{content}">
        <VideoPlayer :option="content"></VideoPlayer>
      </template>
    </Swiper>
  </div>
</template>

<script>
import Swiper from '@/components/Swiper'
import VideoPlayer from '@/components/VideoPlayer'
import video1 from '@/assets/1.mp4'
import video1Img from '@/assets/1.png'

export default {
  name: 'videoPage',
  components: {
    Swiper,
    VideoPlayer
  },
  data () {
    return {
      videoLists: [
        {
          src: video1,
          img: video1Img
        },
        {
          src: video1,
          img: video1Img
        }
      ],
      swiperOption: {
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 30,
        mousewheel: true,
        keyboard: {
          enabled: true
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
