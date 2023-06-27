import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useCartStore = defineStore('cart', () => {
  const cartList = ref([])
  // 添加购物车
  const addCart = (goods) => {
    const item = cartList.value.find((item) => goods.skuId === item.skuId)
    if (item) {
      item.count++
    } else {
      cartList.value.push(goods)
    }
  }
  // 删除购物车
  const delCart = (skuId) => {
    const idx = cartList.value.findIndex((item) => skuId === item.skuId)
    cartList.value.splice(idx, 1)
  }
  // 单选功能
  const singleCheck = (skuId, selected) => {
    const item = cartList.value.find((item) => item.skuId === skuId)
    item.selected = selected
  }
  // 全选
  const allCheck = (selected) => {
    cartList.value.forEach(item => item.selected = selected)
  }
  // 是否全选
  const isAll = computed(() => cartList.value.every((item) => item.selected))
  // 总价
  const allCount = computed(() => cartList.value.reduce((a, b) => a + b.count, 0))
  const allPrice = computed(() => cartList.value.reduce((a, b) => a + b.count * b.price, 0))
  return {
    cartList,
    addCart,
    delCart,
    allCheck,
    isAll,
    allCount,
    allPrice,
    singleCheck
  }
},
  {
    persist: true,
  })