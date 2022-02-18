/**
 * imgName 图片文件名称
 * imgPath 图片文件完整路径
 */

const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()

const multer = require('multer')

const dirPath = path.join(__dirname, '../../../dyimg')

const uploadDest = multer({
  dest: dirPath
}).single('file')

const findFile = (path) => {
  return fs.existsSync(path)
}

const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

const deletFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, err => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

router.post('/img/upload', uploadDest, (req, res) => {
  if (req.file) {
    const imgPath = path.join(dirPath, req.file.originalname)
    if (findFile(imgPath)) {
      deletFile(imgPath).then(
        res.json({
          success: true,
          msg: '上传成功!',
          data: req.file
        })
      ).catch(err => {
        res.json({
          success: false,
          msg: '上传失败!',
          error: err
        })
      })
    } else {
      res.json({
        success: true,
        msg: '上传成功!',
        data: req.file
      })
    }
    return
  }
  res.json({
    success: false,
    msg: '上传失败!',
  })
})

router.post('/img/find', (req, res) => {
  const imgPath = path.join(dirPath, req.body.imgName)
  readFile(imgPath).then(data => {
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
        error: err
      }
    })
  })
})

router.post('/img/delete', (req, res) => {
  const imgPath = path.join(dirPath, req.body.imgName)
  deletFile(imgPath).then(() => {
    res.json({
      success: true,
      msg: '图片删除成功!'
    })
  }).catch(err => {
    res.json({
      success: false,
      msg: '图片删除失败!',
      data: {
        error: err
      }
    })
  })
})

module.exports = router
