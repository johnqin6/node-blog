const serveHandle = (req, res) => {
  // 设置返回的格式为 json
  res.setHeader('Content-type', 'application/json');

  const resData = {
    name: 'jsjjs',
    site: 'www',
    env: process.env.NODE_ENV
  }

  res.end(JSON.stringify(resData));
}

module.exports = serveHandle