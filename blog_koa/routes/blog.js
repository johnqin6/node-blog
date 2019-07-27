const router = require('koa-router')()
const { 
  getList, 
  getDetail, 
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')

router.get('/list', async function(ctx, next) {
  let author = ctx.query.author || ''
  const keyword = ctx.query.keyword || ''

  if (ctx.query.isadmin) {
    // 管理员界面
    if (ctx.session.username == null) {
      // 未登录
      ctx.body = new ErrorModel('未登录')
    }
    // 强制返回本用户下的博客
    author = ctx.session.username
  }
  
  const listData = await getList(author, keyword)
  ctx.body = new SuccessModel(listData)
})

router.get('/detail', async function (ctx, next) {
  const data = await getDetail(ctx.query.id)
  ctx.body = new SuccessModel(data)
})

router.post('/new', loginCheck, async function (ctx, next) {
  ctx.request.body.author = ctx.session.username
  const data = await newBlog(ctx.request.body)
  ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async function (ctx, next) {
  ctx.request.body.author = ctx.session.username
  const val = await updateBlog(ctx.query.id, ctx.request)
  if (val) {
    ctx.body = new SuccessModel('更新成功')
  } else {
    ctx.body = new ErrorModel('更新失败')
  }
})

router.delete('/delete', loginCheck, async function (ctx, next) {
  const val = await delBlog(ctx.query.id)
  if (val) {
    ctx.body = new SuccessModel('删除成功')
  } else {
    ctx.body = new ErrorModel('删除失败')
  }
})

module.exports = router