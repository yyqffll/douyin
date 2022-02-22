<template>
  <PopModal
    id="uploadVideoModal"
    v-model="show"
    title="发布视频"
    class="video-modal"
    width="1200"
    :loading="loading"
    @on-ok="confrimUpload"
    @on-cancel="cancelUpload"
  >
    <template #content>
      <div class="video">
        <div class="video-container">
          <input class="video-upload-input" type="file" accept="video/*" @change="videoUpload" />
          <div class="video-upload-btn" v-show="!uploadVideo">
            <SvgIcon url="#icon-shangchuan" fontSize="36"></SvgIcon>
            <span>点击上传视频</span>
            <span style="font-size: 14px; margin-top: 10px;">文件大小不能超过50mb</span>
          </div>
          <div class="video-content" v-show="uploadVideo">
            <div class="video-upload">
              <video ref="uploadVideo" :src="videoUrl"></video>
              <div class="video-play-btn" @click="onVideoPreview">
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
                <div id="huakuaiS" @mousedown.left="hkDown($event, 'S')">
                  <SvgIcon url="#icon-huakuaiS" fontSize="20"></SvgIcon>
                </div>
                <div id="huakuaiE" @mousedown.left="hkDown($event, 'E')" style="transform:scaleX(-1);">
                  <SvgIcon url="#icon-huakuaiS" fontSize="20"></SvgIcon>
                </div>
              </div>
              <span class="time">{{editETime}}</span>
            </div>
          </div>
        </div>
        <div :class="{'video-control': true, 'video-control-disabled': !uploadVideo}">
          <div @click="onVideoReUpload">重新上传</div>
          <div @click="onVideoEdit">
            <span>{{editStatus ? '取消剪辑' : '剪辑'}}</span>
          </div>
          <div @click="videoConfirmEdit" class="video-confirm-edit-btn">
            <span>{{editLoaing ? '剪辑中' : '确认剪辑'}}</span>
            <SvgIcon url="#icon-loading" v-if="editLoaing"></SvgIcon>
          </div>
          <div @click="onVideoReEdit">重新剪辑</div>
        </div>
      </div>
      <div class="video-inf">
        <div class="img">
          <p class="title">设置封面</p>
          <div class="img-container">
            <div class="img-container-img">
              <div v-if="!imgUrl">封面</div>
              <img v-else :src="imgUrl" width="100%" height="100%" />
            </div>
            <div class="img-container-control">
              <div @click="onImgReUpload('上传封面')" v-if="imgName">重新上传</div>
              <div @click="onImgUpload('上传封面')" v-else>上传封面</div>
              <div @click="onImgEdit('编辑封面')">编辑封面</div>
            </div>
          </div>
        </div>
        <div class="describe">
          <p class="title">视频描述</p>
          <div class="describe-container">
            <textarea maxlength="100" @input="imgDesChange" v-model="videoDescribe"></textarea>
            <div class="describe-count">
              <span>{{desMin}}</span>
              <span>/</span>
              <span>{{desMax}}</span>
            </div>
          </div>
          <div class="describe-control">
            <p>
              #
              <span>添加话题</span>
            </p>
            <p>
              @
              <span>好友</span>
            </p>
          </div>
        </div>
        <div class="download">
          <p class="title">允许他人保存视频</p>
          <div class="download-control">
            <div :class="{'download-click': videoDownload}" @click="() => videoDownload = true">
              <SvgIcon :url="videoDownload ? '#icon-selected' : '#icon-noselected'"></SvgIcon>
              <span>允许</span>
            </div>
            <div :class="{'download-click': !videoDownload}" @click="() => videoDownload = false">
              <SvgIcon :url="videoDownload ? '#icon-noselected' : '#icon-selected'"></SvgIcon>
              <span>不允许</span>
            </div>
          </div>
        </div>
        <div class="open">
          <p class="title">是否公开发布</p>
          <div class="open-control">
            <div :class="{'open-click': videoOpen}" @click="() => videoOpen = true">
              <SvgIcon :url="videoOpen ? '#icon-selected' : '#icon-noselected'"></SvgIcon>
              <span>公开</span>
            </div>
            <div :class="{'open-click': !videoOpen}" @click="() => videoOpen = false">
              <SvgIcon :url="videoOpen ? '#icon-noselected' : '#icon-selected'"></SvgIcon>
              <span>不公开</span>
            </div>
          </div>
        </div>
        <div class="img-control" v-if="needImgControl">
          <p>{{imgControlType}}</p>
          <ImageUpload v-model="imgName" :img.sync="img" :canDelete="imgControlDelete" :imgUrl="imgUrlDefault"></ImageUpload>
          <div class="img-control-btn">
            <div @click="imgConfrimDo">确定</div>
            <div @click="imgCancelDo">取消</div>
          </div>
        </div>
      </div>
    </template>
  </PopModal>
</template>

<script>
import ImageUpload from '_c/ImageUpload'
import { convert, sTom } from '@/libs/utils'
export default {
  name: 'UploadVideo',
  components: {
    ImageUpload
  },
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
      played: false,
      editStatus: false,
      editLoaing: false,
      video: '', // 上传的视频文件
      videoName: '', // 服务端存储的视频名
      videoType: '', // 文件类型
      videoUrl: '',
      videoDuration: 0,
      editSTime: '00:00',
      editETime: '',

      needImgControl: false,
      imgControlType: false,
      imgControlDelete: true,
      img: [],
      imgName: '', // 服务端存储的图片名
      imgUrl: '',
      imgUrlDefault: '',
      videoDescribe: '',
      videoDownload: false,
      videoOpen: true,
      desMin: 0,
      desMax: 100,

      params: {
        userId: '',
        videoName: '',
        videoType: '',
        videoDuration: 0,
        videoImgName: '',
        videoDescribe: '',
        videoDownload: false,
        videoOpen: true,
        videoLikeNum: 0,
        videoCollectNum: 0
      }
    }
  },
  computed: {
    uploadVideoModal () {
      return document.querySelector('#uploadVideoModal')
    }
  },
  mounted () {
    this.uploadVideoModal.addEventListener('mouseover', this.mouseover)
  },
  beforeDestroy () {
    this.uploadVideoModal.removeEventListener('mouseover', this.mouseover)
  },
  methods: {
    mouseover () { },
    changeLadoing () {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },

    videoUpload (event) {
      const progressBar = document.querySelector('.progress-bar')
      const progress = document.querySelector('.progress')
      const num = document.querySelector('.num')
      progressBar.style.display = 'flex'
      progress.style.width = '0%'
      num.innerHTML = '0%'
      const file = event.target.files[0]
      if (convert(file.size) > 50) {
        return this.$openNoticeModal({ msg: '文件不能超过50mb!' })
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
    onVideoReUpload () {
      if (!this.uploadVideo) return
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
        this.videoName = ''
        this.videoType = ''
      })
    },
    onVideoPreview () {
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
        this.videoDuration = uploadVideo.duration
        this.editSTime = '00:00'
        this.editETime = sTom(uploadVideo.duration)
      }
    },
    onVideoEdit () {
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
      if (!this.editStatus) {
        this.onVideoEdit()
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
        this.editStatus = false
        const div = document.querySelector('.edit-bar')
        div.style.display = 'none'
        const arrayBuffer = Buffer.from(res.data.video.data, 'binary')
        const blob = new Blob([arrayBuffer])
        this.videoUrl = URL.createObjectURL(blob)
        this.videoName = res.data.videoName
      }).catch(() => {
        this.editLoaing = false
      })
    },
    onVideoReEdit () {
      if (!this.uploadVideo) {
        return
      }

      this.$axios({
        url: '/api/play/deleteEdit',
        data: {
          videoName: this.videoName.replace(`-edit.${this.videoType}`, ''),
          videoType: this.videoType,
        }
      }).then(res => {
        const div = document.querySelector('.edit-bar')
        div.style.display = 'none'
        this.editStatus = false
        this.videoUrl = URL.createObjectURL(this.video)
        this.videoName = res.data.videoName
      })
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
        const move = (event) => {
          x = e.clientX - event.clientX
          const moveX = fPosition - x
          if (type === 'S') {
            fDom.style.left = (moveX < 0 ? 0 : moveX + Width < bPosition ? moveX : bPosition - Width) + 'px'
            this.editSTime = sTom(parseInt(fDom.style.left) / barWidth * this.videoDuration)
          } else {
            fDom.style.left = (moveX < bPosition + Width ? bPosition + Width : moveX > barWidth - Width ? barWidth - Width : moveX) + 'px'
            this.editETime = sTom((parseInt(fDom.style.left) + Width) / barWidth * this.videoDuration)
          }
        }
        document.addEventListener('mousemove', move)
        document.onmouseup = () => {
          document.removeEventListener('mousemove', move)
          document.onmouseup = null
          return false
        }
      }
    },

    closeImgContaol () {
      this.needImgControl = false
      this.imgUrlDefault = ''
      this.imgControlType = ''
    },
    async deleteImg () {
      await this.$axios({
        url: '/api/img/delete',
        data: {
          imgName: this.imgName
        }
      }).then(() => {
        this.imgName = ''
        this.imgUrl = ''
        this.img = []
      })
    },
    onImgReUpload (type) {
      this.deleteImg()
      this.onImgUpload(type)
    },
    onImgUpload (type) {
      this.needImgControl = true
      this.imgControlType = type
      this.imgControlDelete = true
    },
    onImgEdit (type) {
      this.needImgControl = true
      this.imgControlType = type
      this.imgControlDelete = false
      this.imgUrlDefault = this.imgUrl
    },
    imgConfrimDo () {
      if (!this.imgName) {
        this.$openNoticeModal({
          msg: '请先上传图片!'
        })
        return
      }
      if (this.imgControlType === '编辑封面') {
        const file = new File([this.img[0]], this.imgName, { type: this.img[1] })
        const param = new FormData()
        param.append('file', file)
        this.$axios({
          url: '/api/img/upload',
          data: param,
        }).then(res => {
          this.imgName = res.data.filename
        })
      }
      this.imgUrl = URL.createObjectURL(this.img[0])
      this.closeImgContaol()
    },
    async imgCancelDo () {
      if (this.imgControlType === '上传封面' && this.imgName) {
        await this.deleteImg()
      }
      this.closeImgContaol()
    },
    imgDesChange () {
      if (this.videoDescribe.length > 100) {
        this.videoDescribe = this.videoDescribe.subString(0, 99)
      }
      this.desMin = this.videoDescribe.length
    },

    closeModal () {
      this.show = false
      this.uploadVideo = false
      this.played = false
      this.editStatus = false
      this.editLoaing = false
      this.video = ''
      this.videoName = ''
      this.videoType = ''
      this.videoUrl = ''
      this.videoDuration = 0
      this.editSTime = '00:00'
      this.editETime = ''
      this.needImgControl = false
      this.imgControlType = false
      this.imgControlDelete = true
      this.img = []
      this.imgName = ''
      this.imgUrl = ''
      this.imgUrlDefault = ''
      this.videoDescribe = ''
      this.videoDownload = false
      this.videoOpen = true
      this.desMin = 0
      this.desMax = 100
      this.params = {
        userId: '',
        videoName: '',
        videoType: '',
        videoDuration: 0,
        videoImgName: '',
        videoDescribe: '',
        videoDownload: false,
        videoOpen: true,
        videoLikeNum: 0,
        videoCollectNum: 0
      }
    },
    confrimUpload () {
      if (!this.videoName) {
        this.$openNoticeModal({ msg: '请上传视频!' })
        this.changeLadoing()
        return
      }
      if (!this.imgName) {
        this.$openNoticeModal({ msg: '请上传视频封面' })
        this.changeLadoing()
        return
      }
      if (!this.videoDescribe) {
        this.$openNoticeModal({ msg: '请输入视频描述' })
        this.changeLadoing()
        return
      }
      const params = Object.assign({}, this.params, {
        userId: this.$store.state?.userId,
        videoName: this.videoName,
        videoType: this.videoType,
        videoDuration: this.videoDuration,
        videoImgName: this.imgName,
        videoDescribe: this.videoDescribe,
        videoDownload: this.videoDownload,
        videoOpen: this.videoOpen,
        videoLikeNum: this.videoLikeNum,
        videoCollectNum: this.videoCollectNum
      })
      this.$axios({
        url: '/api/play/add',
        data: params
      }).then(res => {
        this.closeModal()
        this.$openNoticeModal({
          msg: res.msg
        })
      })
    },
    cancelUpload () {
      if (this.videoName) {
        this.$axios({
          url: '/api/play/delete',
          data: {
            videoName: this.videoName.replace(`-edit.${this.videoType}`, ''),
            videoType: this.videoType
          }
        })
      }
      if (this.imgName) {
        this.$axios({
          url: '/api/img/delete',
          data: {
            imgName: this.imgName
          }
        })
      }
      this.closeModal()
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
      width: 60%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 20px;
      .video-container,
      .video-control {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .video-container {
        position: relative;
        height: calc(100% - 70px);
        .video-upload-input,
        .video-upload-btn,
        .video-content {
          width: 100%;
          height: 100%;
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
            display: flex;
            align-items: center;
            justify-content: center;
            video {
              height: 100%;
            }
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
                background: @color-black-1-2;
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
                    color: @color-white-1;
                  }
                }
              }
            }
          }
        }
      }
      .video-control {
        margin-top: 20px;
        height: 50px;
        div {
          cursor: pointer;
          flex: 1;
          height: 50px;
          background: @color-red-2;
          border-radius: 5px;
          text-align: center;
          line-height: 50px;
          font-size: 14px;
          &:not(:last-child) {
            margin-right: 20px;
          }
          &:hover {
            color: @color-white-1;
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
      .video-control-disabled {
        div {
          cursor: not-allowed;
        }
      }
    }
    .video-inf {
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
      flex: 1;
      .title {
        margin-bottom: 10px;
        color: @color-white-1;
      }
      .img {
        .img-container {
          display: flex;
          height: 120px;
          display: flex;
          align-items: center;
          .img-container-img {
            width: 100px;
            height: 100px;
            border: 1px solid @color-font-basic;
            div {
              text-align: center;
              line-height: 100px;
            }
          }
          .img-container-control {
            height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            margin-left: 10px;
            div {
              cursor: pointer;
              width: 80px;
              height: 40px;
              background: @color-red-2;
              border-radius: 5px;
              text-align: center;
              line-height: 40px;
              font-size: 14px;
              &:hover {
                color: @color-white-1;
              }
            }
          }
        }
      }
      .describe {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        .describe-container {
          position: relative;
          textarea {
            box-sizing: border-box;
            width: 100%;
            height: 120px;
            padding: 10px 30px 10px 10px;
            resize: none;
            overflow-y: auto;
            background: @color-black-3;
            color: @color-font-basic;
            font-size: 16px;
            position: relative;
            white-space: break-spaces;
          }
          .describe-count {
            position: absolute;
            bottom: 10px;
            right: 15px;
          }
        }
        .describe-control {
          display: flex;
          p {
            padding: 5px 10px;
            background: @color-black-2-2;
            cursor: pointer;
            &:first-child {
              margin-right: 20px;
            }
          }
        }
      }
      .download,
      .open {
        margin-bottom: 10px;
        .download-control,
        .open-control {
          display: flex;
          div {
            cursor: pointer;
            width: 100px;
            svg {
              margin-right: 5px;
            }
          }
          .download-click,
          .open-click {
            color: @color-red-2;
          }
        }
      }
      .img-control {
        position: absolute;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: @color-black-3;
        .image-upload {
          margin: 20px 0;
          flex: 1;
        }
        .img-control-btn {
          display: flex;
          div {
            &:first-child {
              margin-right: 20px;
            }
            cursor: pointer;
            width: 80px;
            height: 50px;
            background: @color-red-2;
            border-radius: 5px;
            text-align: center;
            line-height: 50px;
            font-size: 14px;
            &:hover {
              color: @color-white-1;
            }
          }
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
