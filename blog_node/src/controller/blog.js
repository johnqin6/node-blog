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

module.exports = {
  getList
}