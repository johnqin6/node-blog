const http = require('http')

// 组合中间件
function compose(middlewareList) {
  return function (ctx) {
    // 中间件调用的逻辑
    function dispatch(i) {
      const fn = middlewareList[i]
      try {
        // 防止中间件不是promise函数
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)))
      } catch(err) {
        return Promise.reject(err)
      }
    }
    return dispatch(0)
  }
}

class LikeKoa2 {
  constructor() {
    this.middlewareList = []
  }

  use(fn) {
    this.middlewareList.push(fn)
    return this  // return this 用于链式调用
  }

  createContext(req, res) {
    const ctx = {
      req,
      res
    }
    // ctx.query = req.query
    return ctx
  }

  handleRequest(ctx, fn) {
    return fn(ctx)
  }

  callback() {
    const fn = compose(this.middlewareList)
    return (req, res) => {
      const ctx = this.createContext(req, res)
      return this.handleRequest(ctx, fn)
    }
  }

  listen(...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }
}

module.exports = LikeKoa2