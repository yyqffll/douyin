<template>
  <div class="main-layout">
    <header class="header">
      <div class="search">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-sousuo" />
        </svg>
        <form>
          <input
            class="input"
            type="text"
            placeholder="搜索你感兴趣的内容"
            @click="clickInput"
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
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shanchu" />
                </svg>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="search-other">
        <div class="login">登录</div>
        <svg class="icon" aria-hidden="true" @mouseenter="menuItemShow = true" @mouseleave="leave">
          <use xlink:href="#icon-caidan" />
        </svg>
        <div
          class="menu"
          v-if="menuItemShow"
          @mouseenter="enter"
          @mouseleave="() => {
            menuItemShow = false
            menuItemEnter = false
          }"
        >
          <div
            v-for="item in menuItem"
            :key="item.title"
            class="meun-item"
            @mouseenter="mouseenter(item.title)"
            @mouseleave="mouseleave(item.title)"
          >
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="item.svg" />
            </svg>
            <span>{{item.title}}</span>
          </div>
        </div>
      </div>
      <div class="search-other-other">
        <div class="meun-item">登录</div>
        <div
          class="menu"
          @mouseenter="enter"
          @mouseleave="() => {
            menuItemShow = false
            menuItemEnter = false
          }"
        >
          <div
            v-for="item in menuItem"
            :key="item.title"
            class="meun-item"
            @mouseenter="mouseenter(item.title)"
            @mouseleave="mouseleave(item.title)"
          >
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="item.svg" />
            </svg>
            <span>{{item.title}}</span>
          </div>
        </div>
      </div>
    </header>
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainLayout',
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
      menuItemShow: false,
      menuItemEnter: false
    }
  },
  mounted () {
    document.addEventListener('click', this.checkClick)
  },
  destroyed () {
    document.removeEventListener('clicl', this.checkClick)
  },
  methods: {
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
    clickInput () {
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
      this.clickInput()
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
    leave () {
      setTimeout(() => {
        if (!this.menuItemEnter) {
          this.menuItemShow = false
        }
      }, 100)
    },
    enter () {
      this.menuItemEnter = true
    },
    mouseenter (title) {
      this.menuItem.forEach(item => {
        if (item.title === title) {
          item.svg = '#icon-xiangxia'
        }
      })
    },
    mouseleave (title) {
      this.menuItem.forEach(item => {
        if (item.title === title) {
          item.svg = item.tem
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main-layout {
  min-width: 600px;
  flex-grow: 1;
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
    .search-other {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100px;
      justify-content: flex-end;
      .login {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        font-size: 12px;
        text-align: center;
        line-height: 32px;
        background: rgba(255, 0, 76, 0.911);
        color: #fff;
        margin-right: 10px;
        cursor: pointer;
      }
      .icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
      }
      .menu {
        position: absolute;
        top: 50px;
        overflow: hidden;
        background: #292b35;
        padding: 10px 20px 0px;
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        color: #fff;
        .meun-item {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          white-space: nowrap;
          margin-bottom: 10px;
          background: black;
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
    .search-other-other {
      display: none;
    }
  }
  .main-content {
    height: calc(100vh - 60px);
    padding: 0 32px 0 22px;
    & > div:first-child {
      width: 100%;
      height: 100%;
    }
  }
}
@media (min-width: 1240px) {
  .main-layout {
    .header {
      .search {
        width: 48.75%;
      }
      .search-other {
        display: none;
      }
      .search-other-other {
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
          margin-left: 15px;
          &:hover {
            .icon {
              animation: menu-item-icon 1s;
              animation-fill-mode: forwards;
            }
          }
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
