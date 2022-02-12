<template>
  <div class="PopModal" v-show="visible" :style="{'background': background, 'top': top}">
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
          <button @click="confirm">确定</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      default: '弹窗'
    },
    value: {
      default: true,
      typeof: Boolean
    },
    width: {
      default: '750',
    },
    background: {
      default: 'rgba(0, 0, 0, 0.85)'
    },
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
      visible: this.value
    }
  },
  mounted () {
    const PopModal = document.querySelector('.PopModal')
    PopModal.parentNode.removeChild(PopModal)
    document.body.appendChild(PopModal)
  },
  methods: {
    close () {
      this.visible = false
      this.$emit('input', false)
      this.$emit('on-cancel')
      this.onCancel && this.onCancel()
    },
    confirm () {
      this.visible = false
      this.$emit('input', false)
      this.$emit('on-ok')
      this.onOk && this.onOk()
    },
  },
  watch: {
    value (val) {
      this.visible = val
    }
  }
}
</script>

<style lang="less" scoped>
.PopModal {
  color: #afafaf;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  z-index: 999999;
  display: flex;
  justify-content: center;
  align-items: center;
  .modal {
    background: #181a25;
    .header {
      position: relative;
      height: 58px;
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        position: absolute;
        right: 20px;
        cursor: pointer;
      }
    }
    .content {
      min-height: 100px;
      background: #252632;
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
      button {
        cursor: pointer;
        width: 70px;
        height: 40px;
        font-size: 16px;
        margin: 0 10px;
        border: none;
        border-radius: 15px;
        background: #252632;
        color: #afafaf;
      }
    }
  }
}
</style>
