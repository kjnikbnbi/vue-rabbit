import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { useUserStore } from "./user"
import { insertCartAPI, delCartAPI, findNewCartListAPI } from "@/apis/cart"

export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  const isLogin = computed(() => userStore.userInfo.token)
  const cartList = ref([])
  // 获取最新购物车列表
  const updataNewList = async () => {
    const res = await findNewCartListAPI()
    cartList.value = res.result
  }
  // 添加购物车
  const addCart = async (goods) => {
    const { skuId, count } = goods
    if (isLogin.value) {
      // 登陆之后加入购物车
      await insertCartAPI({ skuId, count })
      updataNewList()
    } else {
      const item = cartList.value.find((item) => goods.skuId === item.skuId)
      if (item) {
        item.count++
      } else {
        cartList.value.push(goods)
      }
    }
  }
  // 删除购物车
  const delCart = async (skuId) => {
    if (isLogin.value) {
      await delCartAPI([skuId])
      updataNewList()
    } else {
      const idx = cartList.value.findIndex((item) => skuId === item.skuId)
      cartList.value.splice(idx, 1)
    }
  }
  // 清除购物车
  const clearCart = () => {
    cartList.value = []
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
  const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((a, b) => a + b.count, 0))
  const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((a, b) => a + b.count * b.price, 0))
  // 是否全选
  const isAll = computed(() => cartList.value.every((item) => item.selected))
  // 总价
  const allCount = computed(() => cartList.value.reduce((a, b) => a + b.count, 0))
  const allPrice = computed(() => cartList.value.reduce((a, b) => a + b.count * b.price, 0))
  return {
    cartList,
    addCart,
    clearCart,
    delCart,
    allCheck,
    isAll,
    allCount,
    allPrice,
    selectedCount,
    selectedPrice,
    singleCheck,
    updataNewList
  }
},
  {
    persist: true,
  })