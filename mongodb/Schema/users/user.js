const mongoose = require('../../index')
const Schema = mongoose.Schema
const UserSchema = new Schema({
  userId: { type: String },
  userName: { type: String },
  userPwd: { type: String },
  userImg: { type: String, default: '' },
  userVideoCount: { type: Number, default: 0 },
})
const UserNodel = mongoose.model('users', UserSchema)
module.exports = UserNodel
