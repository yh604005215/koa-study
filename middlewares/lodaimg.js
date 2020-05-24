
const path = require('path')
const fs = require('fs')

module.exports = async (ctx, next) =>{
  
  if (!ctx.request.files) {
    await next()
    return
  }
  const file = ctx.request.files.avatar
  
  const newFileName =  `${file.path}-${file.name}`.split('uploads\\')[1]

  const newFilePath = path.resolve(__dirname, '../public/assets/img',newFileName)

  // 读文件
  const fileData = fs.readFileSync(file.path)
  //写文件
  fs.writeFileSync(newFilePath, fileData)

  ctx.request.body.avatar = `${process.env.BASEURL}/public/assets/img/${newFileName}`
  await next()
}
