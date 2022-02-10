import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from '@/libs/axios'

import './global.less'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

Vue.prototype.$axios = axios
Vue.use(VueAwesomeSwiper)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
