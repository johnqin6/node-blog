/**
 * 获取博客列表
 * @param {String} author 作者
 * @param {String} keyword 关键词
 */
const getList = (author, keyword) => {
  // 先返回假数据 （格式是正确的）
  return [
    {
      id: 1,
      title: '标题A',
      content: '内容A',
      createOn: 1563453817252,
      author: 'zhangsan'
    },
    {
      id: 2,
      title: '标题B',
      content: '内容B',
      createOn: 1563453882105,
      author: 'lisi'
    },
  ]
}

/**
 * 获得博客详情
 * @param {*} id 
 */
const getDetail = (id) => {
  // 先返回假数据 （格式是正确的）
  return [
    {
      id: 1,
      title: '标题A',
      content: '内容A',
      createOn: 1563453817252,
      author: 'zhangsan'
    }
  ]
}

/**
 * 新建一篇博客
 * @param {Object} blogData 新建的博客数据
 */
const newBlog = (blogData = {}) => {
  // blogData 是一个博客对象，包含title content 属性
  return {
    id: 3
  }
}

/**
 * 更新一篇博客
 * @param {} id
 * @param {Object} blogData 新建的博客数据
 */
const updateBlog = (id, blogData = {}) => {
  // blogData 是一个博客对象，包含title content 属性
  return true
}

/**
 * 删除一篇博客
 * @param {*} id 
 */
const delBlog = id => {
  return true
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}