<template>
  <view class="page">
    <view class="header">
      <text class="title">菜品制作详情</text>
    </view>

    <scroll-view class="content" scroll-y>
      <image class="food-image" :src="item?.image" mode="aspectFill" />
      
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
            <view class="ingredient-tag" v-for="ing in item?.ingredients" :key="ing.name">
              <text class="ingredient-text">{{ ing.name }} {{ ing.amount }}</text>
            </view>
          </view>
        </view>

        <view class="section" v-if="item?.seasonings && item.seasonings.length > 0">
          <text class="section-label">调料</text>
          <view class="ingredient-list">
            <view class="ingredient-tag" v-for="s in item?.seasonings" :key="s.name">
              <text class="ingredient-text">{{ s.name }} {{ s.amount }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="card">
        <text class="card-title">制作步骤</text>
        <view class="divider" />
        <view class="steps">
          <view class="step" v-for="s in item?.steps" :key="s.step">
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
  const id = (options as any)?.id
  if (id) {
    itemId.value = Number(id)
    item.value = store.state.menu.find(m => m.id === itemId.value) || null
  }
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f7fa;
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
  color: #121726;
}

.content {
  flex: 1;
  padding: 28rpx;
  box-sizing: border-box;
}

.food-image {
  width: 100%;
  height: 320rpx;
  border-radius: 24rpx;
  background: #edf0f5;
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
