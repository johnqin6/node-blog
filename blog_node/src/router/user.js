const { register, login, deleteUser } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

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
    const result = login(username, password)
    return result.then(res => {
      if (res) {
        return new SuccessModel(res)
      } 
      return new ErrorModel('登录失败！')
    })
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
