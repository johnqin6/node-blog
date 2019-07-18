const { register, login, deleteUser } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleUserRouter = (req, res) => {
  const method = req.method
  const id = req.query.id

  // 注册
  if (method === 'POST' && req.path === '/api/user/register') {
    const result = register(req.body)
    if (result) {
      return new SuccessModel()
    } 
    return new ErrorModel('注册失败！')
  }

  // 登录
  if (method === 'POST' && req.path === '/api/user/login') {
    console.log(req.body)
    const { username, password } = req.body 
    const result = login(username, password)
    if (result) {
      return new SuccessModel()
    } 
    return new ErrorModel('登录失败！')
  }

   // 注销用户
   if (method === 'DELETE' && req.path === '/api/user/delete') {
    const result = deleteUser(id)
    if (result) {
      return new SuccessModel()
    } 
    return new ErrorModel('删除用户失败！')
  }
}

module.exports = handleUserRouter
