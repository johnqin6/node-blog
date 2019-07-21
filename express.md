# express

## 登录
使用 express-session和  

### express-session的使用
1. 在app.js引入使用
```javascript
const session = require('express-session')

// 配置
app.use(session({
  secret: 'Wjul#333',
  cookie: {
    // path: '/',  // 默认配置
    // httpOnly: true, // 默认配置
    maxAge: 24 * 60 * 60 * 1000  // 设置失效时间
  }
}))
```

2. 将session存储到redis中
```javascript
const RedisStore = require('connect-redis')(session)

const redisClient = require('./db/redis')
const sessionStrore = new RedisStore({
  client: redisClient
})
app.use(session({
  secret: 'Wjul#333',
  resave: false,
  saveUninitialized: true,
  cookie: {
    // path: '/',  // 默认配置
    // httpOnly: true, // 默认配置
    maxAge: 24 * 60 * 60 * 1000  // 设置失效时间
  },
  store: sessionStrore
}))

// db/redis.js

const redis = require('redis')
const { REDIS_CONF } = require('../config/db')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

redisClient.on('error', err => {
  console.error(err)
})

module.exports = redisClient
```