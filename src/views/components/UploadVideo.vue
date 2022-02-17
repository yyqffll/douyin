<template>
  <PopModal
    id="uploadVideoModal"
    v-model="show"
    title="上传视频"
    class="video-modal"
    width="1280"
    :loading="loading"
    @on-ok="confrimUpload"
    @on-cancel="cancelUpload"
  >
    <template #content>
      <div class="video">
        <div class="video-container">
          <input class="video-upload-input" type="file" accept="video/*" @change="onUploadVideo" />
          <div class="video-upload-btn" v-show="!uploadVideo">
            <SvgIcon url="#icon-shangchuan" fontSize="36"></SvgIcon>
            <span>点击上传视频</span>
            <span style="font-size: 14px; margin-top: 10px;">文件大小不能超过50mb</span>
          </div>
          <div class="video-content" v-show="uploadVideo">
            <div class="video-upload">
              <video ref="uploadVideo" :src="videoUrl" width="100%" height="100%" style="object-fit: fill;"></video>
              <div class="video-play-btn" @click="videoPreview">
                <template v-if="!editLoaing">
                  <SvgIcon url="#icon-bofang" fontSize="40" v-if="!played"></SvgIcon>
                  <SvgIcon url="#icon-zanting1" fontSize="40" v-else></SvgIcon>
                </template>
                <SvgIcon url="#icon-loading" class="icon-loaing" fontSize="40" v-else></SvgIcon>
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-bg">
                <div class="progress"></div>
              </div>
              <div class="num">0%</div>
            </div>
            <div class="edit-bar">
              <span class="time">{{editSTime}}</span>
              <div class="edit-bg">
                <div id="huakuaiS" @mousedown="hkDown($event, 'S')">
                  <SvgIcon url="#icon-huakuaiS" fontSize="20"></SvgIcon>
                </div>
                <div id="huakuaiE" @mousedown="hkDown($event, 'E')" style="transform:scaleX(-1);">
                  <SvgIcon url="#icon-huakuaiS" fontSize="20"></SvgIcon>
                </div>
              </div>
              <span class="time">{{editETime}}</span>
            </div>
          </div>
        </div>
        <div class="video-control">
          <div @click="videoReUpload">重新上传</div>
          <div @click="videoEdit">
            <span>{{editStatus ? '取消剪辑' : '剪辑'}}</span>
          </div>
          <div @click="videoConfirmEdit" class="video-confirm-edit-btn">
            <span>{{editLoaing ? '剪辑中' : '确认剪辑'}}</span>
            <SvgIcon url="#icon-loading" v-if="editLoaing"></SvgIcon>
          </div>
          <div @click="videoReEdit">重新剪辑</div>
        </div>
      </div>
      <div class="img">
        <input ref="input" type="file" accept="image/*" @change="onUploadImg" />
        <div class="upload" v-show="!uploadImg"></div>
        <div class="upload-img" v-show="uploadImg">
          <span class="delete" @click="deleteImg" title="删除">
            <SvgIcon url="#icon-xiaoshanchu"></SvgIcon>
          </span>
          <img :src="params.img" width="100%" height="100%" />
        </div>
      </div>
    </template>
  </PopModal>
</template>

<script>
import { convert, sTom } from '@/libs/utils'
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
      video: '', // 上传的视频文件
      videoName: '', // 服务端存储的文件名
      videoType: '', // 文件类型
      videoUrl: '',
      played: false,
      editStatus: false,
      editLoaing: false,

      uploadImg: false,
      editSTime: '00:00',
      editETime: '',
      params: {
        videoId: '',
        name: '',
        duration: 0,
        img: '',
      }
    }
  },
  computed: {
    uploadVideoModal () {
      return document.querySelector('#uploadVideoModal')
    }
  },
  mounted () {
    this.uploadVideoModal.addEventListener('mouseover', () => { })
  },
  destroyed () {
    this.uploadVideoModal.removeEventListener('mouseover')
  },
  methods: {
    changeLadoing () {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },

    onUploadVideo (event) {
      const progressBar = document.querySelector('.progress-bar')
      const progress = document.querySelector('.progress')
      const num = document.querySelector('.num')
      progressBar.style.display = 'flex'
      progress.style.width = '0%'
      num.innerHTML = '0%'
      const file = event.target.files[0]
      if (convert(file.size) > 50) {
        return this.$openNoticeModal({ msg: '文件不能超过50mb' })
      }
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
        progressBar.style.display = 'none'
        const param = new FormData()
        param.append('file', file)
        this.$axios({
          url: '/api/play/upload',
          data: param
        }).then(res => {
          this.video = file
          this.videoName = res.data.filename
          this.videoType = res.data.mimetype.split('/')[1]
          this.videoUrl = URL.createObjectURL(file)
          this.$nextTick(() => {
            this.resetEdit()
          })
        }).catch(() => {
          this.uploadVideo = false
        })
      }
      reader.readAsBinaryString(file)
      event.target.value = ''
    },
    videoReUpload () {
      this.$axios({
        url: '/api/play/delete',
        data: {
          videoName: this.videoName,
          videoType: this.videoType,
        }
      }).then(res => {
        this.uploadVideo = false
        this.video = ''
        this.videoUrl = ''
      })
    },
    videoPreview () {
      const uploadVideo = this.$refs.uploadVideo
      if (this.played) {
        uploadVideo.pause()
        this.played = false
      } else {
        uploadVideo.play()
        this.played = true
      }
    },

    resetEdit () {
      const uploadVideo = this.$refs.uploadVideo
      uploadVideo.oncanplay = () => {
        this.params.duration = uploadVideo.duration
        this.editSTime = '00:00'
        this.editETime = sTom(uploadVideo.duration)
      }
    },
    videoEdit () {
      if (!this.uploadVideo) {
        return
      }
      this.editStatus = !this.editStatus
      const div = document.querySelector('.edit-bar')

      if (this.editStatus) {
        const divBar = document.querySelector('.edit-bg')
        const divS = document.querySelector('#huakuaiS')
        const divE = document.querySelector('#huakuaiE')
        div.style.display = 'flex'
        divS.style.left = '0px'
        divE.style.left = divBar.offsetWidth - divE.offsetWidth + 'px'
        this.resetEdit()
      } else {
        div.style.display = 'none'
      }
    },
    async videoConfirmEdit () {
      if (!this.uploadVideo || this.editLoaing) {
        return
      }
      this.editLoaing = true
      this.$axios({
        url: '/api/play/cut',
        data: {
          videoName: this.videoName,
          videoType: this.videoType,
          startTime: '00:' + this.editSTime,
          endTime: '00:' + this.editETime
        }
      }).then(res => {
        this.editLoaing = false
        const div = document.querySelector('.edit-bar')
        div.style.display = 'none'
        const arrayBuffer = Buffer.from(res.data.video.data, 'binary')
        const blob = new Blob([arrayBuffer])
        this.videoUrl = URL.createObjectURL(blob)
      }).catch(() => {
        this.editLoaing = false
      })
    },
    videoReEdit () {
      if (!this.uploadVideo) {
        return
      }
      const div = document.querySelector('.edit-bar')
      div.style.display = 'none'
      this.videoUrl = URL.createObjectURL(this.video)
    },
    hkDown (e, type) {
      const divBar = document.querySelector('.edit-bg')
      const divS = document.querySelector('#huakuaiS')
      const divE = document.querySelector('#huakuaiE')
      const dom = e.target
      const barWidth = parseInt(divBar.offsetWidth)
      const Width = parseInt(divS.offsetWidth)
      let fDom, fPosition, bDom, bPosition, x
      if (dom.nodeName === 'use') {
        if (divS.contains(dom)) {
          // 点击了huakuaiS
          fDom = divS
          bDom = divE
        } else {
          // 点击了huakuaiE
          fDom = divE
          bDom = divS
        }
        fPosition = parseInt(fDom.offsetLeft)
        bPosition = parseInt(bDom.offsetLeft)
        document.onmousemove = (event) => {
          x = e.clientX - event.clientX
          const moveX = fPosition - x
          if (type === 'S') {
            fDom.style.left = (moveX < 0 ? 0 : moveX + Width < bPosition ? moveX : bPosition - Width) + 'px'
            this.editSTime = sTom(parseInt(fDom.style.left) / barWidth * this.params.duration)
          } else {
            fDom.style.left = (moveX < bPosition + Width ? bPosition + Width : moveX > barWidth - Width ? barWidth - Width : moveX) + 'px'
            this.editETime = sTom((parseInt(fDom.style.left) + Width) / barWidth * this.params.duration)
          }
        }
        document.onmouseup = () => {
          document.onmousemove = null
          document.onmouseup = null
          return false
        }
      }
    },

    onUploadImg (e) {
      const file = e.target.files[0]
      const filesize = file.size
      if (convert(filesize) > 10) {
        this.$openNoticeModal({ msg: '请上传10mb大小以内的图片!' })
      } else {
        const reader = new FileReader()
        reader.onloadstart = () => {
          this.uploadImg = true
        }
        reader.onloadend = (e) => {
          this.params.img = e.target.result
        }
        reader.readAsDataURL(file)
      }
      e.target.value = ''
    },
    deleteImg () { },
    confrimUpload () { },
    cancelUpload () {
      this.show = false
    },
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
    height: 600px;
    .video {
      width: 40%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .video-container,
      .video-control {
        width: 75%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .video-container {
        position: relative;
        .video-upload-input,
        .video-upload-btn,
        .video-content {
          width: 100%;
          height: 400px;
        }
        .video-upload-btn,
        .video-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .video-upload-input {
          position: absolute;
          z-index: 1;
          opacity: 0;
          cursor: pointer;
        }
        .video-upload-btn {
          border: 1px dashed;
        }
        .video-content {
          z-index: 10;
          .video-upload {
            width: 100%;
            height: 100%;
            position: relative;
            .video-play-btn {
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              z-index: 100;
              display: flex;
              justify-content: center;
              align-items: center;
              opacity: 0.2;
              svg {
                color: @color-black-2;
              }
              .icon-loaing {
                animation: rotate 1s infinite;
              }
              &:hover {
                cursor: pointer;
                opacity: 1;
                background: @color-black-3;
              }
            }
          }
          .progress-bar {
            width: 100%;
            height: 20px;
            align-items: center;
            margin-top: 5px;
            .progress-bg {
              width: 100%;
              background: @color-font-basic;
              border-radius: 5px;
              height: 5px;
            }
            .progress {
              background: white;
              height: 100%;
              border-radius: 5px;
            }
            .num {
              width: 50px;
              text-align: right;
            }
          }
          .edit-bar {
            width: 100%;
            height: 20px;
            display: none;
            align-items: center;
            margin-top: 5px;
            position: relative;
            .time {
              width: 50px;
              overflow: hidden;
              text-align: center;
            }
            .edit-bg {
              flex: 1;
              background: @color-font-basic;
              border-radius: 5px;
              height: 5px;
              position: relative;
              margin: 0 5px;
              div {
                position: absolute;
                display: flex;
                justify-content: center;
                align-items: center;
                top: -7px;
                use {
                  &:hover {
                    cursor: pointer;
                    color: @color-white;
                  }
                }
              }
            }
          }
        }
      }
      .video-control {
        margin-top: 20px;
        div {
          cursor: pointer;
          flex: 1;
          height: 50px;
          background: @color-red;
          border-radius: 5px;
          text-align: center;
          line-height: 50px;
          font-size: 14px;
          &:not(:last-child) {
            margin-right: 20px;
          }
          &:hover {
            color: @color-white;
          }
        }
        .video-confirm-edit-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          svg {
            animation: rotate 1s infinite;
          }
        }
      }
    }
    .img {
      display: flex;
      position: relative;
      height: 100%;
      flex: 1;
      input {
        width: 75%;
        height: 400px;
        position: absolute;
        z-index: 1;
        opacity: 0;
        cursor: pointer;
      }
      .upload-img {
        width: 200px;
        height: 100%;
        position: relative;
        &:hover {
          .delete {
            visibility: visible;
          }
        }
        .delete {
          visibility: hidden;
          position: absolute;
          top: -7px;
          right: -7px;
          cursor: pointer;
          background: @color-modal-2;
          border-radius: 50%;
        }
      }
    }
  }
}
@keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
</style>
