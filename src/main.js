import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './global.less'

import { request } from '@/libs/axios'

import { v4 } from 'uuid'

import modal from '@/libs/modal'

import VueCropper from 'vue-cropper'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

import PopModal from '_c/PopModal'

import SvgIcon from '_c/SvgIcon'

Vue.prototype.$axios = request
Vue.prototype.$v4 = v4
Vue.use(modal)
Vue.use(VueCropper)
Vue.use(VueAwesomeSwiper)

Vue.component('PopModal', PopModal)
Vue.component('SvgIcon', SvgIcon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
