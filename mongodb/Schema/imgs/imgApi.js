/**
 * imgName 图片文件名称
 * imgPath 图片文件完整路径
 * imgOgPath 旧图片文件完整路径
 */

const utils = require('../../utils')
const router = utils.express.Router()

const uploadDest = utils.multer({
  dest: utils.dyimgPath
}).single('file')

const imgPath = req => {
  return utils.path.join(utils.dyimgPath, req.body.imgName)
}

const imgOgPath = req => {
  return utils.path.join(utils.dyimgPath, req.file.originalname)
}

router.post('/img/find', (req, res) => {
  utils.readFile(imgPath(req)).then(data => {
    res.json({
      success: true,
      msg: '图片获取成功!',
      data: {
        img: data
      }
    })
  }).catch(err => {
    res.json({
      success: false,
      msg: '图片获取失败!',
      data: {
        err
      }
    })
  })
})

router.post('/img/upload', uploadDest, (req, res) => {
  if (req.file) {
    if (utils.findFile(imgOgPath(req))) {
      utils.deletFile(imgOgPath(req)).then(
        res.json({
          success: true,
          msg: '图片上传成功!',
          data: req.file
        })
      ).catch(err => {
        res.json({
          success: false,
          msg: '图片上传失败!',
          data: { err }
        })
      })
    } else {
      res.json({
        success: true,
        msg: '图片上传成功!',
        data: req.file
      })
    }
    return
  }
  res.json({
    success: false,
    msg: '图片上传失败!',
  })
})

router.post('/img/delete', (req, res) => {
  utils.deletFile(imgPath(req)).then(() => {
    res.json({
      success: true,
      msg: '图片删除成功!'
    })
  }).catch(err => {
    res.json({
      success: false,
      msg: '图片删除失败!',
      data: {
        err
      }
    })
  })
})

module.exports = router
