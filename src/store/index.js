import Vue from 'vue'
import Vuex from 'vuex'

import {
  getToken,
  setToken
} from '@/libs/utils'

import axios from '@/libs/axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: getToken(),
    userId: '',
    userName: '',
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setUserId (state, userId) {
      state.userId = userId
    },
    setUserName (state, userName) {
      state.userName = userName
    },
  },
  actions: {
    login ({ commit }, { userName, userPwd }) {
      return new Promise((resolve, reject) => {
        axios.post('/api/user/login', {
          userName,
          userPwd,
        }).then(res => {
          window.sessionStorage.setItem('userId', res.data._id)
          commit('setToken', 'logined')
          commit('setUserId', res.data._id)
          commit('setUserName', res.data.userName)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    loginOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        window.sessionStorage.setItem('userId', '')
        commit('setToken', '')
        resolve('loginOut')
      })
    },
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        axios.post('/api/user/findOne', {
          _id: window.sessionStorage.getItem('userId')
        }).then(res => {
          commit('setUserId', res.data._id)
          commit('setUserName', res.data.userName)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  },
})
