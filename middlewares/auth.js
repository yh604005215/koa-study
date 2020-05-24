const jsonwebtoken = require('jsonwebtoken')
module.exports = async (ctx, next) => {
  
  const token = ctx.request.header['authorization']
  
  if (token) {
    jsonwebtoken.verify(token, process.env.TOKEN, ( err, data ) =>{
      if ( err ) {
        ctx.status = 401
        ctx.body = { code: -1, msg:'身份校验失败,请重新登录'}
        return
      }   
      ctx.auth = data
    })
  } else {
    ctx.status = 401
    ctx.body = { code: -1, msg: '请携带token' }
    return 
  }
  if(ctx.auth) {
    await next()
  } 
}
