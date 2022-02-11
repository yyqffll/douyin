<template>
  <div class="PopModal" v-show="value">
    <div class="modal" :style="{'width': width + 'px'}">
      <div class="header">
        <div class="title">{{title}}</div>
        <SvgIcon url="#icon-shanchu" @click="close"></SvgIcon>
      </div>
      <div class="content">
        <slot name="content"></slot>
      </div>
      <div class="footer" v-show="!footerHide">
        <slot name="footer">
          <button>确定</button>
          <button>取消</button>
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
    footerHide: {
      default: false,
      typeof: Boolean
    },
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
    }
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
  background: rgba(0, 0, 0, 0.85);
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
      padding: 20px;
      position: relative;
    }
    // .footer {
    //   height: 58px;
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    //   button {
    //     width: 58px;
    //     height: 38px;
    //     margin: 0 10px;
    //     border: none;
    //     border-radius: 15px;
    //     background: #252632;
    //     color: #fff;
    //   }
    // }
  }
}
</style>
