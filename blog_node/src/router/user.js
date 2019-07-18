const handleUserRouter = (req, res) => {
  const method = req.method
  const url = req.url
  const path = url.split('?')[0]

  // 注册
  if (method === 'POST' && path === '/api/user/register') {
    return {
      msg: '这是注册的接口'
    }
  }

  // 登录
  if (method === 'POST' && path === '/api/user/login') {
    return {
      msg: '这是登录的接口'
    }
  }

   // 注销用户
   if (method === 'DELETE' && path === '/api/user/logout') {
    return {
      msg: '这是注销用户的接口'
    }
  }
}

module.exports = handleUserRouter
