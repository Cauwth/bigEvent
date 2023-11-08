<script setup>
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <div class="extra">
          <!-- 用具名插槽占位 -->
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <!-- 默认插槽，填充主体页面 -->
    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
