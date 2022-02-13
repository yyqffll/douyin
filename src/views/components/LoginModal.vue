<template>
  <PopModal class="logon-modal" :title="title" :footerHide="true" v-model="show" @on-cancel="handleCancel">
    <template slot="content">
      <form @keyup.enter="confrimLogin" class="user-login">
        <p style="font-size: 20px; margin-bottom: 20px; color: #fff;">{{type === 'login' ? '用户名登录' : '用户注册'}}</p>
        <div class="input">
          <input type="text" placeholder="请输入用户名" v-model.trim="params.userName" />
          <p v-show="usernameF">用户名不能为空</p>
          <p v-show="checkError">用户名或密码错误</p>
        </div>
        <div class="input">
          <input type="password" placeholder="请输入密码" v-model.trim="params.userPwd" />
          <p v-show="passwordF">密码不能为空</p>
          <p v-show="checkError">用户名或密码错误</p>
        </div>
        <div class="input" v-if="type === 'sign'">
          <input type="password" placeholder="请确认密码" v-model.trim="params.passwordC" />
          <p v-show="passwordC">请确认密码</p>
          <p v-show="checkError">用户名或密码错误</p>
          <p v-show="passwordCS">两次密码不一致</p>
        </div>
        <div class="input">
          <input type="text" placeholder="请输入验证码" v-model.trim="params.yzm" />
          <canvas id="yzm" @click="getYzm" width="100" height="50" title="点击刷新"></canvas>
          <p v-show="yzmF">验证码不能为空</p>
          <p v-show="yzmFlag">请输入正确的验证码</p>
        </div>
        <p style="font-size: 12px;">
          已阅读并同意
          <span style="color: #fff; cursor: pointer;">服务协议</span>
          和
          <span style="color: #fff; cursor: pointer;">隐私条款</span>
        </p>
        <p style="font-size: 12px; margin-top: 5px;" v-if="type === 'login'">
          无账号？
          <span style="color: #a9263f; cursor: pointer;" @click="handleRegister">立即注册</span>
        </p>
        <p style="font-size: 12px; margin-top: 5px;" v-if="type === 'sign'">
          已有账号？
          <span style="color: #a9263f; cursor: pointer;" @click="handleLogin">立即登录</span>
        </p>
        <div class="login-btn" @click="confrimLogin">
          {{type === 'login' ? '登录' : '注册'}}
          <SvgIcon url="#icon-loading" v-if="handleLoading"></SvgIcon>
        </div>
      </form>
      <div class="success" v-show="success">
        <SvgIcon url="#icon-chenggong"></SvgIcon>
        <p>注册成功!</p>
        <p>
          {{time}}后将自动返回登录界面
          <span @click="gotoLogin">立即返回</span>
        </p>
      </div>
    </template>
  </PopModal>
</template>

<script>
import { mapActions } from 'vuex'

import { drawAuthCode } from '@/libs/YzmCode'

import { encrypt } from '@/libs/utils'

export default {
  name: 'loginModal',
  props: {
    value: {
      default: false,
      typeof: Boolean,
    }
  },
  data () {
    return {
      title: '登录后抖音更懂你，内容推荐更精彩',
      type: 'login',
      show: this.value,
      handleLoading: false,
      success: false,
      timer: null,
      time: 5,
      yzm: '',
      yzmFlag: false,
      checkError: false,
      usernameF: false,
      passwordF: false,
      passwordC: false,
      passwordCS: false,
      yzmF: false,
      params: {
        userName: '',
        userPwd: '',
        passwordC: '',
        yzm: ''
      }
    }
  },
  methods: {
    ...mapActions(['login']),
    getYzm () {
      this.yzm = drawAuthCode('yzm')
    },
    init () {
      this.yzmFlag = false
      this.checkError = false
      this.usernameF = false
      this.passwordF = false
      this.passwordC = false
      this.passwordCS = false
      this.yzmF = false
      Object.assign(this.params, {
        userName: '',
        userPwd: '',
        passwordC: '',
        yzm: ''
      })
      this.$nextTick(() => {
        this.getYzm()
      })
    },
    handleCancel () {
      this.show = false
      this.init()
    },
    handleLogin () {
      this.title = '登录后抖音更懂你，内容推荐更精彩'
      this.type = 'login'
      this.init()
    },
    handleRegister () {
      this.title = '注册后抖音属于你，内容变得更丰富'
      this.type = 'sign'
      this.init()
    },
    confrimLogin () {
      if (!this.params.userName) this.usernameF = true
      if (!this.params.userPwd) this.passwordF = true
      if (!this.params.yzm) this.yzmF = true
      if (this.usernameF || this.passwordF || this.yzmF) return
      if (this.params.yzm.toLowerCase() !== this.yzm.toLowerCase()) {
        this.yzmFlag = true
        return
      } else {
        this.yzmFlag = false
      }
      if (this.handleLoading) {
        return
      }
      const param = { userName: this.params.userName, userPwd: encrypt(this.params.userPwd) }
      if (this.type === 'login') {
        this.handleLoading = true
        this.login(param).then(res => {
          this.handleLoading = false
          this.handleCancel()
          this.$openNoticeModal({ msg: res.msg })
        }).catch(res => {
          this.handleLoading = false
        })
      }
      if (this.type === 'sign') {
        if (!this.params.passwordC) this.passwordC = true
        if (this.passwordC) return
        if (this.params.passwordC !== this.params.userPwd) {
          this.passwordCS = true
          return
        } else {
          this.passwordCS = false
        }
        this.$axios.post('/api/user/sign', { ...param, userId: this.$v4() }).then(res => {
          this.registerSuccess()
        }).catch(res => {
          this.handleLoading = false
        })
      }
    },
    gotoLogin () {
      clearInterval(this.timer)
      this.success = false
      this.handleLogin()
    },
    registerSuccess () {
      this.success = true
      this.timer = setInterval(() => {
        this.time--
        if (this.time < 1) {
          this.gotoLogin()
        }
      }, 1000)
    }
  },
  watch: {
    value (val) {
      this.getYzm()
      this.show = val
    },
    show (val) {
      this.$emit('input', val)
    },
    'params.userName' (val) {
      if (val) {
        this.usernameF = false
      }
    },
    'params.userPwd' (val) {
      if (val) {
        this.passwordF = false
      }
    },
    'params.passwordC' (val) {
      if (val) {
        this.passwordC = false
      }
    },

    'params.yzm' (val) {
      if (val) {
        this.yzmF = false
        this.yzmFlag = false
      }
    },
  }
}
</script>

<style lang="less" scoped>
.logon-modal {
  .modal {
    .content {
      .user-login {
        display: flex;
        flex-direction: column;
        align-items: center;
        input {
          width: 200px;
          height: 50px;
          background: #2e2e3b;
          border: none;
          padding: 0 10px;
          color: #fff;
          border-radius: 5px;
          &::-webkit-input-placeholder {
            color: #7a7778;
          }
        }
        .input {
          position: relative;
          margin-bottom: 20px;
          p {
            font-size: 12px;
            color: #a9263f;
            position: absolute;
          }
          canvas {
            position: absolute;
            right: 0;
            cursor: pointer;
          }
        }
        .login-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 200px;
          height: 50px;
          margin-top: 20px;
          background: #a9263f;
          border-radius: 5px;
          text-align: center;
          line-height: 50px;
          cursor: pointer;
          svg {
            animation: rotate 1s infinite;
          }
        }
      }
      .success {
        position: absolute;
        background: #252632;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        svg {
          font-size: 58px;
          margin-bottom: 100px;
        }
        p {
          margin-bottom: 5px;
          span {
            cursor: pointer;
            color: #6bc839;
          }
        }
      }
    }
  }
}
@keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
</style>
