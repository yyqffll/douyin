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
      <ImageUpload v-model="imgName" :img.sync="img" :imgUrl="imgUrl"></ImageUpload>
    </template>
  </PopModal>
</template>

<script>
import { mapActions } from 'vuex'
import ImageUpload from '_c/ImageUpload.vue'
export default {
  name: 'UploadHead',
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
      img: null,
      imgUrl: '',
    }
  },
  computed: {

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
        this.changeLadoing()
        this.updateUserImg({
          userImg: this.imgName
        }).then(res => {
          this.closeModal()
          this.$openNoticeModal({
            msg: res.msg
          })
        })
      }).catch(() => {
        this.changeLadoing()
      })
    },
    closeModal () {
      this.show = false
      this.imgName = ''
      this.img = null
      this.imgUrl = ''
    },
    cancelUpload () {
      if (!this.imgUrl && this.imgName) {
        this.$axios({
          url: 'api/img/delete',
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
      if (val) {
        this.imgName = this.$store.state?.userImg
        this.imgUrl = this.$store.state?.userImgUrl
      }
    },
    show (val) {
      this.$emit('input', val)
    },
    imgName (val) {
      if (!val) {
        this.imgUrl = ''
      }
    }
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
