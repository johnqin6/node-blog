var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs = require('fs')
var cookieParser = require('cookie-parser');
// 该插件处理日志
var logger = require('morgan');
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const ENV = process.env.NODE_ENV
if (ENV !== 'production') { // 开发环境
  app.use(logger('dev'))
} else { // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'   // 追加
  })
  app.use(logger('combined', { // 比较全的日志
    stream: writeStream  // 写入日志
  }));
}
// app.use(logger('dev' {
//   stream: process.stdout  // 输出 默认配置
// }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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

app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/blog', blogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
