const mongoose = require('mongoose')
const dbUrl = 'mongodb://root:Yyq133136.@124.223.7.93:27017/douyin?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false'
mongoose.connect(dbUrl)
mongoose.connection.on('connected', () => {
  console.log('mongodb douyin is connected')
})
module.exports = mongoose
