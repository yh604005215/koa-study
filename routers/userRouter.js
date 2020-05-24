const router = require('koa-router')()
const auth = require('../middlewares/auth')

const ladaimg = require('../middlewares/lodaimg')
const { register,
        login,
        userInfo,
        userList,
        update,
        remove } = require('../controllers/userControllers')


/**  
 * @api {post} http://localhost:5000/register 登录 
 * @apiGroup user
 *
 * @apiParam {String} user 用户邮箱
 * @apiParam {String} password  用户密码
 * @apiParam {String} roleType  权限等级只能1-3 小编，管理员，超级管理员
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


/**  
 * @api {get} http://localhost:5000/user 获取当前登录用户的基本信息
 * @apiGroup user
 *
 * @apiHeader {String} Authorization token
 * 
 * @apiSuccess {Number} code  错误状态码
 * @apiSuccess {String} msg 错误消息
 * @apiSuccess {Object} data 当前用户的基本信息
*/
router.get('/user', auth, userInfo)


/**  
 * @api {put} http://localhost:5000/:userId 修改用户的基本信息
 * @apiGroup user
 *
 * @apiParam {String} userId 要修改用户的id
 * 
 * @apiParam {Object} data 要修改的数据
 * 
 * @apiHeader {String} Authorization token
 * @apiSuccess {Number} code  错误状态码
 * @apiSuccess {String} msg 错误消息
 * @apiSuccess {Object} data 当前用户的基本信息
*/
router.put('/user/:userId', auth, ladaimg, update)

/**  
 * @api {delete} http://localhost:5000/:userId 删除用户
 * @apiGroup user
 *
 * @apiParam {String} userId 要删除用户的id
 * 
 * @apiHeader {String} Authorization token
 * 
 * @apiSuccess {Number} code  错误状态码
 * @apiSuccess {String} msg 错误消息
 * @apiSuccess {Object} data 当前用户的基本信息
*/

router.delete('/user/:userId', auth, remove)

/**  
 * @api {get} http://localhost:5000/userList 获取用户列表信息
 * @apiGroup user
 *
 * @apiParam {String} userId 当前用户id
 * @apiParam {String} pageNum=1 页码<可选>
 * @apiParam {String} pageSize=5 每页显示条数<可选>
 * @apiParam {String} userName 搜索用户名关键字<可选>
 * 
 * 
 * @apiSuccess {Number} code  错误状态码
 * @apiSuccess {String} msg 错误消息
 * @apiSuccess {Object} data 数据
*/

router.get('/userList', userList)

module.exports = router
