const queryString = require('querystring')
const handleBlogRouter = require('./src/router/blog.js')
const handleUserRouter = require('./src/router/user.js')

// session 数据
const SESSION_DATA = {}

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
      if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
        postData = postDataParse(postData)
        resolve(postData)
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

  // 解析cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return
    }
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1]
    req.cookie[key] = val
  })
  
  // 解析session
  let needSetCookie = false
  // userId 用户的表示，方便session保存用户数据
  let userId = req.cookie.userId
  if (userId) { 
    if (!SESSION_DATA[userId]) { // 如果session保存数据中不存在该userId的数据,就将该userId设置为空对象
      SESSION_DATA[userId] = {}
    } 
  } else { // cookie中userId不存在就设置userId并将session数据添加以新增的userId的键
    needSetCookie = true
    userId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`
    SESSION_DATA[userId] = {}
  }
  req.session = SESSION_DATA[userId]

  // 处理post数据
  getPostData(req).then(postData => {
    req.body = postData

    // 处理blog路由
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) { // 根据该变量判断是否设置cookie
          // 操作cookie httpOnly限制前端更改cookie
          res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()};`)
        }
        res.end(JSON.stringify(blogData))
      })
      return 
    }

    // 处理user路由
    const userResult = handleUserRouter(req, res)
    if (userResult) {
      userResult.then(userData => {
        if (needSetCookie) {
          // 操作cookie httpOnly限制前端更改cookie
          res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()};`)
        }
        res.end(JSON.stringify(userData))
      })
      return
    }

    // 未命中路由，返回404
    res.end("404 NOT Found\n")
  })
  
}

module.exports = serveHandle

/**
 * 将post的string类型的数据解构为对象
 * @param {*} str 
 */
function postDataParse(str) {
  const arr = str.split('&');
  let postDatas = {}
  for (let i = 0; i < arr.length; i++) {
    let _arr = arr[i].split('=')
    postDatas[_arr[0]]= decodeURI(_arr[1])
  }
  return postDatas
}

// 获取cookie的过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  return d.toGMTString()
}
