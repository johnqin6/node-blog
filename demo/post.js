// post请求示例  
const http = require('http');

// 创建一个http服务
const server = http.createServer((req, res) => {
  // 判断是否是post请求
  if (req.method === 'POST') {
    // 获取请求头部,判断数据格式
    console.log('content-type', req.headers['content-type']);
    // 接收数据
    let postData = '';
    // 监听数据流
    req.on('data', chunk => {
      postData += chunk.toString();
    });

    // 监听数据流结束
    req.on('end', () => {
      console.log(postData);
      res.end('hello world');
    })
  }
})

// 监听端口
server.listen(3001, () => {
  console.log('服务器已开启，请访问地址：http://localhost:3001')
})