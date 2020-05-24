const Koa = require('koa')
const app =  new Koa()
const cors = require('koa2-cors')
const koaBody = require('koa-body') 
const static = require('koa-static-router')
app.use(static('public'))
require('dotenv').config()


const bodyParser = require('koa-bodyparser')
const userRouter = require('./routers/userRouter')


app.use(
  cors({
      origin: function(ctx) { //设置允许来自指定域名请求
          if (ctx.url === '/test') {
              return '*'; // 允许来自所有域名请求
          }
          return 'http://localhost:3000'; //只允许http://localhost:3000这个域名的请求
      },
      maxAge: 5, //指定本次预检请求的有效期，单位为秒。
      credentials: true, //是否允许发送Cookie
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
      allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'], //设置服务器支持的所有头信息字段
      exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
  })
)

app.use(koaBody({
  multipart: true,
  formidable: {
    maxFieldsSize: 2000 * 1024 * 1024,
    uploadDir: './uploads'
  }
}))


app.use(async (ctx, next) =>{
  try {
    await next()
  } catch (error) {
    // 响应用户
    ctx.status = error.statusCode || error.status || 500
    ctx.body = error.message
    ctx.app.emit('error', error);// 触发应用层级错误事件
  }
})

app
  .use(bodyParser())
  .use(userRouter.routes())
  .use(userRouter.allowedMethods())

app.on('error',(err) => {
  console.error(err);
})

app.listen(5000, ()=>{
  console.log('项目启动成功')
})
