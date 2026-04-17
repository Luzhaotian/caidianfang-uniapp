<template>
  <view class="page">
    <view class="bg-tint" />

    <view class="ticket">
      <view class="cutout left" />
      <view class="cutout right" />

      <view class="head">
        <text class="h1">我想吃这些</text>
        <text class="sub">菜点坊 · 分享菜单</text>
        <view class="tag">
          <text class="tag-text">今晚想吃</text>
        </view>
      </view>

      <view class="divider" />

      <view class="rows">
        <view v-for="line in cart" :key="line.id" class="row">
          <text class="row-name" @click="goDetail(line.id)">{{ line.name }}</text>
          <text class="row-qty">x{{ line.count }}</text>
        </view>
      </view>

      <view class="footer">
        <text class="footer-note">发给你啦，照着点就行</text>
        <view class="signature">
          <text class="signature-text">来自：我</text>
        </view>
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
  const opts = options as { data?: string } | undefined
  const data = opts?.data
  if (!data) return
  try {
    rawData.value = String(data)
    cart.value = JSON.parse(decodeURIComponent(String(data)))
  } catch {
    cart.value = []
  }
})

onShareAppMessage(() => ({
  title: "我想吃这些",
  path: `/pages/share/share?data=${rawData.value}`,
  imageUrl: cart.value[0]?.image || "",
}))

function goDetail(id: number) {
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding: 28rpx;
  box-sizing: border-box;
  position: relative;
}

.bg-tint {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 300rpx;
  background: #fef6f0;
}

.ticket {
  position: relative;
  background: #fff;
  border-radius: 16rpx;
  border: 1rpx solid #e5e8ed;
  padding: 28rpx;
  margin-top: 100rpx;
}

.cutout {
  position: absolute;
  top: 220rpx;
  width: 32rpx;
  height: 32rpx;
  border-radius: 999rpx;
  background: #f7f8fa;
  border: 1rpx solid #e5e8ed;
}

.cutout.left {
  left: -16rpx;
}

.cutout.right {
  right: -16rpx;
}

.h1 {
  font-size: 36rpx;
  font-weight: 800;
  color: #111827;
  display: block;
}

.sub {
  margin-top: 6rpx;
  font-size: 20rpx;
  color: #6b7280;
  display: block;
}

.tag {
  margin-top: 12rpx;
  align-self: flex-start;
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: #fef6f0;
  display: inline-flex;
}

.tag-text {
  font-size: 20rpx;
  font-weight: 700;
  color: #f4a261;
}

.divider {
  margin-top: 20rpx;
  height: 1rpx;
  background: #edf0f5;
}

.rows {
  margin-top: 14rpx;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 14rpx 0;
  border-bottom: 1rpx solid #edf0f5;
}

.row:last-child {
  border-bottom: none;
}

.row-name {
  font-size: 24rpx;
  font-weight: 700;
  color: #111827;
}

.row-name:active {
  color: #f4a261;
}

.row-qty {
  font-size: 24rpx;
  font-weight: 900;
  color: #f4a261;
}

.footer {
  margin-top: 22rpx;
}

.footer-note {
  font-size: 20rpx;
  color: #6b7280;
}

.signature {
  margin-top: 14rpx;
  background: #fef6f0;
  border-radius: 12rpx;
  padding: 14rpx;
}

.signature-text {
  font-size: 20rpx;
  font-weight: 700;
  color: #f4a261;
}
</style>
