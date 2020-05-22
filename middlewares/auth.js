const jsonwebtoken = require('jsonwebtoken')
module.exports = async (ctx, next) => {
  
  const token = ctx.request.header['authorization']
  
  if (token) {
    jsonwebtoken.verify(token, process.env.TOKEN, ( err, data ) =>{
      if ( err ) {
        ctx.status = 401
        ctx.body = '身份校验失败'
        return
      }   
      ctx.auth = data
    })
  } else {
    ctx.status = 401
    ctx.body = '请携带token'
    return 
  }
  if(ctx.auth) {
    await next()
  } 
}
