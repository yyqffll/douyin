/**
 * videoName 视频文件名称
 * startTime 视频开始时间
 * endTime 视频结束时间
 * videoPath 视频文件完整路径
 * videoEditPath 剪辑视频完整路径
 */

const utils = require('../../utils')
const router = utils.express.Router()
const Play = require('./play')
const User = require('../users/user')

const uploadDest = utils.multer({
  dest: utils.dyvideoPath
}).single('file')

const nameEnd = req => {
  return `-edit.${req.body.videoType}`
}

const videoImgPath = req => {
  return utils.path.join(utils.dyimgPath, req.body.videoImgName)
}

const videoPath = req => {
  return utils.path.join(utils.dyvideoPath, req.body.videoName)
}

const videoEditPath = req => {
  return utils.path.join(utils.dyvideoPath, `${req.body.videoName.replace(nameEnd(req), '')}${nameEnd(req)}`)
}

router.post('/play/upload', uploadDest, (req, res) => {
  if (req.file) {
    res.json({
      success: true,
      msg: '视频上传成功!',
      data: req.file
    })
    return
  }
  res.json({
    success: false,
    msg: '视频上传失败!',
  })
})

router.post('/play/delete', (req, res) => {
  const p1 = new Promise((resolve, reject) => {
    utils.deletFile(videoPath(req)).then(() => {
      resolve(true)
    }).catch(err => {
      reject(err)
    })
  })
  const p2 = new Promise((resolve, reject) => {
    utils.deletFile(videoEditPath(req)).then(() => {
      resolve(true)
    }).catch(err => {
      reject(err)
    })
  })
  Promise.all([p1, p2]).then(() => {
    res.json({
      success: true,
      msg: '视频删除成功!'
    })
  }).catch(err => {
    res.json({
      success: false,
      msg: '视频删除失败!',
      data: {
        err
      }
    })
  })
})

router.post('/play/deleteEdit', (req, res) => {
  utils.deletFile(videoEditPath(req)).then(() => {
    res.json({
      success: true,
      msg: '剪辑视频删除成功!',
      data: {
        videoName: req.body.videoName.replace(nameEnd(req), '')
      }
    })
  }).catch(err => {
    res.json({
      success: false,
      msg: '剪辑视频删除失败!',
      data: {
        err
      }
    })
  })
})

router.post('/play/cut', (req, res) => {
  const cut = (path, targetPath, req, res) => {
    return new Promise((resolve, reject) => {
      let newPath = ''
      if (!req.body.videoName.includes('edit')) {
        utils.deletFile(videoEditPath(req))
        newPath = path
      } else {
        newPath = `${req.body.videoName.replace(nameEnd(req))}-oldEdit.${req.body.videoType}`
        utils.renameFile(path, newPath).catch(err => {
          reject(err)
        })
      }
      utils.FfmpegCommand(newPath)
        .seekInput(req.body.startTime)
        .duration(req.body.endTime)
        .output(targetPath)
        .on('err', err => {
          reject(err)
        })
        .on('end', () => {
          if (newPath !== path) {
            utils.deletFile(newPath)
          }
          utils.readFile(targetPath).then(data => {
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        })
        .run()
    })
  }
  cut(videoPath(req), videoEditPath(req), req, res).then(data => {
    res.json({
      success: true,
      msg: '视频剪辑成功!',
      data: {
        video: data,
        videoName: `${req.body.videoName.replace(nameEnd(req), '')}${nameEnd(req)}`
      }
    })
  }).catch(err => {
    res.json({
      success: false,
      msg: '视频剪辑失败!',
      data: {
        err
      }
    })
  })
})

router.post('/play/add', (req, res) => {
  if (req.body.videoName.includes('edit')) {
    utils.deletFile(utils.path.join(utils.dyvideoPath, req.body.videoName.replace(nameEnd(req), '')))
  }
  utils.create(req.body, Play).then(videoData => {
    utils.findOne({ userId: videoData.userId }, User).then(userData => {
      User.updateOne(
        { userId: userData.userId },
        { userVideoCount: ++userData.userVideoCount },
        { new: true }
      )
    })
    res.json({
      success: true,
      msg: '视频发布成功!',
      data: videoData
    })
  }).catch(err => {
    res.json({
      success: false,
      msg: '视频发布失败!',
      data: {
        err
      }
    })
  })
})

router.post('/play/findAll', (req, res) => {
  try {
    Play.find({}).limit(5).skip(req.body.length).then(data => {
      const finalData = []
      if (data.length > 0) {
        data.forEach(item => {
          const finalItem = JSON.parse(JSON.stringify(item))
          finalItem.video = null
          finalItem.img = null
          utils.readFile(videoPath({ body: item })).then(data => {
            finalItem.video = data
          })
          utils.readFile(videoImgPath({ body: item })).then(data => {
            finalItem.img = data
          })
          finalData.push(finalItem)
        })
      }
      setTimeout(() => {
        res.json({
          success: true,
          msg: '获取视频成功!',
          data: finalData
        })
      }, 100)
    })
  } catch (err) {
    res.json({
      success: false,
      msg: '获取视频失败!',
      data: {
        err
      }
    })
  }
})
module.exports = router
