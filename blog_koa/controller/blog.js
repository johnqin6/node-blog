const { exec } = require('../db/mysql')
console.log(exec)
/**
 * 获取博客列表
 * @param {String} author 作者
 * @param {String} keyword 关键词
 */
const getList = async (author, keyword) => {
  // 1=1 是为占位，防止 author和keyword都没有值而报错, 即 where 后边无值
  let sql = 'select * from blogs where 1=1 '
  if (author) {
    sql += `and author='${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createOn desc;`

  // 返回 promise
  return await exec(sql)
}

/**
 * 获得博客详情
 * @param {*} id 
 */
const getDetail = async (id) => {
  const sql = `select * from blogs where id='${id}'`
  const rows = await exec(sql)
  return rows[0]
}

/**
 * 新建一篇博客
 * @param {Object} blogData 新建的博客数据
 */
const newBlog = async (blogData = {}) => {
  // blogData 是一个博客对象，包含title content 属性
  const title = blogData.title
  const content = blogData.content
  const author = blogData.author
  const createOn = Date.now()

  const sql = `
    insert into blogs (title, content, createOn, author)
    values ('${title}', '${content}', ${createOn},'${author}' )
  `
  const insertData = await exec(sql)
  return { id: insertData.insertId }
}

/**
 * 更新一篇博客
 * @param {} id
 * @param {Object} blogData 新建的博客数据
 */
const updateBlog = async (id, blogData = {}) => {
  // blogData 是一个博客对象，包含title content 属性
  const title = blogData.title
  const content = blogData.content

  const sql = `
    update blogs set title='${title}', content='${content}' where id='${id}'
  `
  const updateData = await exec(sql)
  if (updateData.affectedRows > 0) {
    return true
  }
  return false
}

/**
 * 删除一篇博客
 * @param {*} id 
 */
const delBlog = async (id, author) => {
  const sql = `delete from blogs where id='${id}' and author='${author}'`
  const delData = await exec(sql)
  if (delData.affectedRows > 0) {
    return true
  }
  return false
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}