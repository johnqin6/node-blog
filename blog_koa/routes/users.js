const router = require('koa-router')()
const { register, login, deleteUser } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/user')

router.post('/login', async function (ctx, next) {
  const { username, password } = ctx.request.body
  const data = await login(username, password)
  console.log(data)
  if (data.username) {
    // 设置session
    ctx.session.username = data.username
    ctx.session.realname = data.realname

    ctx.body = new SuccessModel(data)
    return
  } 
  ctx.body = new ErrorModel('登录失败！')
})

// 测试登录
router.get('/login-test',loginCheck, async function(ctx, next) {
  console.log(ctx.session)
})

// 测试session
router.get('/session-test', async function (ctx, next) {
  if (ctx.session.viewCount == null) {
    ctx.session.viewCount = 0
  }
  ctx.session.viewCount++
  ctx.body = {
    errno: 0,
    viewCount: ctx.session.viewCount
  }
})

module.exports = router
