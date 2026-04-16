<template>
  <view class="page">
    <view class="header">
      <view class="header-content">
        <text class="title">菜点坊 菜单</text>
        <text class="subtitle">简约·快点·可分享</text>
      </view>
    </view>

    <view class="content">
      <view class="sidebar">
        <view v-for="(cat, index) in store.state.categories" :key="cat.id" class="sidebar-item"
          :class="{ active: activeCategoryIndex === index }" @click="onCategoryChange(index)">
          <text class="sidebar-item-text">{{ cat.name }}</text>
        </view>
      </view>

      <scroll-view class="list" scroll-y>
        <view v-for="item in filteredMenu" :key="item.id" class="food-card" @click="goDetail(item.id)">
          <image class="thumb" :src="item.image" mode="aspectFill" />
          <view class="info">
            <text class="name">{{ item.name }}</text>
            <text class="desc">{{ item.desc }}</text>
          </view>
          <view class="add-btn" @click.stop="onStepperChange(item, store.getCount(item.id) + 1)">
            <text class="add-btn-text">+</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="bottom">
      <text class="bottom-text" @click="openCartDrawer">已选 {{ store.totalCount }} 件美食</text>
      <view class="cart-btn" @click="openCartDrawer">
        <text class="cart-btn-text">购物车</text>
      </view>
    </view>

    <!-- Cart Drawer -->
    <view class="drawer-mask" v-if="showDrawer" @click="closeCartDrawer"></view>
    <view class="drawer" :class="{ 'drawer-open': showDrawer }">
      <!-- Drag indicator -->
      <view class="drawer-drag-indicator"></view>

      <view class="drawer-header">
        <text class="drawer-title">购物车</text>
        <view class="drawer-actions">
          <text class="drawer-clear-btn" @click="clearCart" v-if="store.state.cart.length > 0">清空</text>
          <view class="drawer-close" @click="closeCartDrawer">
            <text class="drawer-close-text">✕</text>
          </view>
        </view>
      </view>

      <view class="drawer-divider"></view>

      <scroll-view class="drawer-content" scroll-y>
        <view v-if="store.state.cart.length === 0" class="drawer-empty">
          <text class="drawer-empty-text">购物车是空的</text>
        </view>

        <view v-else>
          <view class="drawer-line" v-for="line in store.state.cart" :key="line.id">
            <image class="drawer-thumb" :src="line.image" mode="aspectFill" />
            <view class="drawer-info">
              <text class="drawer-name">{{ line.name }}</text>
            </view>
            <view class="drawer-stepper">
              <view class="drawer-stepper-btn drawer-stepper-minus"
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
        <text class="drawer-total">已选 {{ store.totalCount }} 件美食</text>
        <view class="drawer-submit-btn" :class="{ 'drawer-submit-disabled': store.totalCount.value === 0 }"
          @click="goOrder">
          <text class="drawer-submit-btn-text">去结算</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

import { useQuickBiteStore } from "@/store/cart"
import type { MenuItem } from "@/types/menu"

const store = useQuickBiteStore()

const activeCategoryIndex = ref(0)
const showDrawer = ref(false)

const activeCategoryId = computed(() => store.state.categories[activeCategoryIndex.value]?.id ?? 1)
const filteredMenu = computed(() => store.state.menu.filter((x) => x.categoryId === activeCategoryId.value))

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
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.header {
  height: 200rpx;
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, #fef9f3 0%, #fdf3e7 40%, #fce8d5 100%);
}

.header::before {
  content: '';
  position: absolute;
  top: -40%;
  right: -15%;
  width: 350rpx;
  height: 350rpx;
  background: radial-gradient(circle, rgba(244, 162, 97, 0.15) 0%, transparent 65%);
  border-radius: 50%;
}

.header::after {
  content: '';
  position: absolute;
  bottom: -25%;
  left: -5%;
  width: 280rpx;
  height: 280rpx;
  background: radial-gradient(circle, rgba(233, 196, 106, 0.18) 0%, transparent 60%);
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
  color: #8b5a3c;
  position: relative;
  z-index: 1;
  display: block;
}

.subtitle {
  font-size: 20rpx;
  color: #b88a6b;
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
  background: #fff;
  border-right: 2rpx solid #ededf2;
}

.sidebar-item {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.sidebar-item.active {
  background-color: #fef6f0;
}

.sidebar-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5rpx;
  height: 32rpx;
  background-color: #f4a261;
  border-radius: 0 3rpx 3rpx 0;
}

.sidebar-item-text {
  font-size: 24rpx;
  color: #6b7280;
  font-weight: 500;
}

.sidebar-item.active .sidebar-item-text {
  color: #111827;
  font-weight: 700;
}

.list {
  flex: 1;
  padding: 24rpx;
  box-sizing: border-box;
  min-height: 0;
}

.food-card {
  background: #fff;
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
  font-size: 24rpx;
  font-weight: 700;
  color: #111827;
}

.desc {
  font-size: 20rpx;
  color: #6b7280;
  margin-top: 6rpx;
}

.add-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  background: #f4a261;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.add-btn:active {
  background: #e8954f;
}

.add-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.bottom {
  height: 140rpx;
  padding: 0 28rpx;
  background: #fff;
  border-top: 2rpx solid #e5e8ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.bottom-text {
  color: #111827;
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
  background: #f4a261;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-btn:active {
  background: #e8954f;
}

.cart-btn-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #fff;
}

/* Drawer Styles */
.drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: calc(100vh - 100rpx);
  /* Leave some space at top */
  background: #fff;
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
  background: #e0e0e0;
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
  color: #6b7380;
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
}

.drawer-clear-btn:active {
  background: #f3f4f6;
  color: #121726;
}

.drawer-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #121726;
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
  color: #6b7380;
  line-height: 1;
}

.drawer-divider {
  height: 2rpx;
  background: #edeff5;
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
  color: #6b7280;
  font-size: 28rpx;
}

.drawer-line {
  background: #fff;
  border: 2rpx solid #edeff5;
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
  background: #edeff5;
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
  color: #121726;
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
  background: #edeff5;
}

.drawer-stepper-minus.drawer-stepper-disabled {
  opacity: 0.5;
}

.drawer-stepper-plus {
  background: #f4a261;
}

.drawer-stepper-plus:active {
  background: #e8954f;
}

.drawer-stepper-btn-text {
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1;
}

.drawer-stepper-minus .drawer-stepper-btn-text {
  color: #121726;
}

.drawer-stepper-plus .drawer-stepper-btn-text {
  color: #fff;
}

.drawer-stepper-value {
  min-width: 28rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: #121726;
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
  color: #6b7380;
}

.drawer-submit-btn {
  width: 200rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background: #f4a261;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-submit-disabled {
  background: #ccc;
}

.drawer-submit-btn:active:not(.drawer-submit-disabled) {
  background: #e8954f;
}

.drawer-submit-btn-text {
  font-size: 26rpx;
  font-weight: 700;
  color: #fff;
}
</style>
