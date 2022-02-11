const mongoose = require('../index')
const Schema = mongoose.Schema
const UsersSchema = new Schema({
  userName: { type: String },
  userPwd: { type: String }
})
const UsersNodel = mongoose.model('users', UsersSchema)
module.exports = UsersNodel
