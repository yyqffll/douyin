/* eslint-disable */
const express = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const FfmpegCommand = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
FfmpegCommand.setFfmpegPath(ffmpegPath)

// 图片路径
const dyimgPath = path.join(__dirname, '../dyimg')
// 视频路径
const dyvideoPath = path.join(__dirname, '../dyvideo')
// 查找文件
const findFile = path => {
  return fs.existsSync(path)
}
// 读取文件
const readFile = path => {
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
// 删除文件
const deletFile = path => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(path)) {
      fs.unlink(path, err => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    } else {
      resolve(true)
    }
  })
}
// 重命名文件
const renameFile = (path, newPath) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(path)) {
      fs.rename(path, newPath, err => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    } else {
      reject('未找到文件!')
    }
  })
}

// 判断参数是否为空对象
function checkParam (param) {
  return JSON.stringify(param) === '{}' || !param
}

// 查找数据
function findOne (param, schema) {
  return new Promise((resolve, reject) => {
    if (checkParam(param)) {
      reject('参数不能为空!')
    } else {
      schema.findOne(param).then(data => {
        if (checkParam(data)) {
          reject('未查询到数据!')
        } else {
          resolve(data)
        }
      })
    }
  })
}

// 判断数据是否存在
function checkExist (param, schema) {
  return new Promise((resolve, reject) => {
    if (checkParam(param)) {
      reject('参数不能为空!')
    } else {
      schema.findOne(param).then(data => {
        if (checkParam(data)) {
          resolve(true)
        } else {
          reject('数据已存在!')
        }
      })
    }
  })
}

// 创建数据
function create (param, schema) {
  return new Promise((resolve, reject) => {
    if (checkParam(param)) {
      reject('参数不能为空!')
    } else {
      schema.create(param).then(data => {
        if (!checkParam(data)) {
          resolve(data)
        } else {
          reject('创建数据失败!')
        }
      })
    }
  })
}

module.exports = {
  express,
  path,
  multer,
  FfmpegCommand,
  dyimgPath,
  dyvideoPath,
  findFile,
  readFile,
  deletFile,
  renameFile,
  checkParam,
  findOne,
  checkExist,
  create
}
