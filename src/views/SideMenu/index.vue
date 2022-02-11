<template>
  <div class="side-menu">
    <div class="logo">
      <SvgIcon url="#icon-douyin"></SvgIcon>
      <span class="title">抖音</span>
    </div>
    <div class="menu">
      <div
        v-for="item in menuList"
        :key="item.svg"
        :class="{'menu-item': true, 'menu-item-active': menuItemActive === item.title}"
        @click="gotoPage(item)"
      >
        <template v-if="item.title !== '虎年'">
          <SvgIcon :url="item.svg"></SvgIcon>
          <p>{{item.title}}</p>
        </template>
        <template v-else>
          <img :src="item.svg" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import trigger from '@/assets/trigger.svg'
export default {
  name: 'SideMenu',
  data () {
    return {
      menuList: [
        {
          title: '首页',
          svg: '#icon-shouye'
        },
        {
          title: '推荐',
          svg: '#icon-dianzan',
          path: 'videoPage',
          type: 'recommend'
        },
        {
          title: '关注',
          svg: '#icon-guanzhu'
        },
        {
          title: '直播',
          svg: '#icon-live'
        },
        {
          title: '热点',
          svg: '#icon-redian'
        },
        {
          title: '虎年',
          svg: trigger
        },
        {
          title: '娱乐',
          svg: '#icon-yule'
        },
        {
          title: '知识',
          svg: '#icon-zhishi'
        },
        {
          title: '二次元',
          svg: '#icon-erciyuan'
        },
        {
          title: '游戏',
          svg: '#icon-youxi'
        },
        {
          title: '美食',
          svg: '#icon-meishi'
        },
        {
          title: '体育',
          svg: '#icon-tiyu'
        },
        {
          title: '时尚',
          svg: '#icon-shishang'
        },
        {
          title: '音乐',
          svg: '#icon-yinyue'
        }
      ],
      menuItemActive: '推荐'
    }
  },
  methods: {
    gotoPage (item) {
      this.menuItemActive = item.title
      this.$router.push({
        path: `/${item.path}/${item.type}`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.side-menu {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 72px;
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    cursor: pointer;
    .icon {
      font-size: 41px;
    }
    .title {
      display: none;
    }
  }
  .menu {
    width: 100%;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    padding-bottom: 60px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    .menu-item {
      &:hover {
        color: #fff;
      }
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 10px 18px 2px;
      font-size: 12px;
      cursor: pointer;
      .icon {
        font-size: 18px;
        margin: 6px 0;
      }
    }
    .menu-item-active {
      color: #fff;
    }
  }
}
@media (min-width: 1240px) {
  .side-menu {
    flex-basis: 172px;
    .logo {
      .title {
        display: inline-block;
        line-height: 1;
        color: #fff;
        font-weight: 600;
        font-size: 25px;
      }
    }
    .menu {
      overflow: hidden;
      .menu-item {
        display: flex;
        flex-direction: row;
        justify-content: normal;
        font-size: 16px;
        transform: translateX(22%);
        margin: 10px 18px 5px;
        .icon {
          font-size: 19px;
          margin: 6px 10px;
        }
        img {
          width: 64px;
        }
      }
    }
  }
}
</style>
