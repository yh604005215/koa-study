const mongoose = require('mongoose')
const url = 'mongodb://106.52.239.202:27017/koa'
//连接数据库
mongoose
  .connect(url, { useNewUrlParser : true, useUnifiedTopology: true} )
  .then(() => {
    console.log('数据库连接成功')
  })
  .catch(error => {
    console.log('数据库连接失败')
    console.log(error)
  })

module.exports = mongoose
