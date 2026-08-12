import request from '@/utils/request'

// 查询MySQL8常见字段类型示例列表
export function listDemo(query) {
  return request({
    url: '/business/demo/list',
    method: 'get',
    params: query
  })
}

// 查询MySQL8常见字段类型示例详细
export function getDemo(id) {
  return request({
    url: '/business/demo/' + id,
    method: 'get'
  })
}

// 新增MySQL8常见字段类型示例
export function addDemo(data) {
  return request({
    url: '/business/demo',
    method: 'post',
    data: data
  })
}

// 修改MySQL8常见字段类型示例
export function updateDemo(data) {
  return request({
    url: '/business/demo',
    method: 'put',
    data: data
  })
}

// 删除MySQL8常见字段类型示例
export function delDemo(id) {
  return request({
    url: '/business/demo/' + id,
    method: 'delete'
  })
}
