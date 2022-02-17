const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()
const multer = require('multer')
const FfmpegCommand = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
FfmpegCommand.setFfmpegPath(ffmpegPath)

const dirPath = path.join(__dirname, '../../../dyvideo')

const uploadDest = multer({
  dest: dirPath
})

const cut = (filename, req, res) => {
  FfmpegCommand(path.join(dirPath, `${req.body.videoName}`))
    .seekInput(req.body.startTime)
    .duration(req.body.endTime)
    .output(path.join(dirPath, filename))
    .on('err', () => {
      res.json({
        success: false,
        msg: '未知错误,请联系管理员!'
      })
    })
    .on('end', () => {
      fs.readFile(path.join(dirPath, filename), (err, data) => {
        if (err) {
          res.json({
            success: false,
            msg: '未知错误,请联系管理员!'
          })
        } else {
          res.json({
            success: true,
            msg: '剪辑成功!',
            data: {
              video: data
            }
          })
        }
      })
    })
    .run()
}
router.post('/play/upload', uploadDest.single('file'), (req, res) => {
  if (req.file) {
    res.json({
      success: true,
      msg: '上传成功!',
      data: req.file
    })
  } else {
    res.json({
      success: false,
      msg: '未知错误,请联系管理员!',
    })
  }
})

router.post('/play/delete', (req, res) => {
  fs.unlink(path.join(dirPath, req.body.name), err => {
    if (err) {
      res.json({
        success: false,
        msg: '未知错误,请联系管理员!'
      })
    } else {
      res.json({
        success: true,
        msg: '删除成功!',
      })
    }
  })
})

router.post('/play/cut', (req, res) => {
  const filename = `${req.body.videoName}-edit.${req.body.videoType}`
  if (fs.existsSync(path.join(dirPath, filename))) {
    fs.unlink(path.join(dirPath, filename), err => {
      if (err) {
        res.json({
          success: false,
          msg: '未知错误,请联系管理员!'
        })
      } else {
        cut(filename, req, res)
      }
    })
  } else {
    cut(filename, req, res)
  }
})
module.exports = router
