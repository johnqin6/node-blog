const { register, login, deleteUser } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set } = require('../db/redis')

const handleUserRouter = (req, res) => {
  const method = req.method
  const id = req.query.id

  // 注册
  if (method === 'POST' && req.path === '/api/user/register') {
    const result = register(req.body)
    return result.then(res => {
      return new SuccessModel(res)
    })
  }

  // 登录
  if (method === 'POST' && req.path === '/api/user/login') {
    const { username, password } = req.body
    // const { username, password } = req.query 
    const result = login(username, password)
    return result.then(data => {
      if (data.username) {

        // 设置session
        req.session.username = data.username
        req.session.realname = data.realname
        
        // session同步到redis中
        set(req.sessionId, req.session)
      
        return new SuccessModel(data)
      } 
      return new ErrorModel('登录失败！')
    })
  }

  // 登录验证的测试
  if (method === 'GET' && req.path === '/api/user/login-test') {
    if (req.session.username) {
      return Promise.resolve(new SuccessModel({session: req.session}))
    }
    return Promise.resolve(new ErrorModel('尚未登录'))
  }

  // 注销用户
  if (method === 'DELETE' && req.path === '/api/user/delete') {
    const username = req.query.username
    const result = deleteUser(id, username)
    return result.then(res => {
      if (res) {
        return new SuccessModel('删除用户成功！')
      } 
      return new ErrorModel('删除用户失败！')
    })
  }
}

module.exports = handleUserRouter
