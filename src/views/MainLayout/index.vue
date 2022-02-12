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
        <div class="operate-other" :class="{'operate-other-token': token}">
          <div class="menu">
            <div
              v-for="item in menuItem"
              :key="item.title"
              class="meun-item"
              @mouseenter="itemMouseenter(item.title)"
              @mouseleave="itemMouseleave(item.title)"
            >
              <SvgIcon :url="item.svg"></SvgIcon>
              <span>{{item.title}}</span>
            </div>
          </div>
        </div>
        <div class="user" v-if="token">
          <img :src="douyin" />
          <div class="user-detail">
            <div class="user-inf">
              <div v-for="item in userItem" :key="item.title">
                <SvgIcon :url="item.url"></SvgIcon>
                <p style="font-weight: 600; color: #fff;">{{item.total}}</p>
                <p style="font-size: 12px;">{{item.title}}</p>
              </div>
            </div>
            <div class="user-operate">
              <span>个人主页</span>
              <span>更换头像</span>
              <span @click="handleLoginOut">退出登录</span>
            </div>
          </div>
        </div>
        <div class="login" @click="handleLogin" v-else>登录</div>
        <div class="operate">
          <SvgIcon class="menu-icon" url="#icon-caidan"></SvgIcon>
          <div class="menu">
            <div
              v-for="item in menuItem"
              :key="item.title"
              class="meun-item"
              @mouseenter="itemMouseenter(item.title)"
              @mouseleave="itemMouseleave(item.title)"
            >
              <SvgIcon :url="item.svg"></SvgIcon>
              <span>{{item.title}}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="main-content">
      <router-view />
    </div>
    <LoginModal v-model="loginModalShow"></LoginModal>
  </div>
</template>

<script>
import douyin from '@/assets/douyin.jpeg'
import { mapState, mapActions } from 'vuex'
import LoginModal from '_c/LoginModal'
export default {
  name: 'MainLayout',
  components: {
    LoginModal
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

      douyin: douyin,

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

      loginModalShow: false
    }
  },
  computed: {
    ...mapState({
      token: state => state.token,
    })
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
      const list = window.localStorage.getItem('searchHistory').split(',')
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
        const list = window.localStorage.getItem('searchHistory').split(',')
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

    handleLogin () {
      this.loginModalShow = true
    },
    handleLoginOut () {
      this.$openNoticeModal({ msg: '是否确认退出登录?' }, this.loginOut)
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
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 32px 0 22px;
    .search {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 68.75%;
      height: 40px;
      background: #292b35;
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
          background: #292b35;
          font-weight: 400;
          font-size: 14px;
          outline: none;
          caret-color: #fe2c55;
        }
      }
      button {
        width: 64px;
        border: none;
        cursor: pointer;
        font-size: 16px;
        background: #292b35;
        color: #fff;
      }
      .search-history {
        position: absolute;
        top: 50px;
        z-index: 9999;
        width: 100%;
        background: #292b35;
        color: #fff;
        padding: 10px 0;
        & > .search-history-item:first-child {
          .btn:hover {
            color: rgba(255, 0, 76, 0.911);
          }
        }
        & > .search-history-item:not(:first-child) {
          cursor: pointer;
          &:hover {
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
            color: #fff;
            &:hover {
              color: rgba(255, 0, 76, 0.911);
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
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        &:hover {
          .user-detail {
            display: flex;
          }
        }
        img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #292b35;
          margin-bottom: 10px;
          box-sizing: border-box;
        }
        .user-detail {
          display: none;
          background: #292b35;
          flex-direction: column;
          border-radius: 5px;
          .user-inf {
            display: flex;
            border-bottom: 1px solid #000000;
            div {
              cursor: pointer;
              padding: 25px 30px 10px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              &:hover {
                p {
                  color: #fff;
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
                color: #fff;
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
        background: rgba(255, 0, 76, 0.911);
        color: #fff;
        margin-right: 37px;
        cursor: pointer;
      }
      .operate {
        position: absolute;
        z-index: 9999;
        top: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        &:hover {
          z-index: 9998;
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
          margin-bottom: 10px;
        }
        .menu {
          width: 100px;
          overflow: hidden;
          background: #292b35;
          padding: 10px 20px 0px;
          display: none;
          align-items: center;
          flex-direction: column;
          color: #fff;
          .meun-item {
            display: flex;
            justify-content: center;
            align-items: center;
            white-space: nowrap;
            width: 100%;
            height: 32px;
            margin-bottom: 10px;
            background: #000000;
            border: 2px solid #fff;
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
          color: #fff;
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
          .menu {
            display: flex;
            flex-direction: row;
          }
          .meun-item {
            cursor: pointer;
            background: rgba(255, 0, 76, 0.911);
            border: 1px solid rgba(255, 251, 0, 0.801);
            color: #fff;
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
