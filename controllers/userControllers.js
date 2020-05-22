const UserModel = require('../models/userModel')
const jsonwebtoken = require('jsonwebtoken')
exports.register = async ctx => {
  const { userName, roleType } = ctx.request.body
  const data = await UserModel.findOne({userName})

  if (data) {
    ctx.body = { code: -1, msg: '用户以存在' }
    return
  }
  const roleName = ['小编', '管理员', '超级管理员']
  console.log({...ctx.request.body, roleName: roleName[roleType]});
  
  await UserModel.create({...ctx.request.body, roleName: roleName[roleType - 1]})

  ctx.body = '注册成功'
}

exports.login = async ctx => {
  const { userName, password } = ctx.request.body
  const data = await UserModel.findOne({userName})
  if ( !data || !data.comparePassword(password) ) {
    ctx.body = {code: -1, msg:"用户名或密码不正确"}
    return
  }

  const token = jsonwebtoken.sign({
    userId: data._id
  },process.env.TOKEN, {
    expiresIn: '1d'
  })
  
  ctx.body = { code: 0, msg: "登录成功", token }
}

exports.userInfo = async ctx => {
  
  const { userId } = ctx.auth
  const data = await UserModel.findOne({_id:userId},{password:0})
  ctx.body = { code: 0, msg: "成功", data}
  
}
