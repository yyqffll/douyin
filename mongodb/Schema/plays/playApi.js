/**
 * videoName 视频文件名称
 * startTime 视频开始时间
 * endTime 视频结束时间
 * videoPath 视频文件完整路径
 * videoEditPath 剪辑视频完整路径
 */

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

router.post('/play/upload', uploadDest.single('file'), (req, res) => {
  if (req.file) {
    res.json({
      success: true,
      msg: '上传成功!',
      data: req.file
    })
    return
  }
  res.json({
    success: false,
    msg: '上传失败!',
  })
})

router.post('/play/delete', (req, res) => {
  const videoPath = path.join(dirPath, req.body.videoName)
  const videoEditPath = path.join(dirPath, `${req.body.name}-edit.${req.body.videoType}`)
  const p1 = new Promise((resolve, reject) => {
    deletFile(videoPath).then(() => {
      resolve(true)
    }).catch(err => {
      reject(err)
    })
  })
  const p2 = new Promise((resolve, reject) => {
    if (findFile(videoEditPath)) {
      deletFile(videoEditPath).then(() => {
        resolve(true)
      }).catch(err => {
        reject(err)
      })
    } else {
      resolve(true)
    }
  })
  Promise.all([p1, p2]).then(() => {
    res.json({
      success: true,
      msg: '删除成功!'
    })
  }).catch(err => {
    res.json({
      success: false,
      msg: '删除失败!',
      data: {
        error: err
      }
    })
  })
})

router.post('/play/cut', (req, res) => {
  const cut = (path, targetPath, req, res) => {
    FfmpegCommand(path)
      .seekInput(req.body.startTime)
      .duration(req.body.endTime)
      .output(targetPath)
      .on('err', err => {
        res.json({
          success: false,
          msg: '视频剪辑失败!',
          data: {
            error: err
          }
        })
      })
      .on('end', () => {
        readFile(targetPath).then(data => {
          res.json({
            success: true,
            msg: '剪辑成功!',
            data: {
              video: data
            }
          })
        }).catch(err => {
          res.json({
            success: false,
            msg: '剪辑后文件读取失败!',
            data: {
              error: err
            }
          })
        })
      })
      .run()
  }
  const videoPath = path.join(dirPath, req.body.videoName)
  const videoEditPath = path.join(dirPath, `${req.body.videoName}-edit.${req.body.videoType}`)
  if (findFile(videoEditPath)) {
    deletFile(videoEditPath).then(() => {
      cut(videoPath, videoEditPath, req, res)
    }).catch(err => {
      res.json({
        success: false,
        msg: '未知错误,请联系管理员!',
        data: {
          error: err
        }
      })
    })
  } else {
    cut(videoPath, videoEditPath, req, res)
  }
})
module.exports = router
