<template>
  <view class="page">
    <view class="header">
      <text class="title">菜品制作详情</text>
      <view v-if="item" class="header-fav" @tap.stop="onToggleFavorite">
        <text class="header-fav-icon" :class="{ 'header-fav-icon--on': store.isFavorite(item.id) }">{{
          store.isFavorite(item.id) ? "♥" : "♡"
        }}</text>
      </view>
    </view>

    <scroll-view class="content" scroll-y>
      <view class="hero-card">
        <image class="food-image" :src="item?.image" mode="aspectFill" />
        <view
          v-if="item?.videoUrl"
          class="video-row"
          hover-class="video-row--active"
          @tap="openVideoLink"
        >
          <view class="video-row-icon-wrap">
            <text class="video-row-icon">▶</text>
          </view>
          <text class="video-row-label">观看视频教程</text>
          <text class="video-row-chevron">›</text>
        </view>
      </view>

      <view class="food-info">
        <view class="food-main">
          <text class="food-name">{{ item?.name }}</text>
          <view class="food-tags">
            <view class="tag">
              <text class="tag-text">⏱ {{ item?.cookTime }}</text>
            </view>
            <view class="tag">
              <text class="tag-text">{{ item?.difficulty }}难度</text>
            </view>
          </view>
        </view>
        <text class="food-desc">{{ item?.desc }}</text>
      </view>

      <view class="card">
        <text class="card-title">备菜准备</text>
        <view class="divider" />
        
        <view class="section">
          <text class="section-label">原材料</text>
          <view class="ingredient-list">
            <view v-for="ing in item?.ingredients" :key="ing.name" class="ingredient-tag">
              <text class="ingredient-text">{{ ing.name }} {{ ing.amount }}</text>
            </view>
          </view>
        </view>

        <view v-if="item?.seasonings && item.seasonings.length > 0" class="section">
          <text class="section-label">调料</text>
          <view class="ingredient-list">
            <view v-for="s in item?.seasonings" :key="s.name" class="ingredient-tag">
              <text class="ingredient-text">{{ s.name }} {{ s.amount }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="card">
        <text class="card-title">制作步骤</text>
        <view class="divider" />
        <view class="steps">
          <view v-for="s in item?.steps" :key="s.step" class="step">
            <text class="step-text">{{ s.step }}. {{ s.content }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { onLoad } from "@dcloudio/uni-app"
import { useQuickBiteStore } from "@/store/cart"
import type { MenuItem } from "@/types/menu"

const store = useQuickBiteStore()

const itemId = ref<number>(0)
const item = ref<MenuItem | null>(null)

onLoad((options) => {
  const opts = options as { id?: string } | undefined
  const id = opts?.id
  if (id) {
    itemId.value = Number(id)
    item.value = store.state.menu.find(m => m.id === itemId.value) || null
  }
})

const onToggleFavorite = () => {
  if (item.value) store.toggleFavorite(item.value.id)
}

/** 小程序 web-view 仅允许已配置「业务域名」的站点；B 站等无法配置，只能站外打开 */
const copyUrlForExternalBrowser = (url: string, title?: string) => {
  uni.setClipboardData({
    data: url,
    success: () => {
      uni.showToast({
        title: title ?? "链接已复制，请在浏览器中粘贴打开",
        icon: "none",
        duration: 3200,
      })
    },
  })
}

const isMpWebViewBlockedHost = (raw: string): boolean => {
  try {
    const host = new URL(raw).hostname.toLowerCase()
    const blockedSuffixes = [
      "bilibili.com",
      "b23.tv",
      "youtube.com",
      "youtu.be",
      "douyin.com",
      "ixigua.com",
      "weibo.com",
    ]
    return blockedSuffixes.some(
      s => host === s || host.endsWith(`.${s}`),
    )
  } catch {
    return true
  }
}

const openVideoLink = () => {
  const url = item.value?.videoUrl
  if (!url) return

  // #ifdef H5
  window.open(url, "_blank")
  // #endif

  // #ifdef APP-PLUS
  plus.runtime.openURL(url)
  // #endif

  // #ifdef MP
  if (isMpWebViewBlockedHost(url)) {
    copyUrlForExternalBrowser(
      url,
      "该视频站无法在小程序内打开，已复制链接",
    )
    return
  }
  uni.navigateTo({
    url: `/pages/webview/webview?url=${encodeURIComponent(url)}`,
    fail: () => {
      copyUrlForExternalBrowser(url)
    },
  })
  // #endif
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f7fa;
  display: flex;
  flex-direction: column;
}

.header {
  min-height: 200rpx;
  padding: 32rpx 28rpx 0;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.title {
  font-size: 36rpx;
  font-weight: 700;
  color: #121726;
  flex: 1;
  min-width: 0;
}

.header-fav {
  padding: 4rpx 0 4rpx 12rpx;
  flex-shrink: 0;
}

.header-fav-icon {
  font-size: 40rpx;
  color: #d1d5db;
  line-height: 1;
}

.header-fav-icon--on {
  color: #e63946;
}

.content {
  flex: 1;
  padding: 28rpx;
  box-sizing: border-box;
}

.hero-card {
  border-radius: 24rpx;
  overflow: hidden;
  background: #edf0f5;
}

.food-image {
  width: 100%;
  height: 320rpx;
  display: block;
  background: #edf0f5;
}

.video-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 22rpx 24rpx;
  background: #fff;
  border-top: 2rpx solid #f0f2f6;
}

.video-row--active {
  background: #fafbfc;
}

.video-row-icon-wrap {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #fef6f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.video-row-icon {
  font-size: 22rpx;
  color: #c45c26;
  margin-left: 4rpx;
}

.video-row-label {
  flex: 1;
  font-size: 26rpx;
  font-weight: 600;
  color: #121726;
}

.video-row-chevron {
  font-size: 36rpx;
  color: #c5cad3;
  line-height: 1;
  font-weight: 300;
}

.food-info {
  margin-top: 28rpx;
}

.food-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.food-name {
  font-size: 28rpx;
  font-weight: 700;
  color: #121726;
}

.food-tags {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6rpx;
}

.tag {
  padding: 6rpx 12rpx;
  background: #fef6f0;
  border-radius: 6rpx;
}

.tag-text {
  font-size: 20rpx;
  color: #6b7380;
}

.food-desc {
  font-size: 20rpx;
  color: #6b7380;
  margin-top: 12rpx;
  display: block;
}

.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
  margin-top: 28rpx;
}

.card-title {
  font-size: 24rpx;
  font-weight: 700;
  color: #121726;
  display: block;
}

.divider {
  height: 2rpx;
  background: #edf0f5;
  margin: 20rpx 0;
}

.section {
  margin-bottom: 20rpx;
}

.section:last-child {
  margin-bottom: 0;
}

.section-label {
  font-size: 20rpx;
  color: #6b7380;
  display: block;
  margin-bottom: 12rpx;
}

.ingredient-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.ingredient-tag {
  padding: 12rpx 16rpx;
  background: #f7f7fa;
  border-radius: 6rpx;
}

.ingredient-text {
  font-size: 24rpx;
  color: #121726;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.step {
  display: flex;
  align-items: flex-start;
}

.step-text {
  font-size: 24rpx;
  color: #121726;
  line-height: 1.6;
}
</style>
