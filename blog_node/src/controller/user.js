/**
 * 注册用户
 * @param {Object} userData 新建的用户数据
 */
const register = (userData = {}) => {
  // blogData 是一个博客对象，包含title content 属性
  return true
}

/**
 * 登录
 * @param {*} username 
 * @param {*} password 
 */
const login = (username, password) => {
  console.log(username, password)
  if (username === 'zhangsan' && password === '123') {
    return true
  } else {
    return false
  }
}

/**
 * 删除用户
 * @param {*} id 
 */
const deleteUser = id => {
  return true
}

module.exports = {
  register,
  login,
  deleteUser
}