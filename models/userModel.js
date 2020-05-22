const mongoose = require('../confug/db')
const bcryptjs = require('bcryptjs')
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator (val) {
        return /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(val)
      },
      //校验失败
      message: '只能是数字、字母和中文组成，不能包含特殊符号和空格'
    }
  },
  password: {
    type: String,
    required: true
  },
  roleType: {
    type: String,
    require: true,
    validate: {
      validator (val) {
        return /^[1-3]$/.test(val)
      },
      //校验失败
      message: '只能是1-3'
    }
  },
  roleName: {
    type: String,
    required: true,
    validate: {
      validator (val) {
        if(val === '小编' || val === '管理员' || val === '超级管理员') return true
        return false
      },
      //校验失败
      message: 'roleName错误'
    }
  },
  avatar:{
    type: String,
    default: `${process.env.BASEURL}/assets/img/avatar.png`
  }
}, {
  timestamps: true
})

userSchema.pre('save', function (next){
  //对this.password加密之后，再赋值
  this.password = bcryptjs.hashSync(this.password,10)
  next()
})

userSchema.methods.comparePassword = function (password){
  //bcryptjs.compareSync(原密码,加密后的密码);
  return bcryptjs.compareSync(password,this.password)
}

const UserMdoel = mongoose.model('user', userSchema) 

module.exports = UserMdoel
