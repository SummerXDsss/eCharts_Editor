<template>
  <div class="data-source-panel">
    <div class="panel-header">
      <folder-open-icon />
      <span>数据源</span>
    </div>

    <t-tabs v-model="activeTab" class="data-tabs">
      <t-tab-panel value="manual" label="手动输入">
        <manual-input />
      </t-tab-panel>
      <t-tab-panel value="file" label="文件上传">
        <file-upload />
      </t-tab-panel>
      <t-tab-panel value="api" label="API 获取">
        <api-config />
      </t-tab-panel>
    </t-tabs>
  </div>
</template>

<script>
import { FolderOpenIcon } from 'tdesign-icons-vue'
import ManualInput from './ManualInput.vue'
import FileUpload from './FileUpload.vue'
import ApiConfig from './ApiConfig.vue'

export default {
  name: 'DataSourcePanel',
  components: {
    FolderOpenIcon,
    ManualInput,
    FileUpload,
    ApiConfig
  },
  data() {
    return {
      activeTab: 'manual'
    }
  }
}
</script>

<style scoped>
.data-source-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  padding: 16px;
  border-bottom: 1px solid var(--td-component-border);
}

.panel-header :deep(.t-icon) {
  font-size: 18px;
  color: var(--td-brand-color);
}

.data-tabs {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.data-tabs :deep(.t-tabs__content) {
  flex: 1;
  overflow: auto;
  padding: 16px;
}
</style>
