<template>
  <view class="page">
    <view class="bg-tint" />

    <view class="ticket">
      <view class="cutout left" />
      <view class="cutout right" />

      <view class="head">
        <text class="h1">今日菜单</text>
        <text class="sub">照着做就行</text>
        <view class="tag">
          <text class="tag-text">今晚做这些</text>
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
        <text class="footer-note">发给你啦，照着做就行，点击菜单名有详细做法</text>
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
  title: "今晚吃什么",
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
  background: var(--color-bg);
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
  background: var(--color-primary-bg);
}

.ticket {
  position: relative;
  background: var(--color-surface);
  border-radius: 16rpx;
  border: 1rpx solid var(--color-border);
  padding: 28rpx;
  margin-top: 100rpx;
}

.cutout {
  position: absolute;
  top: 220rpx;
  width: 32rpx;
  height: 32rpx;
  border-radius: 999rpx;
  background: var(--color-bg);
  border: 1rpx solid var(--color-border);
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
  color: var(--color-text);
  display: block;
}

.sub {
  margin-top: 6rpx;
  font-size: 20rpx;
  color: var(--color-text-tertiary);
  display: block;
}

.tag {
  margin-top: 12rpx;
  align-self: flex-start;
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: var(--color-primary-bg);
  display: inline-flex;
}

.tag-text {
  font-size: 20rpx;
  font-weight: 700;
  color: var(--color-primary);
}

.divider {
  margin-top: 20rpx;
  height: 1rpx;
  background: var(--color-border-light);
}

.rows {
  margin-top: 14rpx;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 14rpx 0;
  border-bottom: 1rpx solid var(--color-border-light);
}

.row:last-child {
  border-bottom: none;
}

.row-name {
  font-size: 24rpx;
  font-weight: 700;
  color: var(--color-text);
}

.row-name:active {
  color: var(--color-primary);
}

.row-qty {
  font-size: 24rpx;
  font-weight: 900;
  color: var(--color-primary);
}

.footer {
  margin-top: 22rpx;
}

.footer-note {
  font-size: 20rpx;
  color: var(--color-text-tertiary);
}

.signature {
  margin-top: 14rpx;
  background: var(--color-primary-bg);
  border-radius: 12rpx;
  padding: 14rpx;
}

.signature-text {
  font-size: 20rpx;
  font-weight: 700;
  color: var(--color-primary);
}
</style>
