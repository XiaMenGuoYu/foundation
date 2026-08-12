import request from '@/utils/request'

// 演示接口
export function demo(data) {
  return request({
    url: '/api/demo',
    method: 'post',
    data
  })
}
