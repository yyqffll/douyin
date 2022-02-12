import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  getToken,
} from '@/libs/utils'
import store from '@/store'

import Home from '@/views/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/videoPage/recommend',
    component: Home,
    children: [
      {
        path: '/videoPage/:type',
        name: 'videoPage',
        component: () => import('@/views/videoPage/index.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const token = getToken()
  if (token) {
    if (!store.state.userId) {
      store.dispatch('getUserInfo')
    }
    next()
  } else {
    if (to.params.type === 'recommend') {
      next()
    }
  }
})

export default router
