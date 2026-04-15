<template>
  <div class="header">
    <div class="header-left">
      <h1 class="title">
        <chart-icon />
        ECharts 代码生成器
      </h1>
    </div>
    <div class="header-right">
      <t-space :size="12">
        <t-button theme="default" @click="$emit('preview')">
          <template #icon><browse-icon /></template>
          预览
        </t-button>
        <t-button theme="primary" @click="$emit('export')">
          <template #icon><download-icon /></template>
          导出代码
        </t-button>
      </t-space>
    </div>
  </div>
</template>

<script>
import { ChartIcon, BrowseIcon, DownloadIcon } from 'tdesign-icons-vue'

export default {
  name: 'AppHeader',
  components: {
    ChartIcon,
    BrowseIcon,
    DownloadIcon
  }
}
</script>

<style scoped>
.header {
  height: 64px;
  background: #fff;
  border-bottom: 1px solid var(--td-component-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.header-left {
  display: flex;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title :deep(.t-icon) {
  font-size: 24px;
  color: var(--td-brand-color);
}

.header-right {
  display: flex;
  align-items: center;
}
</style>
