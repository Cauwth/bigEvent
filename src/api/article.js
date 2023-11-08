// 文章管理相关请求
import request from '@/utils/request'

// 请求文章分类
export const articleGetChannelService = () => request.get('/my/cate/list')
// 添加分类的接口
export const articleAddChannelService = (data) =>
  request.post('/my/cate/add', data)
// 编辑分类的接口
export const articleEditChannelService = (data) =>
  request.put('/my/cate/info', data)
// 删除分类 get和delete配参数的特殊性{ params：{}}
export const articleDelChannelService = (id) =>
  request.delete('/my/cate/del', {
    params: { id }
  })

//请求文章列表(token已在request方法中添加)
export const articleGetListService = (params) =>
  request.get('/my/article/list', {
    params
  })
// 添加文章
export const articleAddService = (data) => request.post('/my/article/add', data)
// 获取文章详情
export const articleGetDetailService = (id) =>
  request.get('/my/article/info', {
    params: { id }
  })
