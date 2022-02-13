<template>
  <PopModal
    v-model="show"
    title="上传头像"
    class="head-modal"
    :loading="loading"
    @on-ok="confrimUpload"
    @on-cancel="cancelUpload"
  >
    <template #content>
      <input ref="input" type="file" accept="image/*" title="点击上传图片" @change="onUploadFile" />
      <div class="img" v-if="option.uploadImg">
        <span class="delete" @click="deleteImg" title="删除">
          <SvgIcon url="#icon-xiaoshanchu"></SvgIcon>
        </span>
        <vueCropper ref="cropper" :img="option.uploadImg" :autoCrop="option.autoCrop" :centerBox="option.centerBox"></vueCropper>
      </div>
      <div class="upload" v-else></div>
    </template>
  </PopModal>
</template>

<script>
import { mapActions } from 'vuex'
import { convert } from '@/libs/utils'
export default {
  name: 'UploadImg',
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
      option: {
        uploadImg: '',
        autoCrop: true,
        centerBox: true,
      },
    }
  },
  methods: {
    ...mapActions(['uploadImg']),
    changeLadoing () {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    onUploadFile (e) {
      const file = e.target.files[0]
      const filesize = file.size
      if (convert(filesize) > 10) {
        this.$openNoticeModal({ msg: '请上传10mb大小以内的图片!' })
      } else {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = (e) => {
          this.option.uploadImg = e.target.result
        }
      }
      e.target.value = ''
    },
    deleteImg () {
      this.option.uploadImg = ''
    },
    confrimUpload () {
      if (!this.option.uploadImg) {
        this.$openNoticeModal({ msg: '请先上传图片!' })
        return this.changeLadoing()
      }
      this.$refs.cropper.getCropData(data => {
        this.uploadImg({
          userImg: data
        }).then(res => {
          this.$openNoticeModal({ msg: res.msg })
          this.cancelUpload()
        }).catch(() => {
          this.changeLadoing()
        })
      })
    },
    cancelUpload () {
      this.show = false
      this.option.uploadImg = ''
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
.head-modal {
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
    .img {
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 9999;
      &:hover {
        .delete {
          visibility: visible;
          z-index: 9999;
        }
      }
      .delete {
        visibility: hidden;
        position: absolute;
        top: -7px;
        right: -7px;
        cursor: pointer;
        background: #252632;
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
}
</style>
