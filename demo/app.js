// 中间件
const express = require('express')
const app = express()

app.use((req, res, next) => {
  console.log('请求开始...', req.method, req.url)
  next()
})

app.use((req, res, next) => {
  // 假设处理cookie
  req.cookie = {
    userId: 'abc123'
  }
  next()
})

app.use((req, res, next) => {
  // 假设处理 post data
  // 异步
  setTimeout(() => {
    req.body = {
      a: 100,
      b: 200,
      c: 300
    }
    next()
  },100)
})

app.use('/api', (req, res, next) => {
  console.log('处理 /api路由')
  next()
})

app.use('/api', (req, res, next) => {
  console.log('get /api路由')
  next()
})

app.use('/api', (req, res, next) => {
  console.log('post /api路由')
  next()
})

// 模拟登录验证
function loginCheck(req, res, next) {
  setTimeout(() => {
    console.log('模拟登录失败')
    res.json({
      errno: -1,
      msg: '登录失败'
    })
    // console.log('模拟登录成功')
    // next()
  })
}

app.get('/api/get-cookie',loginCheck, (req, res, next) => {
  console.log('get api/get-cookie')
  res.json({
    errno: 0,
    data: req.cookie
  })
})

app.post('/api/get-post-data', (req, res, next) => {
  console.log('post api/get-post-data')
  res.json({
    errno: 0,
    data: req.body
  })
})

app.use((req, res, next) => {
  console.log('处理404')
  res.json({
    errno: 0,
    msg: '404 NOT Fount'
  })
})

app.listen(3001, () => {
  console.log('服务器开启，地址：http://localhost:3001')
})