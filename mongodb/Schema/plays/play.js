const mongoose = require('../../index')
const Schema = mongoose.Schema
const VideoSchema = new Schema({
  userId: { type: String },
  videoId: { type: String },

  name: { type: String },
  img: { type: String },
  duration: { type: Number },
  title: { type: String },
  likeNum: { type: Number },
  commentId: { type: Array },
  collectNum: { type: Number }
})
const VideoNodel = mongoose.model('videos', VideoSchema)
module.exports = VideoNodel
