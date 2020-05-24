const UserModel = require('../models/userModel')
const jsonwebtoken = require('jsonwebtoken')

//注册
exports.register = async ctx => {
  const { userName, roleType } = ctx.request.body
  const data = await UserModel.findOne({userName})

  if (data) {
    ctx.body = { code: -1, msg: '用户以存在' }
    return
  }
  const roleName = ['小编', '管理员', '超级管理员']
  
  await UserModel.create({...ctx.request.body, roleName: roleName[roleType - 1]})

  ctx.body = { code: 0, msg: '注册成功' }
}

//登录
exports.login = async ctx => {
  const { userName, password } = ctx.request.body
  const data = await UserModel.findOne({userName})
  if ( !data || !data.comparePassword(password) ) {
    ctx.body = {code: -1, msg:"用户名或密码不正确"}
    return
  }

  if ( !data.roleState ) {
    ctx.body = {code: -1, msg:"账号未启用,请找管理员开启"}
    return
  }


  const token = jsonwebtoken.sign({
    userId: data._id
  },process.env.TOKEN, {
    expiresIn: '1d'
  })
  
  ctx.body = { code: 0, msg: "登录成功", token }
}

//获取用户信息
exports.userInfo = async ctx => {
  
  const { userId } = ctx.auth
  const data = await UserModel.findOne({_id:userId},{password:0})
  ctx.body = { code: 0, msg: "成功", data}
  
}

//获取用户列表
exports.userList = async ctx => {
  const { userId, pageNum = 1, pageSize = 5, nickName } = ctx.query
  
  const {roleType} = await UserModel.findOne({_id: userId})

  if ( roleType < 2 ) {
    ctx.body = { code: -1, msg: "权限等级不够" }
    return
  }

  const data = await UserModel.find({userName: new RegExp(nickName)},{password:0})
    .populate('userId', 'userName')
    .skip((pageNum - 1) * pageSize)
    .limit( ~~pageSize )

  const total = await UserModel.find({userName: new RegExp(nickName)}).countDocuments()
  const totalPage = Math.ceil(total / pageSize)
  ctx.body = {code: 0, msg: "成功", data:{list: data, totalPage, total}}
}

// 修改用户信息
exports.update = async ctx =>{
  const { userId } = ctx.params
  const roleId = ctx.auth.userId
  const {roleType} = await UserModel.findOne({_id: roleId})

  if ( userId !== roleId && roleType < 2 ) {
    ctx.body = { code: -1, msg: "权限等级不够" }
    return
  }
  
  await UserModel.updateOne({_id:userId}, ctx.request.body)

  if (ctx.request.body.avatar) {  
    ctx.body = {code: 0, msg: "头像修改成功",avatar:ctx.request.body.avatar}
    return
  }

  ctx.body = {code: 0, msg: "修改成功"}
}

//删除用户信息
exports.remove = async ctx => {
  const { userId } = ctx.params
  const roleId = ctx.auth.userId
  const {roleType} = await UserModel.findOne({_id: roleId})

  if ( roleType < 2 ) {
    ctx.body = { code: -1, msg: "权限等级不够" }
    return
  }

  await UserModel.deleteOne({_id:userId})
  ctx.body = {code: 0, msg: "删除成功"}
}
