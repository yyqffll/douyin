import Vue from 'vue'
import PopModal from '_c/PopModal'

export const noticeModal = function (props = {}, onOk = null, timeout = 5000) {
  let timer = null
  const Modal = Vue.extend(PopModal)
  const instance = new Modal({
    propsData: {
      ...props,
      title: '提示',
      width: '500',
      background: 'none',
      onOk: () => {
        onOk && onOk()
        clearTimeout(timer)
        document.body.removeChild(instance.$el)
      },
      onCancel: () => {
        clearTimeout(timer)
        document.body.removeChild(instance.$el)
      }
    }
  }).$mount()
  document.body.appendChild(instance.$el)
  timer = setTimeout(() => {
    console.log('chufa')
    document.body.removeChild(instance.$el)
  }, timeout)
}

export default function (Vue) {
  // 添加全局API
  Vue.prototype.$openNoticeModal = noticeModal
}
