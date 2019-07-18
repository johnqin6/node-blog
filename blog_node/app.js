const handleBlogRouter = require('./src/router/blog.js')
const handleUserRouter = require('./src/router/user.js')

const serveHandle = (req, res) => {
  // 设置返回的格式为 json
  res.setHeader('Content-type', 'application/json')
  // process.env.NODE_ENV
  
  // 处理blog路由
  const blogData = handleBlogRouter(req, res)
  if (blogData) {
    res.end(JSON.stringify(blogData))
  }

  // 处理user路由
  const userData = handleUserRouter(req, res)
  if (userData) {
    res.end(JSON.stringify(userData))
  }

  // 未命中路由，返回404
  res.end("404 NOT Found\n")
}

module.exports = serveHandle