import Vue from 'vue'
import Vuex from 'vuex'

import {
  getToken,
  setToken,
  getId,
  setId
} from '@/libs/utils'

import axios from '@/libs/axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: getToken(),
    id: getId(),
    userId: '',
    userName: '',
    userImg: '',
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
  },
  actions: {
    login ({ commit }, { userName, userPwd }) {
      return new Promise((resolve, reject) => {
        axios.post('/api/user/login', {
          userName,
          userPwd,
        }).then(res => {
          commit('setToken', 'logined')
          commit('setId', res.data._id)
          commit('setUserId', res.data._id)
          commit('setUserName', res.data.userName)
          commit('setUserImg', res.data.userImg)
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
        resolve('loginOut')
      })
    },
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        axios.post('/api/user/findOne', {
          _id: getId()
        }).then(res => {
          commit('setUserId', res.data._id)
          commit('setUserName', res.data.userName)
          commit('setUserImg', res.data.userImg)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    uploadImg ({ state, commit }, { userImg }) {
      return new Promise((resolve, reject) => {
        axios.post('/api/user/uploadImg', {
          _id: getId(),
          userImg
        }).then(res => {
          commit('setUserImg', res.data.userImg)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  },
})
