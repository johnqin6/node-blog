const queryString = require('querystring')
const handleBlogRouter = require('./src/router/blog.js')
const handleUserRouter = require('./src/router/user.js')

// 用于处理 post数据
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return 
    }
    // if (req.headers['content-type' !== 'application/json']) {
    //   resolve({})
    //   return
    // }
    // 接收数据
    let postData = '';
    // 监听数据流
    req.on('data', chunk => {
      postData += chunk.toString();
    });

    // 监听数据流结束
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(postData)
    })
  })
  return promise
}

const serveHandle = (req, res) => {
  // 设置返回的格式为 json
  res.setHeader('Content-type', 'application/json')
  // process.env.NODE_ENV
  
  // 获取path
  const url = req.url
  req.path = url.split('?')[0]

  // 解析query
  req.query = queryString.parse(url.split('?')[1])
  
  // 处理post数据
  getPostData(req).then(postData => {
    req.body = postData

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
  })
  
}

module.exports = serveHandle