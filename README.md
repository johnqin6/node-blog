# node综合练习 
使用node.js原生，express框架，koa框架配合简单的博客系统学习node.js后台概念和相关的后台技术。  

## server端开发需要关注的几点问题

- 服务稳定性
  + server 端可能会遭受各种恶意攻击和误操作，对服务端稳定性要求很高
  + 单个客户端可以意外挂掉，但是服务端不可以（服务端挂掉，影响巨大）
  + 使用PM2做进程守候（PM2会在进程挂掉后自动重启）

- 考虑内存和CPU（优化，扩展）
  + 客户端独占一个浏览器，内存和CPU问题不大
  + 服务端要承载很多资源，CPU和内存都是稀缺资源，每一点都要省着用。
  + 使用 stream写日志（stream写日志是非常节约内存的），使用redis存session

- 日志记录（日志对serve端非常重要，没有日志，服务端就成了瞎子，无法对程序进展，结果，是否出现问题进行把控）
  + 前端也会参与写日志，但只是日志的发起方，不关心后续
  + 服务端要记录日志，存储日志，分析日志，这些前端不需关心
  + 从日志中服务端可以获取很多信息，所以分析日志很重要

- 安全 
  + serve端要随时准备接受各种恶意攻击，如：越权操作，数据库攻击（sql注入攻击）等等
  + 登录验证，预防xss攻击，sql注入等技术学习

- 集群和服务拆分
  + 产品发展速度快，流量会迅速增加，此时要扩展机器和服务拆分来承载流量
  + 此案例虽是单机器开发，但是设计上支持服务拆分

## 博客项目介绍 

### 定目标

- 开发一个博客系统，具有博客的基本功能（）
- 只开发serve端，但是不关心前端（后期可能会优化）
- 此项目会用三种技术形式开发（node.js原生, express框架，koa框架）

### 需求

- 首页，作者主页，博客详情页
- 登录页，登录页
- 管理中心，新建页，编辑页

**需求设计注意点：需求一定要明确，需求指导开发**

### 技术方案

- 数据如何存储
  + 博客（数据表）
    * 博客数据表涉及的字段id, title(标题), content(内容), createOn(创建时间), author(作者)
  + 用户（数据表）
    * 用户数据表涉及的字段id, username(用户名称), password(密码), realname(真实姓名), email(邮箱), avatar(头像), 注册时间(createOn)
- 如何与前端对接，即接口设计

接口设计：  

| 描述 | 接口 | 方法 | url参数| 备注 |    
|------|------|-----|--------|------|     
|获取博客列表| /api/blog/list | get | author作者，keyword关键字 | 参数为空时，则不进行查询过滤|   
|获取一篇博客的内容| /api/blog/detail | id|    |     
|新增一篇博客| /api/blog/new | post |      | post中有新增的数据|   
|更新一篇博客| /api/blog/update | post| id   | post的报文体中有更新的数据|   
|删除一篇博客| /api/blog/delete | delete | id  |    |    
|注册 | /api/user/register  | post|     | post的报文体中有注册用户的数据|  
|登录 | /api/user/login | post|  | post的报文体中有登录用户的数据|   
|注销| /api/user/delete | get |   | 注销的用户|    
|更新用户信息| /api/user/update| post |  | 更新用户信息 |  


### 知识点  
- http请求概述(即面试时常问的在浏览器输入网址后，会经历哪些过程)
  + DNS解析（域名解析），建立TCP连接（即三次握手）,发送http请求 
  + serve 接收到http请求，处理，并返回响应  
  + 客户端接收到返回数据，处理数据（如渲染页面，执行js） 

**三次握手，通俗的说就是，客户端询问服务器你是否可以用，服务器回复可用，客户端即再次请求说我知道，我即将访问**  

- 路由和api
  + API:
    * 前端和后端，不同端（子系统）之间对接的一个术语
  + 路由：
    * API的一部分
    * 后端系统内部的一个定义  

- 登录
  + 核心：登录校验 & 登录信息存储
  + cookie(登录的基础) & session(解决方案)
  + session 写入 redis(一个内存数据库)
  + 开发登录功能，和前端联调（用到nginx反向代理）

### cookie 
- 存储在浏览器的一段字符串（最大5kb）
- 跨域不共享
- 格式如 k1=v1; k2=v2; k3=v3; 因此可以存储结构化数据
- 每次发送http请求，会将请求域的cookie一起发送给server
- server可以修改cookie并返回给浏览器
- 浏览器中亦可以通过javascript修改cookie（有限制）

cookie的使用

```javascript
// 设置cookie httpOnly限制前端更改cookie
res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()};`)

// 解析cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return
    }
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1]
    req.cookie[key] = val
  })

// 获取cookie的过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  return d.toGMTString()
}
```

### session
- 解决cookie存在的问题(cookie会暴漏username等私密信息, 很危险)
- cookie中存储userid, server端对应username
- session(一种解决方案), 即server端存储用户信息

#### 使用session是存在的问题
- sesssion直接用js变量,会放在nodde.js进程中,这会产生一些问题
  1. 进程内存有限，访问量过大，内存会暴增
  2. 正式线上运行是多进程，进程之间内存无法共享

- 解决方案 redis
  + redis: web server 最常用的缓存数据库，数据放在内存中
  + 相对于mysql，访问速度快（内存和硬盘不是一个数量级的）
  + 但是成本更高，可存储的数据量更小（内存的硬伤）
  + 将web server和redis拆分为两个单独的服务
  + 双方都是独立的，都是可扩展的（例如都扩展为集群）
  + 包含mysql 也是一个单独的服务，也可扩展

#### 为何session适合用redis
- session 访问频繁，对性能要求极高
- session 可不考虑断电丢失数据的问题（内存的硬伤）
- session 数据量不会太大 （相当于mysql中存储的数据）

#### 为何网站数据不适合用redis
- 操作频率不是太高（相当于session操作）
- 断电不能丢失，必须保留
- 数据量太大，内存成本太高

session的使用

```javascript
// session 数据
const SESSION_DATA = {}

// 解析session
  let needSetCookie = false
  // userId 用户的表示，方便session保存用户数据
  let userId = req.cookie.userId
  if (userId) { 
    if (!SESSION_DATA[userId]) { // 如果session保存数据中不存在该userId的数据,就将该userId设置为空对象
      SESSION_DATA[userId] = {}
    } 
  } else { // cookie中userId不存在就设置userId并将session数据添加以新增的userId的键
    needSetCookie = true
    userId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`
    SESSION_DATA[userId] = {}
  }
  req.session = SESSION_DATA[userId]
  
  // 设置cookie
  if (needSetCookie) { // 根据该变量判断是否设置cookie
    // 操作cookie httpOnly限制前端更改cookie
    res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()};`)
  }

  // 登录时根据数据库查询是否存在该用户来设置session
  if (data.username) {
    // 设置session
    req.session.username = data.username
    req.session.realname = data.realname
  }
```

## mysql操作的注意点
操作数据库时一般不会真正删除数据，而是使用软删除，将该记录state设置为0 
```sql
-- 软删除
update users set state='0' where username='lisi';  
-- 查询
SELECT * FROM users WHERE state='1';
```


