<template>
  <div class="main-layout">
    <header class="header">
      <div class="search">
        <SvgIcon url="#icon-sousuo"></SvgIcon>
        <form>
          <input
            class="input"
            type="text"
            placeholder="搜索你感兴趣的内容"
            @click="handleSearch"
            @keyup.enter="onSubmit"
            v-model="searchValue"
          />
        </form>
        <button>搜索</button>
        <div class="search-history" v-show="showHistory">
          <div v-for="item in searchHistory" :key="item.title" class="search-history-item">
            <span class="title">{{item.title}}</span>
            <div @click="deleteSearch(item.btn, item.title)" class="btn-icon">
              <template v-if="item.btn">
                <span class="btn">{{item.btn}}</span>
              </template>
              <template v-else>
                <SvgIcon url="#icon-shanchu"></SvgIcon>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="header-main">
        <div class="operate">
          <SvgIcon class="menu-icon" url="#icon-caidan"></SvgIcon>
          <div class="menu">
            <div
              v-for="item in menuItem"
              :key="item.title"
              class="meun-item"
              @mouseenter="itemMouseenter(item.title)"
              @mouseleave="itemMouseleave(item.title)"
              @click="handleMenuItem(item.title)"
            >
              <SvgIcon :url="item.svg"></SvgIcon>
              <span>{{item.title}}</span>
            </div>
          </div>
        </div>
        <div class="operate-other" :class="{'operate-other-token': token}">
          <div class="menu">
            <div
              v-for="item in menuItem"
              :key="item.title"
              class="meun-item"
              @mouseenter="itemMouseenter(item.title)"
              @mouseleave="itemMouseleave(item.title)"
              @click="handleMenuItem(item.title)"
            >
              <SvgIcon :url="item.svg"></SvgIcon>
              <span>{{item.title}}</span>
            </div>
          </div>
        </div>
        <div class="user" v-if="token">
          <img :src="userImgUrl" />
          <div class="user-detail">
            <div class="user-inf">
              <div v-for="item in userItem" :key="item.title">
                <SvgIcon :url="item.url"></SvgIcon>
                <p style="font-weight: 600; color: @color-white-1;">{{item.total}}</p>
                <p style="font-size: 12px;">{{item.title}}</p>
              </div>
            </div>
            <div class="user-operate">
              <span>个人主页</span>
              <span @click="handleChangeHead">更换头像</span>
              <span @click="handleLoginOut">退出登录</span>
            </div>
          </div>
        </div>
        <div class="login" @click="handleLogin" v-else>登录</div>
      </div>
    </header>
    <div class="main-content">
      <!-- <router-view /> -->
    </div>
    <LoginModal v-model="loginModalShow"></LoginModal>
    <UploadImg v-model="uploadImgShow"></UploadImg>
    <UploadVideo v-model="uploadVideoShow"></UploadVideo>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import LoginModal from '@/views/components/LoginModal'
import UploadImg from '@/views/components/UploadImg'
import UploadVideo from '@/views/components/UploadVideo'
export default {
  name: 'MainLayout',
  components: {
    LoginModal,
    UploadImg,
    UploadVideo
  },
  data () {
    return {
      searchHistory: [
        {
          title: '历史记录',
          btn: '清除全部'
        }
      ],
      showHistory: false,
      searchValue: '',

      userItem: [
        {
          url: '#icon-shipin',
          title: '我的作品',
          total: 0
        },
        {
          url: '#icon-xihuan',
          title: '我的喜欢',
          total: 0
        },
        {
          url: '#icon-shoucang',
          title: '我的收藏',
          total: 0
        }
      ],

      menuItem: [
        {
          title: '发布视频',
          svg: '#icon-jia',
          tem: '#icon-jia'
        },
        {
          title: '抖币充值',
          svg: '#icon-qianbi',
          tem: '#icon-qianbi'
        }
      ],

      loginModalShow: false,
      uploadImgShow: false,
      uploadVideoShow: false,
    }
  },
  computed: {
    ...mapState({
      token: state => state.token,
      userImg: state => state.userImg,
      userImgUrl: state => state.userImgUrl
    }),
  },
  mounted () {
    document.addEventListener('click', this.checkClick)
  },
  destroyed () {
    document.removeEventListener('clicl', this.checkClick)
  },
  methods: {
    ...mapActions(['loginOut']),
    checkClick (event) {
      const input = document.querySelector('.input')
      const btn = Array.from(document.querySelectorAll('.btn-icon'))
      const {
        target
      } = event
      let flag = false
      for (let i = 0; i < btn.length; i++) {
        if (btn[i].contains(target)) {
          flag = true
          break
        }
      }
      if (input !== target && !flag) {
        this.showHistory = false
      }
    },
    handleSearch () {
      this.showHistory = true
      this.searchHistory = [
        {
          title: '历史记录',
          btn: '清除全部'
        }
      ]
      const list = window.localStorage.getItem('searchHistory')?.split(',')
      list.forEach(item => {
        if (item) {
          this.searchHistory.push({
            title: item,
            btn: ''
          })
        }
      })
    },
    deleteSearch (btn, title) {
      if (btn) {
        window.localStorage.setItem('searchHistory', '')
      } else {
        const list = window.localStorage.getItem('searchHistory')?.split(',')
        list.splice(list.indexOf(title), 1)
        window.localStorage.setItem('searchHistory', Array.from(new Set(list)).toString())
      }
      this.handleSearch()
    },
    onSubmit () {
      if (!this.searchValue) {
        return
      }
      let list = window.localStorage.getItem('searchHistory')
      list = list ? list.split(',') : []
      list.push(this.searchValue)
      window.localStorage.setItem('searchHistory', Array.from(new Set(list)).toString())
      this.showHistory = false
    },

    itemMouseenter (title) {
      this.menuItem.forEach(item => {
        if (item.title === title) {
          item.svg = '#icon-xiangxia'
        }
      })
    },
    itemMouseleave (title) {
      this.menuItem.forEach(item => {
        if (item.title === title) {
          item.svg = item.tem
        }
      })
    },
    handleMenuItem (title) {
      if (!this.token) {
        this.$openNoticeModal({ msg: '请先登录!' })
        return
      }
      if (title === '发布视频') {
        this.uploadVideoShow = true
      }
    },

    handleLogin () {
      this.loginModalShow = true
    },
    handleLoginOut () {
      this.$openNoticeModal({ msg: '是否确认退出登录?' }, null, () => {
        this.loginOut().then(res => {
          window.location.href = '/'
          this.$openNoticeModal({
            msg: res
          })
        })
      })
    },
    handleChangeHead () {
      this.uploadImgShow = true
    },

    handleOperate () { },
  }
}
</script>

<style lang="less" scoped>
.main-layout {
  min-width: 300px;
  height: 100%;
  flex: 1;
  background: @color-black-2;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 32px 0 22px;
    border-bottom: 2px solid @color-black-3;
    .search {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 45%;
      height: 40px;
      background: @color-black-3;
      border-radius: 4px;
      .icon {
        margin-left: 10px;
      }
      form {
        display: flex;
        flex: 1;
        .input {
          width: 100%;
          height: 22px;
          line-height: 22px;
          padding: 0 4px;
          border: none;
          background: @color-black-3;
          font-weight: 400;
          font-size: 14px;
          outline: none;
          caret-color: @color-red-1;
          color: @color-white-1;
          &::-webkit-input-placeholder {
            color: @color-font-basic;
          }
        }
      }
      button {
        width: 64px;
        border: none;
        cursor: pointer;
        font-size: 16px;
        background: @color-black-3;
        color: @color-white-1;
        font-weight: 600;
        &:hover {
          color: @color-red-1;
        }
      }
      .search-history {
        position: absolute;
        top: 50px;
        z-index: 99999;
        width: 100%;
        background: @color-black-3;
        color: @color-white-1;
        padding: 10px 0;
        & > .search-history-item:first-child {
          .btn:hover {
            color: @color-red-1;
          }
        }
        & > .search-history-item:not(:first-child) {
          cursor: pointer;
          &:hover {
            background: @color-black-3;
            .icon {
              visibility: visible;
            }
          }
        }
        .search-history-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 20px;
          font-size: 14px;
          .btn {
            cursor: pointer;
          }
          .icon {
            visibility: hidden;
            color: @color-white-1;
            &:hover {
              color: @color-red-1;
            }
          }
        }
      }
    }
    .header-main {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      height: 32px;
      .user {
        position: absolute;
        top: 0;
        right: 37px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        &:hover {
          z-index: 9999;
          cursor: pointer;
          .user-detail {
            display: flex;
          }
        }
        img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid @color-black-3;
          margin-bottom: 15px;
          box-sizing: border-box;
        }
        .user-detail {
          display: none;
          background: @color-black-3;
          flex-direction: column;
          border-radius: 5px;
          .user-inf {
            display: flex;
            border-bottom: 1px solid @color-black-2;
            div {
              cursor: pointer;
              padding: 25px 30px 10px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              &:hover {
                p {
                  color: @color-white-1;
                  font-weight: 600;
                }
              }
              .icon {
                font-size: 32px;
                margin-bottom: 5px;
              }
              p {
                white-space: nowrap;
              }
            }
          }
          .user-operate {
            padding: 10px 30px;
            display: flex;
            justify-content: space-around;
            span {
              cursor: pointer;
              font-size: 14px;
              &:hover {
                color: @color-white-1;
                font-weight: 600;
              }
            }
          }
        }
      }
      .login {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        font-size: 12px;
        text-align: center;
        line-height: 32px;
        background: @color-red-1;
        color: @color-white-1;
        margin-right: 37px;
        cursor: pointer;
        z-index: 99999;
      }
      .operate {
        position: absolute;
        z-index: 99999;
        top: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        &:hover {
          z-index: 9999;
          .menu {
            display: flex;
          }
          .user-detail {
            display: none;
          }
        }
        .menu-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          margin-bottom: 15px;
        }
        .menu {
          width: 100px;
          overflow: hidden;
          background: @color-black-3;
          padding: 10px 20px 0px;
          display: none;
          align-items: center;
          flex-direction: column;
          color: @color-white-1;
          .meun-item {
            display: flex;
            justify-content: center;
            align-items: center;
            white-space: nowrap;
            width: 100%;
            height: 32px;
            margin-bottom: 10px;
            background: @color-black-1;
            border: 2px solid @color-white-1;
            border-radius: 5px;
            cursor: pointer;
            &:hover {
              animation: menu-item-width 1s;
              .icon {
                animation: menu-item-icon 1s;
                animation-fill-mode: forwards;
              }
            }
            .icon {
              width: 14px;
              margin-right: 5px;
            }
          }
        }
      }
      .operate-other {
        display: none;
      }
    }
  }
  .main-content {
    height: calc(100vh - 60px);
    padding: 0 32px 0 22px;
  }
}
@media (min-width: 1240px) {
  .main-layout {
    .header {
      .search {
        width: 48.75%;
      }
      .header-main {
        .user {
          right: 0;
        }
        .login {
          border: 1px solid rgba(255, 251, 0, 0.801);
          color: @color-white-1;
          width: 100px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          margin-right: 0;
          font-size: 16px;
        }
        .operate {
          display: none;
        }
        .operate-other {
          display: flex;
          z-index: 99999;
          .menu {
            display: flex;
            flex-direction: row;
          }
          .meun-item {
            cursor: pointer;
            background: rgba(255, 0, 76, 0.9);
            border: 1px solid rgba(255, 251, 0, 0.8);
            color: @color-white-1;
            width: 100px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            margin-right: 15px;
            &:hover {
              .icon {
                animation: menu-item-icon 1s;
                animation-fill-mode: forwards;
              }
            }
          }
        }
        .operate-other-token {
          margin-right: 37px;
        }
      }
    }
  }
}
@keyframes menu-item-width {
  0% {
    width: 100%;
  }
  50% {
    width: 120%;
  }
  100% {
    width: 100%;
  }
}
@keyframes menu-item-icon {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(-90deg);
  }
}
</style>
