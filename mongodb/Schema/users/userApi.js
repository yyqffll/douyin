const express = require('express')
const router = express.Router()
const User = require('./user')
router.post('/user/findOne', (req, res) => {
  User.findOne(req.body).then(data => {
    if (data) {
      res.json({
        success: true,
        msg: '获取成功!',
        data
      })
    } else {
      res.json({
        success: false,
        msg: '未知错误,请联系管理员!',
        data
      })
    }
  })
})
router.post('/user/login', (req, res) => {
  User.findOne(req.body).then(data => {
    if (data) {
      res.json({
        success: true,
        msg: '登录成功!',
        data
      })
    } else {
      res.json({
        success: false,
        msg: '用户名或者密码错误!',
        data
      })
    }
  })
})
router.post('/user/sign', (req, res) => {
  User.findOne({ userName: req.body.userName }).then(data => {
    if (data) {
      res.json({
        success: false,
        msg: '该用户名已存在!'
      })
    } else {
      User.create(req.body).then(data => {
        res.json({
          success: true,
          msg: '注册成功!',
          data
        })
      })
    }
  })
})
router.post('/user/uploadImg', (req, res) => {
  User.updateOne(
    { userId: req.body.userId },
    { userImg: req.body.userImg },
    { new: true }
  ).then(data => {
    if (data.matchedCount > 0) {
      User.findOne({
        userId: req.body.userId
      }).then(data => {
        res.json({
          success: true,
          msg: '更换头像成功!',
          data
        })
      })
    } else {
      res.json({
        success: false,
        msg: '未知错误,请联系管理员!',
        data
      })
    }
  })
})

module.exports = router