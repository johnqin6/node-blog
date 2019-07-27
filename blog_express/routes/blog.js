const express = require('express');
const router = express.Router();
const { 
  getList, 
  getDetail, 
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

/* GET home page. */
router.get('/list', function(req, res, next) {
  let author = req.query.author || ''
  const keyword = req.query.keyword || ''

  if (req.query.isadmin) {
    // 管理员界面
    if (req.session.username == null) {
      // 未登录
      res.json(new ErrorModel('未登录'))
    }
    // 强制返回本用户下的博客
    author = req.session.username
  }
  
  const result = getList(author, keyword)
  return result.then(listData => {
    res.json(new SuccessModel(listData)) 
  })
});

router.get('/detail', (req, res, next) => {
  const result = getDetail(req.query.id)
  return result.then(data => {
    res.send(new SuccessModel(data))
  })
})

router.post('/new', loginCheck, (req, res, next) => {
  req.body.author = req.session.username
  const result = newBlog(req.body)
  return result.then(data => {
    res.send(new SuccessModel(data))
  })
})

router.post('/update', loginCheck, (req, res, next) => {
  req.body.author = req.session.username
  const result = updateBlog(req.query.id, req.body)
  return result.then(val => {
    if (val) {
      res.send(new SuccessModel('更新成功'))
    } else {
      res.send(new ErrorModel('更新失败'))
    }
  })
})

router.delete('/delete', loginCheck, (req, res, next) => {
  const result = delBlog(req.query.id)
  return result.then(val => {
    if (val) {
      res.send(new SuccessModel('删除成功'))
    } else {
      res.send(new ErrorModel('删除失败'))
    }
  })
})

module.exports = router;