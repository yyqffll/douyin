const mongoose = require('mongoose')
const dbUrl = 'mongodb://124.223.7.93:27017/douyin'
mongoose.connect(dbUrl)
mongoose.connection.on('connected', () => {
  console.log('mongodb is connected')
})
module.exports = mongoose
