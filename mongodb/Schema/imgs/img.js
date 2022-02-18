const mongoose = require('../../index')
const Schema = mongoose.Schema
const VideoSchema = new Schema({
  imgId: { type: String },
})
const VideoNodel = mongoose.model('videos', VideoSchema)
module.exports = VideoNodel
