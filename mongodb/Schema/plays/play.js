/**
 * userId: 用户
 * videoName: 服务器存储视频名称
 * videoType: 视频类型
 * videoDuration: 视频时长
 * videoImgName: 服务器存储视频封面名称
 * videoDescribe: 视频描述
 * videoDownload: 视频是否允许下载
 * videoOpen: 视频是否公开发布
 * videoLikeNum: 视频点赞数量
 * videoCollectNum: 视频收藏数量
 */

const mongoose = require('../../index')
const Schema = mongoose.Schema
const VideoSchema = new Schema({
  userId: { type: String },
  videoName: { type: String },
  videoType: { type: String },
  videoDuration: { type: Number },
  videoImgName: { type: String },
  videoDescribe: { type: String },
  videoDownload: { type: Boolean, default: false },
  videoOpen: { type: Boolean, default: true },
  videoLikeNum: { type: Number, default: 0 },
  videoCollectNum: { type: Number, default: 0 },
  videoPrice: { type: Number, default: 0 },
})
const VideoNodel = mongoose.model('videos', VideoSchema)
module.exports = VideoNodel
