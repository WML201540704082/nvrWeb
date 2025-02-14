<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName" :fill="color"></use>
  </svg>
</template>

<script setup>
// 此处用的是vue3中的setup函数语法糖
import { defineProps, computed } from 'vue'
const props = defineProps({ // 接收props参数
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: null,
  },
})

const iconName = computed(() => { // computed计算属性
  return `#icon-${props.icon}`
})
</script>

<style lang="less" scoped>
.svg-icon {
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
