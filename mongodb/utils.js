/* eslint-disable */
const path = require('path')
const fs = require('fs')

// 图片路径
const dyimgPath = path.join(__dirname, '../dyimg')
// 视频路径
const dyvideoPath = path.join(__dirname, '../dyvideo')
// 文件删除
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
  path,
  dyimgPath,
  dyvideoPath,
  deletFile,
  checkParam,
  findOne,
  checkExist,
  create
}
