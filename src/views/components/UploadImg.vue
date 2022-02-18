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
      <ImageUpload v-model="imgName" :img.sync="img"></ImageUpload>
    </template>
  </PopModal>
</template>

<script>
import { mapActions } from 'vuex'
import ImageUpload from '_c/ImageUpload.vue'
export default {
  name: 'UploadImg',
  components: {
    ImageUpload
  },
  props: {
    value: {
      default: false,
      typeof: Boolean
    },
  },
  data () {
    return {
      show: this.value,
      loading: true,
      imgName: '',
      img: null
    }
  },
  methods: {
    ...mapActions(['updateUserImg']),

    changeLadoing () {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    confrimUpload () {
      if (!this.imgName) {
        this.$openNoticeModal({ msg: '请先上传图片!' })
        return this.changeLadoing()
      }
      const file = new File([this.img[0]], this.imgName, { type: this.img[1] })
      const param = new FormData()
      param.append('file', file)
      this.$axios({
        url: '/api/img/upload',
        data: param,
      }).then(res => {
        this.imgName = res.data.filename
        this.updateUserImg({
          userImg: this.imgName
        }).then(res => {
          this.cancelUpload()
          this.$openNoticeModal({
            msg: res.msg
          })
        })
      }).catch(() => {
        this.changeLadoing()
      })
    },
    cancelUpload () {
      this.show = false
      this.imgName = ''
      this.img = null
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
    height: 600px;
  }
}
</style>
