import request from '@/utils/http'

// 获取订单接口
export const getCheckInfoAPI = () => {
  return request ({
    url: '/member/order/pre'
  })
}