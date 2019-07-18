const handleUserRouter = (req, res) => {
  const method = req.method

  // 注册
  if (method === 'POST' && req.path === '/api/user/register') {
    return {
      msg: '这是注册的接口'
    }
  }

  // 登录
  if (method === 'POST' && req.path === '/api/user/login') {
    return {
      msg: '这是登录的接口'
    }
  }

   // 注销用户
   if (method === 'DELETE' && req.path === '/api/user/delete') {
    return {
      msg: '这是注销用户的接口'
    }
  }
}

module.exports = handleUserRouter
