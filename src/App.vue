<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"

onLaunch(() => {
  console.log("App Launch")
})
onShow(() => {
  console.log("App Show")
})
onHide(() => {
  console.log("App Hide")
})
</script>


<style lang="scss" scoped>
/* 全局样式 */
page {
  background: $color-bg;
}
</style>