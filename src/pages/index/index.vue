<template>
  <view class="page">
    <view class="header">
      <view class="header-content">
        <text class="title">我的菜谱</text>
        <text class="subtitle">轻松做饭·分享灵感</text>
      </view>
    </view>

    <view class="content">
      <view class="sidebar">
        <view
v-for="(cat, index) in sidebarEntries" :key="cat.id" class="sidebar-item"
          :class="{ active: activeCategoryIndex === index }" @click="onCategoryChange(index)">
          <text class="sidebar-item-text">{{ cat.name }}</text>
        </view>
      </view>

      <scroll-view class="list" scroll-y>
        <view v-if="filteredMenu.length === 0" class="list-empty">
          <text class="list-empty-text">暂无收藏，点击菜品卡片上的小心心添加</text>
        </view>
        <template v-else>
          <view v-for="item in filteredMenu" :key="item.id" class="food-card" @click="goDetail(item.id)">
            <image class="thumb" :src="item.image" mode="aspectFill" />
            <view class="info">
              <text class="name">{{ item.name }}</text>
              <text class="desc">{{ item.desc }}</text>
            </view>
            <view class="card-actions" @click.stop>
              <view class="fav-btn" @click.stop="store.toggleFavorite(item.id)">
                <text class="fav-icon" :class="{ 'fav-icon--on': store.isFavorite(item.id) }">{{
                  store.isFavorite(item.id) ? "♥" : "♡"
                }}</text>
              </view>
              <view class="add-btn" @click.stop="onStepperChange(item, store.getCount(item.id) + 1)">
                <text class="add-btn-text">+</text>
              </view>
            </view>
          </view>
        </template>
      </scroll-view>
    </view>

    <view class="bottom">
      <text class="bottom-text" @click="openCartDrawer">已选 {{ store.totalCount }} 道菜</text>
      <view class="cart-btn" @click="openCartDrawer">
        <text class="cart-btn-text">分享今日菜单</text>
      </view>
    </view>

    <!-- Cart Drawer -->
    <view v-if="showDrawer" class="drawer-mask" @click="closeCartDrawer"></view>
    <view class="drawer" :class="{ 'drawer-open': showDrawer }">
      <!-- Drag indicator -->
      <view class="drawer-drag-indicator"></view>

      <view class="drawer-header">
        <text class="drawer-title">今日菜单</text>
        <view class="drawer-actions">
          <text v-if="store.state.cart.length > 0" class="drawer-clear-btn" @click="clearCart">清空</text>
          <view class="drawer-close" @click="closeCartDrawer">
            <text class="drawer-close-text">✕</text>
          </view>
        </view>
      </view>

      <view class="drawer-divider"></view>

      <scroll-view class="drawer-content" scroll-y>
        <view v-if="store.state.cart.length === 0" class="drawer-empty">
          <text class="drawer-empty-text">今日菜单是空的</text>
        </view>

        <view v-else>
          <view v-for="line in store.state.cart" :key="line.id" class="drawer-line">
            <image class="drawer-thumb" :src="line.image" mode="aspectFill" />
            <view class="drawer-info">
              <text class="drawer-name">{{ line.name }}</text>
            </view>
            <view class="drawer-stepper">
              <view
class="drawer-stepper-btn drawer-stepper-minus"
                :class="{ 'drawer-stepper-disabled': line.count <= 0 }" @click="onStepperChange(line, line.count - 1)">
                <text class="drawer-stepper-btn-text">−</text>
              </view>
              <text class="drawer-stepper-value">{{ line.count }}</text>
              <view class="drawer-stepper-btn drawer-stepper-plus" @click="onStepperChange(line, line.count + 1)">
                <text class="drawer-stepper-btn-text">+</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>

      <view class="drawer-bottom">
        <text class="drawer-total">已选 {{ store.totalCount }} 道菜</text>
        <view
class="drawer-submit-btn" :class="{ 'drawer-submit-disabled': store.totalCount.value === 0 }"
          @click="goOrder">
          <text class="drawer-submit-btn-text">去分享</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

import { FAVORITES_CATEGORY_ID, useQuickBiteStore } from "@/store/cart"
import type { MenuItem } from "@/types/menu"

const store = useQuickBiteStore()

const activeCategoryIndex = ref(0)
const showDrawer = ref(false)

const sidebarEntries = computed(() => [
  ...store.state.categories,
  { id: FAVORITES_CATEGORY_ID, name: "收藏" },
])

const activeCategoryId = computed(
  () => sidebarEntries.value[activeCategoryIndex.value]?.id ?? store.state.categories[0]?.id ?? 1,
)

const filteredMenu = computed(() => {
  const id = activeCategoryId.value
  if (id === FAVORITES_CATEGORY_ID) {
    const fav = new Set(store.state.favoriteIds)
    return store.state.menu.filter((x) => fav.has(x.id))
  }
  return store.state.menu.filter((x) => x.categoryId === id)
})

function onCategoryChange(index: number) {
  activeCategoryIndex.value = index
}

function onStepperChange(item: MenuItem, count: number) {
  store.setCount(item, count)
}

function openCartDrawer() {
  showDrawer.value = true
}

function closeCartDrawer() {
  showDrawer.value = false
}

function clearCart() {
  store.clearCart()
}

function goOrder() {
  if (store.totalCount.value === 0) return
  closeCartDrawer()
  const data = encodeURIComponent(JSON.stringify(store.state.cart))
  uni.navigateTo({ url: `/pages/order/order?data=${data}` })
}

function goDetail(id: number) {
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
}
</script>

<style scoped>
.page {
  height: 100vh;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
}

.header {
  height: 200rpx;
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, var(--color-header-from) 0%, var(--color-header-via) 40%, var(--color-header-to) 100%);
}

.header::before {
  content: '';
  position: absolute;
  top: -40%;
  right: -15%;
  width: 350rpx;
  height: 350rpx;
  background: radial-gradient(circle, var(--color-header-decor-primary) 0%, transparent 65%);
  border-radius: 50%;
}

.header::after {
  content: '';
  position: absolute;
  bottom: -25%;
  left: -5%;
  width: 280rpx;
  height: 280rpx;
  background: radial-gradient(circle, var(--color-header-decor-accent) 0%, transparent 60%);
  border-radius: 50%;
}

.header-content {
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 32rpx 28rpx 0;
  box-sizing: border-box;
}

.title {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--color-header-title);
  position: relative;
  z-index: 1;
  display: block;
}

.subtitle {
  font-size: 20rpx;
  color: var(--color-header-subtitle);
  position: relative;
  z-index: 1;
  margin-top: 6rpx;
  display: block;
}

.content {
  flex: 1;
  display: flex;
  min-height: 0;
}

.sidebar {
  width: 160rpx;
  background: var(--color-surface);
  border-right: 2rpx solid var(--color-border-light);
}

.sidebar-item {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.sidebar-item.active {
  background-color: var(--color-primary-bg);
}

.sidebar-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5rpx;
  height: 32rpx;
  background-color: var(--color-primary);
  border-radius: 0 3rpx 3rpx 0;
}

.sidebar-item-text {
  font-size: 24rpx;
  color: var(--color-text-tertiary);
  font-weight: 500;
}

.sidebar-item.active .sidebar-item-text {
  color: var(--color-text);
  font-weight: 700;
}

.list {
  flex: 1;
  padding: 24rpx;
  box-sizing: border-box;
  min-height: 0;
}

.list-empty {
  padding: 80rpx 32rpx;
  display: flex;
  justify-content: center;
}

.list-empty-text {
  font-size: 24rpx;
  color: var(--color-text-disabled);
  text-align: center;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  flex-shrink: 0;
  width: 60rpx;
}

.fav-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fav-btn:active {
  opacity: 0.7;
}

.fav-icon {
  font-size: 30rpx;
  color: var(--color-favorite-muted);
  line-height: 1;
}

.fav-icon--on {
  color: var(--color-favorite);
}

.food-card {
  background: var(--color-surface);
  border-radius: 24rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.thumb {
  width: 120rpx;
  height: 120rpx;
  border-radius: 20rpx;
  background: var(--color-fill);
  display: block;
  flex-shrink: 0;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.name {
  font-size: 24rpx;
  font-weight: 700;
  color: var(--color-text);
}

.desc {
  font-size: 20rpx;
  color: var(--color-text-tertiary);
  margin-top: 6rpx;
}

.add-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.add-btn:active {
  background: var(--color-primary-pressed);
}

.add-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--color-text-inverse);
  line-height: 1;
}

.bottom {
  height: 140rpx;
  padding: 0 28rpx;
  background: var(--color-surface);
  border-top: 2rpx solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.bottom-text {
  color: var(--color-text);
  font-size: 20rpx;
  font-weight: 500;
}

.bottom-text:active {
  opacity: 0.7;
}

.cart-btn {
  width: 180rpx;
  height: 72rpx;
  border-radius: 36rpx;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-btn:active {
  background: var(--color-primary-pressed);
}

.cart-btn-text {
  font-size: 24rpx;
  font-weight: 700;
  color: var(--color-text-inverse);
}

/* Drawer Styles */
.drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-mask);
  z-index: 1000;
}

.drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: calc(100vh - 100rpx);
  /* Leave some space at top */
  background: var(--color-surface);
  border-radius: 20rpx 20rpx 0 0;
  z-index: 1001;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.drawer.drawer-open {
  transform: translateY(0);
}

.drawer-drag-indicator {
  width: 40rpx;
  height: 3rpx;
  background: var(--color-border);
  border-radius: 2rpx;
  align-self: center;
  margin-top: 6rpx;
}

.drawer-header {
  padding: 16rpx 28rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-actions {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.drawer-clear-btn {
  font-size: 24rpx;
  color: var(--color-text-tertiary);
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
}

.drawer-clear-btn:active {
  background: var(--color-fill);
  color: var(--color-text);
}

.drawer-title {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--color-text);
}

.drawer-close {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-close-text {
  font-size: 40rpx;
  color: var(--color-text-tertiary);
  line-height: 1;
}

.drawer-divider {
  height: 2rpx;
  background: var(--color-border-light);
  margin: 0 32rpx;
}

.drawer-content {
  flex: 1;
  padding: 12rpx 28rpx;
  min-height: 0;
  overflow-y: auto;
  box-sizing: border-box;
}

.drawer-empty {
  padding: 80rpx 0;
  display: flex;
  justify-content: center;
}

.drawer-empty-text {
  color: var(--color-text-tertiary);
  font-size: 28rpx;
}

.drawer-line {
  background: var(--color-surface);
  border: 2rpx solid var(--color-border-light);
  border-radius: 20rpx;
  padding: 16rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.drawer-thumb {
  width: 140rpx;
  height: 140rpx;
  border-radius: 14rpx;
  background: var(--color-fill);
  flex-shrink: 0;
}

.drawer-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.drawer-name {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--color-text);
}

.drawer-stepper {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex-shrink: 0;
}

.drawer-stepper-btn {
  width: 56rpx;
  height: 56rpx;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-stepper-minus {
  background: var(--color-fill);
}

.drawer-stepper-minus.drawer-stepper-disabled {
  opacity: 0.5;
}

.drawer-stepper-plus {
  background: var(--color-primary);
}

.drawer-stepper-plus:active {
  background: var(--color-primary-pressed);
}

.drawer-stepper-btn-text {
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1;
}

.drawer-stepper-minus .drawer-stepper-btn-text {
  color: var(--color-text);
}

.drawer-stepper-plus .drawer-stepper-btn-text {
  color: var(--color-text-inverse);
}

.drawer-stepper-value {
  min-width: 28rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: var(--color-text);
  text-align: center;
}

.drawer-bottom {
  padding: 16rpx 28rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-total {
  font-size: 24rpx;
  color: var(--color-text-tertiary);
}

.drawer-submit-btn {
  width: 200rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-submit-disabled {
  background: var(--color-text-disabled);
}

.drawer-submit-btn:active:not(.drawer-submit-disabled) {
  background: var(--color-primary-pressed);
}

.drawer-submit-btn-text {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--color-text-inverse);
}
</style>
