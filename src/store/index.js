import Vue from 'vue'
import Vuex from 'vuex'

import {
  getToken,
  setToken,
  getId,
  setId,
  bufferToUrl
} from '@/libs/utils'

import { request } from '@/libs/axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: getToken(),
    id: getId(),
    userId: '',
    userName: '',
    userImg: '',
    userImgUrl: '',
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setId (state, id) {
      state.id = id
      setId(id)
    },
    setUserId (state, userId) {
      state.userId = userId
    },
    setUserName (state, userName) {
      state.userName = userName
    },
    setUserImg (state, userImg) {
      state.userImg = userImg
    },
    setUserImgUrl (state, userImgUrl) {
      state.userImgUrl = userImgUrl
    },
  },
  actions: {
    login ({ commit }, { userName, userPwd }) {
      return new Promise((resolve, reject) => {
        request({
          url: '/api/user/login',
          data: {
            userName,
            userPwd,
          }
        }).then(res => {
          commit('setToken', 'logined')
          commit('setId', res.data.userId)
          commit('setUserId', res.data.userId)
          commit('setUserName', res.data.userName)
          commit('setUserImg', res.data.userImg)
          if (res.data.userImg) {
            request({
              url: '/api/img/find',
              data: {
                imgName: res.data.userImg
              }
            }).then(res => {
              commit('setUserImgUrl', bufferToUrl(res.data.img.data))
            })
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    loginOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        commit('setToken', '')
        commit('setId', '')
        resolve('退出登录成功!')
      })
    },
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        request({
          url: '/api/user/findOne',
          data: {
            userId: getId()
          }
        }).then(res => {
          commit('setUserId', res.data.userId)
          commit('setUserName', res.data.userName)
          commit('setUserImg', res.data.userImg)
          if (res.data.userImg) {
            request({
              url: '/api/img/find',
              data: {
                imgName: res.data.userImg
              }
            }).then(res => {
              commit('setUserImgUrl', bufferToUrl(res.data.img.data))
            })
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    updateUserImg ({ state, commit }, { userImg }) {
      return new Promise((resolve, reject) => {
        request({
          url: '/api/user/updateImg',
          data: {
            userId: getId(),
            userImg
          }
        }).then(res => {
          commit('setUserImg', res.data.userImg)
          request({
            url: '/api/img/find',
            data: {
              imgName: res.data.userImg
            }
          }).then(res => {
            commit('setUserImgUrl', bufferToUrl(res.data.img.data))
          })
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  },
})
