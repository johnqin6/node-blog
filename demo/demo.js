// 综合示例  
const http = require('http');
const querystring = require('querystring');

// 创建一个http服务
const server = http.createServer((req, res) => {
  const method = req.method; // 请求方法
  const url = req.url;  // 请求的url
  const path = url.split('?')[0];  // 请求的路径
  const query = url.split('?')[1];  // 请求的参数

  // 设置返回格式为 json
  res.setHeader('Content-type', 'application/json');

  // 返回的数据
  const resData = {
    method,
    url,
    path,
    query
  };

  // get请求时返回
  if (method === 'GET') {
    res.end(JSON.stringify(resData));
  }

  // post请求时返回
  if (method === 'POST') {
    let postData = '';
    // 监听数据流
    req.on('data', chunk => {
      postData += chunk.toString();
    });

    // 监听数据流结束
    req.on('end', () => {
      resData.postData = postData;
      res.end(JSON.stringify(resData));
    });
  }
})

// 监听端口
server.listen(3000, () => {
  console.log('服务器已开启，请访问地址：http://localhost:3000')
})