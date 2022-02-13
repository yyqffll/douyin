const mongoose = require('../index')
const Schema = mongoose.Schema
const UsersSchema = new Schema({
  userId: { type: String },
  userName: { type: String },
  userPwd: { type: String },
  userImg: { type: String }
})
const UsersNodel = mongoose.model('users', UsersSchema)
module.exports = UsersNodel
