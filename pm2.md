# 线上环境

- 服务器稳定性
- 充分利用服务器硬件资源，以便提高性能
- 线上日志记录

## pm2 
- 进程守护，系统崩溃自动重启
- 启动多进程，充分利用cpu和内存
- 自带日志记录功能

### pm2介绍  
#### 下载安装
> npm install pm2 -g   // 全局安装      
> pm2 --version    // 查看版本，是否安装成功

#### 基本使用, 和nodemon的区别
  + 使用和nodemon相似
  + nodeman使用会占用窗口，无法进行其他操作
  + pm2使用会把命令窗口交还我们，不妨碍其他操作

#### 常用命令
  + pm2 list             显示所有进程状态
  + pm2 monit            监控所有进程
  + pm2 restart all      重启所有进程
  + pm2 restart name/id  重启指定进程
  + pm2 stop all         停止所有进程
  + pm2 stop name/id     停止指定进程
  + pm2 delete all       删除所有进程
  + pm2 delete name/id   删除指定进程
  + pm2 reload all       0秒停机重载所有进程
  + pm2 reload name/id   0秒停机重载指定进程
  + pm2 info              查看服务详情
  + pm2 logs             显示所有进程日志
  + pm2 log name/id      显示单个进程日志(name 为进程日志)
  

#### 进程守护
  + node app.js和nodemon app.js,  进程崩溃则不能访问
  + pm2 遇到进程崩溃，会自动重启

#### 配置  
  + 新建pm2 配置文件 （包括进程数量，日志文件目录等）
  + 修改pm2启动命令，重启
  + 访问server, 检查日志文件的内容（日志记录是否生效）

#### 多进程 
- 为何使用多进程
  + 单个进程的内存是受限的（操作系统限制一个进程的内存）
  + 内存：无法充分利用机器全部内存
  + CPU: 无法充分利用多核CPU的优势（四个进程善于处理四个进程）
  + 多个进程之间通过共享redis来使用session的数据（多进程无法共享）
- 多进程和redis


