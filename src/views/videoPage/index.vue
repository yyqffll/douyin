<template>
  <div ref="videoPage" class="video-page">
    <swiper :options="swiperOption" class="swiper" ref="swiper" v-if="videoLists.length > 0">
      <swiper-slide v-for="(item, index) in videoLists" :key="index">
        <VideoPlayer ref="video" :option="item"></VideoPlayer>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import VideoPlayer from '@/components/VideoPlayer'

import { bufferToUrl } from '@/libs/utils'

export default {
  name: 'videoPage',
  components: {
    swiper,
    swiperSlide,
    VideoPlayer
  },
  data () {
    return {
      videoLists: [],
      swiperOption: {
        direction: 'vertical',
        spaceBetween: 30,
        mousewheel: true,
        keyboard: {
          enabled: true
        },
        allowTouchMove: false,
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
      },
    }
  },
  mounted () {
    this.$axios({
      url: '/api/play/findAll',
      data: {
        length: this.videoLists.length
      }
    }).then(res => {
      res.data.forEach(item => {
        this.videoLists.push(Object.assign({}, item, {
          videoUrl: bufferToUrl(item.video.data),
          imgUrl: bufferToUrl(item.img.data)
        }))
      })
    })
  },
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
