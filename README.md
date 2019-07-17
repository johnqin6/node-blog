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
|删除一篇博客| /api/blog/del | detele | id  |    |    
|注册 | /api/user/register  | post|     | post的报文体中有注册用户的数据|  
|登录 | /api/user/login | post|  | post的报文体中有登录用户的数据|   
|注销| /api/user/logout | get |   | 注销的用户|    


### 知识点  
- http请求概述(即面试时常问的在浏览器输入网址后，会经历哪些过程)
  + DNS解析（域名解析），建立TCP连接（即三次握手）,发送http请求 
  + serve 接收到http请求，处理，并返回响应  
  + 客户端接收到返回数据，处理数据（如渲染页面，执行js） 

**三次握手，通俗的说就是，客户端询问服务器你是否可以用，服务器回复可用，客户端即再次请求说我知道，我即将访问**  
