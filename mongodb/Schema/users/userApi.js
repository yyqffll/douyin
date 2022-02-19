const utils = require('../../utils')
const router = utils.express.Router()
const User = require('./user')

router.post('/user/findOne', (req, res) => {
  utils.findOne(req.body, User).then(data => {
    res.json({
      success: true,
      msg: '用户获取成功!',
      data
    })
  }).catch(err => {
    res.json({
      success: false,
      msg: '用户获取失败!',
      data: {
        err
      }
    })
  })
})
router.post('/user/login', (req, res) => {
  utils.findOne(req.body, User).then(data => {
    res.json({
      success: true,
      msg: '登录成功!',
      data
    })
  }).catch(err => {
    res.json({
      success: false,
      msg: '用户名或者密码错误!',
      data: {
        err
      }
    })
  })
})
router.post('/user/sign', (req, res) => {
  if (!req.body.userName) {
    res.json({
      success: false,
      msg: '请输入用户名!'
    })
    return
  }
  utils.checkExist({ userName: req.body.userName }, User).then(() => {
    utils.create(req.body, User).then(data => {
      res.json({
        success: true,
        msg: '注册成功!',
        data
      })
    }).catch(err => {
      res.json({
        success: false,
        msg: '注册失败!',
        data: {
          err
        }
      })
    })
  }).catch(err => {
    res.json({
      success: false,
      msg: '用户名已存在!',
      data: {
        err
      }
    })
  })
})
router.post('/user/updateImg', (req, res) => {
  utils.findOne({ userId: req.body.userId }, User).then(data => {
    if (data.userImg) {
      utils.deletFile(utils.path.join(utils.dyimgPath, data.userImg))
    }
    User.updateOne(
      { userId: req.body.userId },
      { userImg: req.body.userImg },
      { new: true }
    ).then(data => {
      if (data.modifiedCount > 0) {
        utils.findOne({ userId: req.body.userId }, User).then(data => {
          res.json({
            success: true,
            msg: '更换头像成功!',
            data: data
          })
        }).catch(err => {
          res.join({
            success: false,
            msg: '更换头像失败!',
            data: {
              err
            }
          })
        })
      }
    })
  })
})

module.exports = router
