const http = require('http')

const PORT = 3000
const serverHandle = require('../app')

const server = http.createServer(serverHandle)

server.listen(PORT, () => {
  console.log('服务器在http://localhost:' + PORT + '开启');
})