<template>
  <view class="container">
    <view class="header">
      <text class="title">分享菜单详情</text>
    </view>

    <view class="order-card">
      <text class="section-title">我们点的美食</text>
      <view class="divider" />
      <view class="order-list">
        <view class="order-item" v-for="item in cart" :key="item.id">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-count">x{{ item.count }}</text>
        </view>
      </view>
    </view>

    <view class="action-area">
      <view class="primary-btn" @click="goShare">
        <text class="primary-btn-text">生成分享菜单</text>
      </view>
      <view class="secondary-btn" @click="goBack">
        <text class="secondary-btn-text">返回继续点餐</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { onLoad, onShareAppMessage } from "@dcloudio/uni-app"
import type { CartLine } from "@/types/menu"

const cart = ref<CartLine[]>([])
const rawData = ref("")

onLoad((options) => {
  if (options && options.data) {
    try {
      rawData.value = String(options.data)
      cart.value = JSON.parse(decodeURIComponent(String(options.data)))
    } catch (e) {
      console.error("Failed to parse order data", e)
    }
  }
})

const goBack = () => {
  uni.navigateBack({
    delta: 1,
    fail: () => {
      uni.reLaunch({ url: "/pages/index/index" })
    }
  })
}

const goShare = () => {
  if (!rawData.value) return
  uni.navigateTo({ url: `/pages/share/share?data=${rawData.value}` })
}

onShareAppMessage(() => {
  return {
    title: "我想吃这些",
    path: `/pages/share/share?data=${rawData.value}`,
    imageUrl: cart.value.length > 0 ? cart.value[0].image : "",
  }
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding: 28rpx;
  box-sizing: border-box;
}

.header {
  height: 200rpx;
  padding: 32rpx 0 0;
  box-sizing: border-box;
}

.title {
  font-size: 36rpx;
  font-weight: 700;
  color: #111827;
}

.order-card {
  background-color: #ffffff;
  border-radius: 32rpx;
  padding: 40rpx 28rpx;
}

.section-title {
  font-size: 24rpx;
  font-weight: 700;
  color: #111827;
  display: block;
  margin-bottom: 28rpx;
}

.divider {
  height: 2rpx;
  background: #edf0f5;
  margin-bottom: 28rpx;
}

.order-list {
  display: flex;
  flex-direction: column;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #edf0f5;
}

.order-item:last-child {
  border-bottom: none;
}

.item-name {
  font-size: 24rpx;
  font-weight: 500;
  color: #111827;
}

.item-count {
  font-size: 24rpx;
  font-weight: 500;
  color: #111827;
}

.action-area {
  margin-top: 64rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.primary-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  background: #f4a261;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-btn:active {
  background: #e8954f;
}

.primary-btn-text {
  font-size: 26rpx;
  font-weight: 700;
  color: #fff;
}

.secondary-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  background: #fff;
  border: 2rpx solid #dee0e5;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.secondary-btn:active {
  background: #f7f8fa;
}

.secondary-btn-text {
  font-size: 26rpx;
  font-weight: 700;
  color: #111827;
}
</style>
