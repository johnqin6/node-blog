// 密码加密文件
const crypto = require('crypto')  // nodejs内置的加密方法

// 密钥 自定义
const SECRET_KEY = 'Wjiol_8993#'

// md5加密
function md5(content) {
  let md5 = crypto.createHash('md5')
  return md5.update(content).digest('hex')
}

// 加密函数
function genPassword(password) {
  const str = `password=${password}&key=${SECRET_KEY}`
  return md5(str)
}

// // 测试
// const result = genPassword('123')
// console.log(result)

module.exports = {
  genPassword
}