<template>
  <div class="video-player">
    <div class="video-container">
      <video width="100%" :autoplay="false" :src="option.src"></video>
    </div>
    <div class="controls">
      <div class="time-line">shijianxian</div>
      <div class="inner-controls">
        <div class="basic">
          <button>开始</button>
          <div class="time">
            <span></span>
            <span>/</span>
            <span></span>
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
export default {
  props: {
    option: {
      default: null,
      type: Object,
      require: true
    }
  }
}
</script>

<style lang="less" scoped>
.video-player {
  position: relative;
  .video-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    z-index: 999;
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
    bottom: 0;
    z-index: 999;
    .time-line {
      position: absolute;
    }
    .inner-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80px;
      .basic {
        display: inherit;
      }
    }
  }
}
</style>
