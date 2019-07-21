// 标准输入输出  
// process.stdin-》输入  process.stdout-》输入  pipe -> 管道，将输入以管道的形式输出
// process.stdin.pipe(process.stdout)

const http = require('http')
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    // 输入直接通过管道输出
    req.pipe(res)
  }
})
server.listen(8000)