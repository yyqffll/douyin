<template>
  <div class="video-player" ref="videoPlayer">
    <div class="video-player-container">
      <video :src="option.videoUrl"></video>
      <SvgIcon url="#icon-kaishi" fontSize="68" @click="setVideoStatus" v-if="videoStatus === false"></SvgIcon>
    </div>
    <div class="video-player-control">
      <div class="control-time-line" @click="setVideoTime($event, 'click')">
        <div class="time-line-played"></div>
        <div class="time-line-circle" @mousedown.left="setVideoTime($event, 'down')"></div>
      </div>
      <div class="control-controls">
        <div class="basic">
          <div class="play" @click="setVideoStatus">
            <SvgIcon id="kaishi" url="#icon-kaishi" v-if="videoStatus === false"></SvgIcon>
            <SvgIcon url="#icon-zanting" v-else></SvgIcon>
          </div>
          <div class="time">
            <span class="time-span">{{currentTime}}</span>
            <span>/</span>
            <span class="time-span">{{durationTimer}}</span>
          </div>
        </div>
        <div class="other">
          <div class="loop">
            <span>自动连播</span>
            <div
              :class="{'loop-button': true, 'loop-button-false': !videoLoop, 'loop-button-true': videoLoop}"
              @click="setVideoLoop"
            >
              <div class="cricle"></div>
            </div>
          </div>
          <div class="speed">
            <span>{{videoSpeed.label}}</span>
            <ul class="speed-selected">
              <li
                v-for="item in videoSpeedList"
                :key="item.value"
                :class="{'speed-is-selected': item.label === videoSpeed.label}"
                @click="setVideoSpeed(item)"
              >{{item.label}}</li>
            </ul>
          </div>
          <div class="voice">
            <SvgIcon
              :url="videoVoice ? '#icon-shengyin' : '#icon-jingyin'"
              fontSize="18"
              @click="setVideoVoice($event, 'svgClick')"
              @mouseover="setVideoVoice($event, 'move')"
            ></SvgIcon>
            <div class="voice-control">
              <span>{{voiceNum}}</span>
              <div class="voice-control-container" @click="setVideoVoice($event, 'click')">
                <div class="voice-control-bar"></div>
                <div class="voice-circle" @mousedown.left="setVideoVoice($event, 'down')"></div>
              </div>
            </div>
          </div>
          <div class="volume"></div>
          <div class="screen"></div>
        </div>
      </div>
    </div>
    <div class="video-player-bg">
      <img :src="option.imgUrl" alt />
    </div>
  </div>
</template>

<script>
import { mod, sTom } from '@/libs/utils'
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
      video: null,
      videoStatus: false,
      videoSpeed: {
        label: '',
        value: 0
      },
      videoSpeedList: [
        {
          label: '0.5x',
          value: 0.5
        },
        {
          label: '0.75x',
          value: 0.75
        },
        {
          label: '1.0x',
          value: 1
        },
        {
          label: '1.25x',
          value: 1.25
        },
        {
          label: '1.5x',
          value: 1.5
        },
        {
          label: '2.0x',
          value: 2
        }
      ],
      videoVoice: true,
      voiceNum: 100,
      voiceNumCash: 100,
      voiceDown: false,
      playedWidth: 0,
      currentTime: '00:00',
      durationTimer: sTom(this.option.videoDuration),
      timer: null,
      videoLoop: false,
    }
  },
  mounted () {
    this.video = this.$refs.videoPlayer.querySelector('video')
    const videoSpeed = this.video.defaultPlaybackRate.toString()
    this.videoSpeed.value = this.video.defaultPlaybackRate
    this.videoSpeed.label = videoSpeed.length > 1 ? videoSpeed + 'x' : videoSpeed + '.0x'
  },
  methods: {
    played () {
      this.timer = setInterval(() => {
        this.currentTime = sTom(Math.floor(this.video.currentTime))
        this.playedWidth = mod(this.video.currentTime.toFixed(3), this.option.videoDuration) * 100
        const container = this.$refs.videoPlayer.querySelector('.control-time-line')
        const bar = this.$refs.videoPlayer.querySelector('.time-line-played')
        const circle = this.$refs.videoPlayer.querySelector('.time-line-circle')
        bar.style.width = this.playedWidth + '%'
        circle.style.left = this.playedWidth / 100 * container.offsetWidth + 'px'
        if (this.video.ended) {
          clearInterval(this.timer)
          this.timer = null
          this.playedWidth = 0
          bar.style.width = 0
          this.videoStatus = false
          if (this.videoLoop) {
            this.play()
          }
        }
      }, 500)
    },
    init () {
      this.video.currentTime = 0
    },
    play () {
      this.videoStatus = true
      this.video.play()
      this.played()
    },
    pause () {
      this.videoStatus = false
      this.video.pause()
    },
    load () {
      this.video.load()
    },
    setVideoStatus () {
      this.videoStatus = !this.videoStatus
      if (this.videoStatus) {
        this.play()
      } else {
        this.pause()
      }
    },
    setVideoTime (event, type) {
      const container = this.$refs.videoPlayer.querySelector('.control-time-line')
      const bar = this.$refs.videoPlayer.querySelector('.time-line-played')
      const circle = this.$refs.videoPlayer.querySelector('.time-line-circle')
      if (type === 'click') {
        const x = mod(event.offsetX, container.offsetWidth)
        bar.style.width = x * 100 + '%'
        circle.style.left = event.offsetX + 'px'
        this.video.currentTime = x * this.option.videoDuration
        this.play()
      }
    },
    setVideoLoop () {
      this.videoLoop = !this.videoLoop
      if (this.videoLoop && this.video.ended) {
        this.play()
      }
    },
    setVideoSpeed (item) {
      this.videoSpeed = item
      this.video.playbackRate = item.value
    },
    setVideoVoice (event, type) {
      const container = this.$refs.videoPlayer.querySelector('.voice-control-container')
      const bar = this.$refs.videoPlayer.querySelector('.voice-control-bar')
      const circle = this.$refs.videoPlayer.querySelector('.voice-circle')
      if (type === 'svgClick') {
        this.videoVoice = !this.videoVoice
        if (!this.videoVoice) {
          this.voiceNumCash = this.voiceNum
          this.voiceNum = 0
        } else {
          this.voiceNum = this.voiceNumCash
        }
      }
      if (type === 'move') {
        if (this.voiceDown) {
          this.voiceDown = false
          return
        }
      }
      if (type === 'click') {
        if (this.voiceDown) {
          this.voiceDown = false
          return
        }
        if (event.target === container) {
          this.voiceNum = Math.floor(100 - mod(event.offsetY, event.target.clientHeight) * 100)
        } else if (event.target === bar) {
          this.voiceNum = Math.floor(this.voiceNum * (1 - mod(event.offsetY, event.target.clientHeight)))
        }
        this.videoVoice = true
      }
      if (type === 'down') {
        this.voiceDown = true
        const v = this.voiceNum
        const move = (e) => {
          const y = e.clientY - event.clientY
          const absY = Math.abs(y)
          const absYv = Math.floor(mod(absY, container.offsetHeight) * 100)
          if (y >= 0) {
            this.voiceNum = v - absYv < 0 ? 0 : v - absYv
          } else {
            this.voiceNum = v + absYv > 100 ? 100 : v + absYv
          }
          bar.style.height = this.voiceNum + '%'
          const bottom = Math.floor(container.offsetHeight * (this.voiceNum / 100))
          circle.style.bottom = `${bottom + circle.offsetHeight >= container.offsetHeight ? container.offsetHeight - circle.offsetHeight : bottom}px`
          this.video.volume = this.voiceNum / 100
        }
        document.addEventListener('mousemove', move)
        document.onmouseup = (e) => {
          document.removeEventListener('mousemove', move)
          document.onmouseup = null
        }
      }
      bar.style.height = this.voiceNum + '%'
      const bottom = Math.floor(container.offsetHeight * (this.voiceNum / 100))
      circle.style.bottom = `${bottom + circle.offsetHeight >= container.offsetHeight ? container.offsetHeight - circle.offsetHeight : bottom}px`
      this.video.volume = this.voiceNum / 100
    }
  }
}
</script>

<style lang="less" scoped>
.video-player {
  position: relative;
  width: 100%;
  height: 100%;
  .video-player-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 9;
    video {
      width: 100%;
      height: calc(100% - 80px);
      transform: translateY(-30px);
    }
    svg {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      cursor: pointer;
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

  .video-player-control {
    width: 100%;
    position: absolute;
    bottom: 40px;
    z-index: 99;
    .control-time-line {
      position: absolute;
      width: 100%;
      height: 2px;
      background: @color-font-basic;
      &:hover {
        height: 5px;
        .time-line-circle {
          visibility: visible;
        }
      }
      .time-line-played {
        width: 0%;
        height: 100%;
        background: white;
      }
      .time-line-circle {
        visibility: hidden;
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0;
        margin: auto;
        width: 8px;
        height: 8px;
        background: @color-white-1;
        border-radius: 50%;
      }
    }
    .control-controls {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      opacity: 0.7;
      font-size: 14px;
      padding: 0 20px;
      &:hover {
        opacity: 1;
        color: @color-white-1;
      }
      .basic {
        display: flex;
        .play {
          margin-right: 5px;
          cursor: pointer;
        }
        .time {
          .time-span {
            display: inline-block;
            width: 50px;
            text-align: center;
          }
        }
      }
      .other {
        display: flex;
        .loop {
          display: flex;
          margin-right: 10px;
          .loop-button {
            width: 30px;
            box-sizing: border-box;
            border-radius: 25px;
            margin-left: 5px;
            display: flex;
            align-items: center;
            position: relative;
            cursor: pointer;
            .cricle {
              background: @color-white-1;
              width: 15px;
              height: 15px;
              border-radius: 50%;
              position: absolute;
            }
          }
          .loop-button-false {
            background: @color-font-basic;
            .cricle {
              left: 3px;
            }
          }
          .loop-button-true {
            background: @color-red-1;
            .cricle {
              right: 3px;
            }
          }
        }
        .speed {
          cursor: pointer;
          position: relative;
          width: 60px;
          text-align: center;
          &:hover {
            .speed-selected {
              visibility: visible;
            }
          }
          .speed-selected {
            visibility: hidden;
            box-sizing: border-box;
            position: absolute;
            bottom: 20px;
            background: @color-black-3;
            list-style: none;
            width: 60px;
            height: 180px;
            border-radius: 5px;
            padding: 5px 0;
            display: flex;
            flex-direction: column;
            li {
              flex: 1;
              font-size: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              &:hover {
                color: @color-red-1;
              }
            }
            .speed-is-selected {
              color: @color-red-1;
              font-weight: 600;
            }
          }
        }
        .voice {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 40px;
          font-size: 12px;
          &:hover {
            .voice-control {
              visibility: visible;
            }
          }
          svg {
            font-size: 16px;
          }
          .voice-control {
            z-index: 999;
            visibility: hidden;
            position: absolute;
            bottom: 20px;
            width: 100%;
            height: 180px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background: @color-black-2-2;
            border-radius: 5px;
            span {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 25px;
              background: @color-black-3;
              border-top-left-radius: 5px;
              border-top-right-radius: 5px;
            }
            .voice-control-container {
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: flex-end;
              width: 5px;
              background: @color-font-basic;
              border-radius: 5px;
              margin: 15px 0;
              position: relative;
              .voice-control-bar {
                width: 100%;
                background: @color-red-1;
                display: flex;
                justify-content: center;
                border-bottom-left-radius: 5px;
                border-bottom-right-radius: 5px;
              }
              .voice-circle {
                position: absolute;
                bottom: 0;
                width: 8px;
                height: 8px;
                background: @color-white-1;
                border-radius: 50%;
              }
            }
          }
        }
      }
    }
  }
}
@media (min-width: 1240px) {
  .video-player {
    .video-player-container {
      video {
        width: 80%;
      }
    }
  }
}
</style>
