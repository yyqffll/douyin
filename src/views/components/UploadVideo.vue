<template>
  <PopModal
    v-model="show"
    title="上传视频"
    class="video-modal"
    :loading="loading"
    @on-ok="confrimUpload"
    @on-cancel="cancelUpload"
  >
    <template #content>
      <input ref="input" type="file" accept="video/*" title="点击上传视频" @change="onUploadFile" />
      <div class="video" v-show="uploadVideo">
        <video :src="uploadVideo" width="100%" height="100%" style="object-fit: fill;"></video>
        <div class="progress-bar">
          <div class="progress-bg">
            <div class="progress"></div>
          </div>
          <div class="num">0%</div>
        </div>
      </div>
      <div class="upload" v-show="!uploadVideo"></div>
    </template>
  </PopModal>
</template>

<script>
export default {
  name: 'UploadVideo',
  props: {
    value: {
      default: false,
      typeof: Boolean
    }
  },
  data () {
    return {
      show: this.value,
      loading: true,
      uploadVideo: false,
    }
  },
  methods: {
    changeLadoing () {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    onUploadFile (e) {
      const progressBar = document.querySelector('.progress-bar')
      const progress = document.querySelector('.progress')
      const num = document.querySelector('.num')
      progress.style.width = '0%'
      num.innerHTML = '0%'
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadstart = () => {
        this.uploadVideo = true
      }
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentLoaded = Math.round((e.loaded / e.total) * 100)
          progress.style.width = percentLoaded + '%'
          num.innerHTML = percentLoaded + '%'
        }
      }
      reader.onload = (e) => {
        progressBar.style.visibility = 'hidden'
        const blob = new Blob([file])
        this.uploadVideo = URL.createObjectURL(blob)
      }
      reader.readAsBinaryString(file)
      e.target.value = ''
    },
    confrimUpload () { },
    cancelUpload () { },
  },
  watch: {
    value (val) {
      this.show = val
    },
    show (val) {
      this.$emit('input', val)
    },
  }
}
</script>

<style lang="less" scoped>
.video-modal {
  /deep/.content {
    height: 500px;
    input {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 999;
      opacity: 0;
      cursor: pointer;
    }
    .video {
      z-index: 9999;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .progress-bar {
        width: 100%;
        display: flex;
        align-items: center;
        margin-top: 10px;
        .progress-bg {
          background: #7a7778;
          border-radius: 5px;
          flex: 1;
          height: 5px;
        }
        .progress {
          background: white;
          height: 100%;
          width: 5px;
          border-radius: 5px;
        }
        .num {
          width: 50px;
          text-align: right;
        }
      }
    }
    .upload {
      width: 100%;
      height: 100%;
      border: 1px dashed;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      &::before {
        content: '';
        display: inline-block;
        width: 100px;
        border: 1px dashed;
      }
      &::after {
        content: '';
        display: inline-block;
        height: 100px;
        border: 1px dashed;
        transform: translateX(-50px);
      }
    }
  }
}
</style>
