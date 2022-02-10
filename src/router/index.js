import Vue from 'vue'
import VueRouter from 'vue-router'
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

export default router
