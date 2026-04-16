<template>
  <view class="page">
    <view class="header">
      <text class="title">已点美食</text>
    </view>

    <scroll-view class="list" scroll-y>
      <view v-if="store.state.cart.length === 0" class="empty">
        <text class="empty-text">购物车是空的</text>
      </view>

      <view v-else>
        <view class="line" v-for="line in store.state.cart" :key="line.id">
          <image class="thumb" :src="line.image" mode="aspectFill" />
          <view class="info">
            <text class="name">{{ line.name }}</text>
          </view>
          <view class="stepper">
            <view 
              class="stepper-btn minus" 
              :class="{ disabled: line.count <= 0 }"
              @click="onStepperChange(line, line.count - 1)"
            >
              <text class="stepper-btn-text">-</text>
            </view>
            <text class="stepper-value">{{ line.count }}</text>
            <view class="stepper-btn plus" @click="onStepperChange(line, line.count + 1)">
              <text class="stepper-btn-text">+</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="bottom">
      <view 
        class="submit-btn" 
        :class="{ disabled: store.totalCount.value === 0 }"
        @click="goOrder"
      >
        <text class="submit-btn-text">生成分享菜单</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useQuickBiteStore } from "@/store/cart"
import type { CartLine } from "@/types/menu"

const store = useQuickBiteStore()

function onStepperChange(item: CartLine, count: number) {
  store.setCount(item, count)
}

function goOrder() {
  if (store.totalCount.value === 0) return
  const data = encodeURIComponent(JSON.stringify(store.state.cart))
  uni.navigateTo({ url: `/pages/order/order?data=${data}` })
}
</script>

<style scoped>
.page {
  height: 100vh;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.header {
  height: 200rpx;
  padding: 32rpx 28rpx 0;
  background: #fff;
  box-sizing: border-box;
}

.title {
  font-size: 36rpx;
  font-weight: 700;
  color: #111827;
}

.list {
  flex: 1;
  min-height: 0;
  padding: 24rpx;
  box-sizing: border-box;
}

.empty {
  padding: 160rpx 0;
  display: flex;
  justify-content: center;
}

.empty-text {
  color: #6b7280;
  font-size: 24rpx;
}

.line {
  background: #fff;
  border-radius: 24rpx;
  padding: 20rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.thumb {
  width: 140rpx;
  height: 140rpx;
  border-radius: 20rpx;
  background: #edf0f5;
  flex-shrink: 0;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.name {
  font-size: 26rpx;
  font-weight: 700;
  color: #111827;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-shrink: 0;
}

.stepper-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stepper-btn.minus {
  background: #edf0f5;
}

.stepper-btn.minus.disabled {
  opacity: 0.5;
}

.stepper-btn.plus {
  background: #f4a261;
}

.stepper-btn.plus:active {
  background: #e8954f;
}

.stepper-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1;
}

.stepper-btn.minus .stepper-btn-text {
  color: #111827;
}

.stepper-btn.plus .stepper-btn-text {
  color: #fff;
}

.stepper-value {
  min-width: 32rpx;
  font-size: 26rpx;
  font-weight: 500;
  color: #111827;
  text-align: center;
}

.bottom {
  padding: 24rpx;
  background: #fff;
  border-top: 2rpx solid #e5e8ed;
  box-sizing: border-box;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  background: #f4a261;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn.disabled {
  background: #ccc;
}

.submit-btn:active:not(.disabled) {
  background: #e8954f;
}

.submit-btn-text {
  font-size: 26rpx;
  font-weight: 700;
  color: #fff;
}
</style>
