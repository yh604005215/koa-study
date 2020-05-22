const Koa = require('koa')
const app =  new Koa()
const static = require('koa-static-router')
app.use(static({
  dir: 'public',
  router: '/:'
}))
require('dotenv').config()

const bodyParser = require('koa-bodyparser')
const userRouter = require('./router/userRouter')

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
