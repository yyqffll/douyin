<template>
  <div class="image-upload">
    <input ref="input" type="file" accept="image/*" title="点击上传图片" @change="onUploadFile" />
    <div class="img" v-if="uploadImg">
      <span class="delete" @click="deleteImg" title="删除" v-show="canDelete">
        <SvgIcon url="#icon-xiaoshanchu"></SvgIcon>
      </span>
      <vueCropper ref="cropper" :img="option.imgUrl" :autoCrop="autoCrop" :centerBox="centerBox" @realTime="realTime"></vueCropper>
    </div>
    <div class="upload" v-else></div>
  </div>
</template>

<script>
import { convert } from '@/libs/utils'
export default {
  name: 'ImageUpload',
  props: {
    value: {
      default: ''
    },
    canDelete: {
      default: true
    },
    autoCrop: {
      default: true
    },
    centerBox: {
      default: true,
    },
    imgUrl: {
      // 有值表示图片预览
      default: ''
    }
  },
  data () {
    return {
      uploadImg: false,
      defaultImgUrl: '',
      option: {
        imgName: '',
        imgType: '',
        imgUrl: '',
      },
    }
  },
  methods: {
    onUploadFile (event) {
      if (this.uploadImg) {
        return
      }
      const file = event.target.files[0]
      if (convert(file.size) > 10) {
        return this.$openNoticeModal({ msg: '文件不能超过10mb!' })
      }
      const reader = new FileReader()
      reader.onloadstart = () => {
        this.uploadImg = true
      }
      reader.onload = () => {
        const param = new FormData()
        param.append('file', file)
        this.$axios({
          url: '/api/img/upload',
          data: param
        }).then(res => {
          this.$emit('input', res.data.filename)
          this.option.imgName = res.data.filename
          this.option.imgType = res.data.mimetype
          this.option.imgUrl = URL.createObjectURL(file)
        }).catch(() => {
          this.uploadImg = false
        })
      }
      reader.readAsDataURL(file)
      event.target.value = ''
    },
    deleteImg () {
      if (this.defaultImgUrl) {
        this.uploadImg = false
        this.defaultImgUrl = ''
        this.option.imgName = ''
        this.option.imgUrl = ''
        this.$emit('input', '')
        return
      }
      if (!this.option.imgName) return
      this.$axios({
        url: 'api/img/delete',
        data: {
          imgName: this.option.imgName
        }
      }).then(() => {
        this.$emit('input', '')
        this.uploadImg = false
        Object.assign(this.option, {
          imgName: '',
          imgType: '',
          imgUrl: '',
        })
      })
    },
    realTime (data) {
      if (!data.url) return
      this.$refs.cropper.getCropBlob(data => {
        this.$emit('update:img', [data, this.option.imgType])
      })
    },
  },
  watch: {
    value: {
      handler (val) {
        this.option.imgName = val
        if (!val) {
          this.uploadImg = false
          this.option.imgUrl = ''
          this.option.imgType = ''
        }
      },
    },
    imgUrl: {
      handler (val) {
        if (val) {
          this.uploadImg = true
          this.defaultImgUrl = val
          this.option.imgUrl = val
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.image-upload {
  width: 100%;
  height: 100%;
  position: relative;
  input {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0;
    cursor: pointer;
  }
  .img {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 10;
    &:hover {
      .delete {
        visibility: visible;
        z-index: 10;
      }
    }
    .delete {
      visibility: hidden;
      position: absolute;
      top: -7px;
      right: -7px;
      cursor: pointer;
      background: @color-black-3;
      border-radius: 50%;
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
</style>
