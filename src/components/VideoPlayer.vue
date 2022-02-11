<template>
  <div class="video-player" ref="videoPlayer">
    <div class="video-container">
      <video width="100%" :src="option.src"></video>
    </div>
    <div ref="controls" class="controls">
      <div class="time-line">
        <div class="time-played"></div>
      </div>
      <div class="inner-controls">
        <div class="basic">
          <div class="button">
            <SvgIcon url="#icon-kaishi" @click="play" v-if="status === false"></SvgIcon>
            <SvgIcon url="#icon-zanting" @click="pause" v-else></SvgIcon>
          </div>
          <div class="time">
            <span>{{currentTime}}</span>
            <span>/</span>
            <span>{{durationTimer}}</span>
          </div>
        </div>
        <div class="other">
          <div class="loop">
            <span>自动连播</span>
            <button></button>
          </div>
          <div class="speed"></div>
          <div class="volume"></div>
          <div class="screen"></div>
        </div>
      </div>
    </div>
    <div class="video-player-bg">
      <img :src="option.img" alt />
    </div>
  </div>
</template>

<script>
import { mod } from '@/libs/utils'
export default {
  props: {
    option: {
      default: null,
      type: Object,
      require: true
    }
  },
  data () {
    return {
      status: false,
      playedWidth: 0,
      currentTime: 0,
      durationTimer: 0,
      timer: null
    }
  },
  computed: {
    videoPlayer () {
      return this.$refs.videoPlayer
    },
    video () {
      return this.videoPlayer.querySelector('video')
    }
  },
  mounted () {
  },
  methods: {
    played () {
      this.timer = setInterval(() => {
        this.playedWidth = mod(this.video.currentTime, this.video.duration) * 100
        const timePlayed = this.videoPlayer.querySelector('.time-played')
        timePlayed.style.width = this.playedWidth + '%'
        if (this.video.ended) {
          clearInterval(this.timer)
          this.playedWidth = 0
          timePlayed.style.width = 0
          this.status = false
        }
      }, 500)
    },
    init () {
      this.video.currentTime = 0
    },
    play () {
      this.video.play()
      this.played()
      this.status = true
    },
    pause () {
      this.video.pause()
      this.status = false
    },
    load () {
      this.video.load()
    },
    openVoice () {
      this.video.muted = false
    }
  }
}
</script>

<style lang="less" scoped>
.video-player {
  position: relative;
  width: 100%;
  height: 100%;
  .video-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    position: absolute;
    z-index: 999;
    video {
      width: 100%;
      transform: translateY(-30px);
    }
  }
  .video-player-bg {
    width: 100%;
    height: 100%;
    filter: blur(10px);
    img {
      width: 100%;
      height: 100%;
      opacity: 0.4;
    }
  }

  .controls {
    width: 100%;
    position: absolute;
    bottom: 0px;
    z-index: 999;
    .inner-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80px;
      .basic {
        display: inherit;
      }
    }
    .time-line {
      position: absolute;
      width: 100%;
      height: 2px;
      background: #7a7778;
      .time-played {
        height: 2px;
        background: white;
      }
    }
  }
}
</style>
