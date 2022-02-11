import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from '@/libs/axios'

import './global.less'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

import PopModal from '_c/PopModal'

import SvgIcon from '_c/SvgIcon'

Vue.prototype.$axios = axios
Vue.use(VueAwesomeSwiper)

Vue.component('PopModal', PopModal)
Vue.component('SvgIcon', SvgIcon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
