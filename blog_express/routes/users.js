var express = require('express');
var router = express.Router();
const { register, login, deleteUser } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

/* GET users listing. */
router.post('/login', function(req, res, next) {
  const { username, password } = req.body
  const result = login(username, password)
  return result.then(data => {
    if (data.username) {
      // 设置session
      req.session.username = data.username
      req.session.realname = data.realname

      res.json(new SuccessModel(data))
    } 
    res.json(new ErrorModel('登录失败！'))
  })
});

// 测试登录
router.get('/login-test',loginCheck, (req, res, next) => {
  console.log(req.session)
})

// 测试session
router.get('/session-test', (req, res) => {
  const session = req.session
  if (session.viewNum == null) {
    session.viewNum = 0
  }
  session.viewNum++

  res.json({
    viewNum: session.viewNum
  })
})

module.exports = router;
