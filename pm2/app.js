const http = require('http')

const server = http.createServer((req, res) => {
  res.setHeader('Content-type', 'application/json')

  // 模拟一个错误
  if (req.url === '/err') {
    throw new Error('/err 出错了')
  }

  res.end(
    JSON.stringify({
      error: 0,
      msg: 'pm2 test server 3'
    })
  )
})

server.listen(3002)
console.log('server in http://localost:3002')