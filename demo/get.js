// get请求示例  
const http = require('http');
const querystring = require('querystring');

// 创建一个http服务
const server = http.createServer((req, res) => {
  // res.end('hello world')
  console.log(req.method);
  const url = req.url;
  console.log('url: ' + url);
  // 将url参数解析为对象
  req.query = querystring.parse(url.split('?')[1]);
  console.log('query: ', req.query);

  res.end(JSON.stringify(req.query));
})

// 监听端口
server.listen(3000, () => {
  console.log('服务器已开启，请访问地址：http://localhost:3000')
})