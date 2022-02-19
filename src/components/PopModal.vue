<template>
  <div class="pop-modal" v-show="visible" :style="{'background': background, 'top': top}">
    <div class="modal" :style="{'width': width + 'px'}">
      <div class="header">
        <div class="title">{{title}}</div>
        <SvgIcon url="#icon-shanchu" @click="close"></SvgIcon>
      </div>
      <div class="content">
        <slot name="content">{{msg}}</slot>
      </div>
      <div class="footer" v-show="!footerHide">
        <slot name="footer">
          <div @click="confirm">
            确定
            <SvgIcon url="#icon-loading" v-if="btnLoading"></SvgIcon>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopModal',
  props: {
    title: {
      default: '弹窗'
    },
    value: {
      default: true,
      typeof: Boolean
    },
    loading: {
      default: false,
      typeof: Boolean
    },
    width: {
      default: '750',
    },
    background: {},
    top: {
      default: 0
    },
    msg: {
      default: ''
    },
    footerHide: {
      default: false,
      typeof: Boolean
    },
    onOk: {
      default: null,
      typeof: Function
    },
    onCancel: {
      default: null,
      typeof: Function
    }
  },
  data () {
    return {
      visible: this.value,
      btnLoading: false
    }
  },
  mounted () {
    const PopModal = document.querySelector('.pop-modal')
    PopModal.parentNode.removeChild(PopModal)
    document.body.appendChild(PopModal)
  },
  methods: {
    close () {
      this.onCancel && this.onCancel()
      this.visible = false
      this.$emit('input', false)
      this.$emit('on-cancel')
    },
    confirm () {
      this.onOk && this.onOk()
      if (this.loading) {
        this.btnLoading = true
      } else {
        this.visible = false
        this.$emit('input', false)
      }
      this.$emit('on-ok')
    },
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      if (!val) {
        this.btnLoading = val
      }
    },
    loading (val) {
      if (!val) {
        this.btnLoading = val
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pop-modal {
  color: @color-font-basic;
  background: @color-black-1-1;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  z-index: 999999;
  display: flex;
  justify-content: center;
  align-items: center;
  .modal {
    background: @color-black-2;
    .header {
      position: relative;
      height: 58px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: @color-white-1;
      svg {
        position: absolute;
        right: 20px;
        cursor: pointer;
      }
    }
    .content {
      min-height: 100px;
      background: @color-black-3;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      position: relative;
    }
    .footer {
      height: 58px;
      display: flex;
      justify-content: center;
      align-items: center;
      div {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        width: 80px;
        height: 40px;
        font-size: 16px;
        border-radius: 15px;
        background: @color-black-3;
        color: @color-font-basic;
        font-weight: 600;
        &:hover {
          color: @color-white-1;
        }
        svg {
          animation: rotate 1s infinite;
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
