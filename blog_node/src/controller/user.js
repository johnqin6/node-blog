const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/crypto')
/**
 * 注册用户
 * @param {Object} userData 新建的用户数据
 */
const register = (userData = {}) => {
  const username = userData.username
  // 密码加密
  const password = genPassword(userData.password)
  const realname = userData.realname

  const sql = `select username from users where username='${username}'`

  return exec(sql).then(rows => {
    if (rows.length > 0) {
      return {
        message: '该用户已存在！'
      }
    }
    const regSql = `
      insert into users (username, password, realname) values ('${username}', '${password}', '${realname}')
    `
    return exec(regSql).then(res => {
      return { id: res.insertId }
    })
  })
}

/**
 * 登录
 * @param {*} username 
 * @param {*} password 
 */
const login = (username, password) => {
  // 密码加密
  password = genPassword(password)  
  username = escape(username)
  password = escape(password)
  const sql = `
    select username, realname from users where
    username=${username} and password=${password}
  `
  return exec(sql).then(res => {
    return res[0]
  })
}

/**
 * 删除用户
 * @param {*} id 
 */
const deleteUser = (id, username) => {
  // 软删除，只改变用户状态，不真正删除用户，方便恢复数据
  const sql = `
    update users set state=0 where id='${id}' and username='${username}'
  `
  return exec(sql).then(res => {
    if (res.affectedRows > 0) {
      return true
    }
    return false
  })
}

module.exports = {
  register,
  login,
  deleteUser
}