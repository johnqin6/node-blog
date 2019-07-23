const redis = require('redis')
const { REDIS_CONF } = require('../config/db')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

redisClient.on('error', err => {
  console.error(err)
})

// 设置指定 key 的值
function set(key, val) {
  if (typeof val === 'object') {
    val = JSON.stringify(val)
  }
  redisClient.set(key, val, redis.print)
}

// 获取指定 key 的值
function get(key) {
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        reject(err)
        return
      }
      // 不存在该键
      if (val == null) {
        resolve(null)
      }

      try { // 如果是json对象, 返回json对象
        resolve(JSON.parse(val))
      } catch (ex) { // 不是，直接返回值
        resolve(val)
      }

    })
  })
  return promise
}

module.exports = {
  set,
  get
}