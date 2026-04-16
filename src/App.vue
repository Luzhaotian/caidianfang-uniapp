<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>

<style>
/* Vant 主题定制 - 暖色调 */
page {
  --van-primary-color: #f4a261;
  --van-success-color: #e9c46a;
  --van-danger-color: #e76f51;
  --van-warning-color: #f4a261;
  --van-active-color: #e8954f;
  --van-background-color: #f7f8fa;
  --van-background-color-light: #fef6f0;
  --van-text-color: #3f3f3f;
  --van-text-color-2: #666;
  --van-text-color-3: #999;
  --van-border-color: #ebedf0;
  --van-divider-border-color: #ebedf0;
}
</style>
