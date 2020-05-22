const router = require('koa-router')()
const auth = require('../middlewares/auth')
const { register, login, userInfo } = require('../controllers/userControllers')

/**  
 * @api {post} http://localhost:5000/register 登录 
 * @apiGroup user
 *
 * @apiParam {String} user 用户邮箱
 * @apiParam {String} password  用户密码
 *  @apiParam {String} roleType  权限等级
 *
 * @apiSuccess {Number} code  错误状态码
 * @apiSuccess {String} msg 错误消息
*/

router.post('/register', register)

/**  
 * @api {post} http://localhost:5000/login 登录 
 * @apiGroup user
 *
 * @apiParam {String} email 用户邮箱
 * @apiParam {String} password  用户密码
 *
 *
 * @apiSuccess {Number} code  错误状态码
 * @apiSuccess {String} msg 错误消息
 * @apiSuccess {String} token token
*/

router.post('/login', login)


router.get('/userInfo', auth, userInfo)


module.exports = router
