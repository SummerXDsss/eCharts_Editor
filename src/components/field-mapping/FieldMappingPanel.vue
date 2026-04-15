<template>
  <div class="field-mapping-panel">
    <div class="panel-header">
      <link-icon />
      <span>字段映射</span>
    </div>

    <div class="mapping-content">
      <div v-if="availableFields.length === 0" class="empty-state">
        <info-circle-icon class="empty-icon" />
        <p>请先在右侧添加数据源</p>
      </div>

      <div v-else class="mapping-container">
        <div class="fields-section">
          <div class="section-title">可用字段</div>
          <data-field-list :fields="availableFields" />
        </div>

        <div class="targets-section">
          <div class="section-title">映射目标</div>
          <div v-if="!chartType" class="empty-hint">
            <info-circle-icon />
            <span>请先选择图表类型</span>
          </div>
          <div v-else class="mapping-targets">
            <mapping-target
              v-for="(rule, key) in mappingRules"
              :key="key"
              :target-key="key"
              :rule="rule"
              :mapped-fields="mappings[key]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LinkIcon, InfoCircleIcon } from 'tdesign-icons-vue'
import { mapState } from 'vuex'
import { CHART_TYPES } from '@/constants/chartTypes'
import DataFieldList from './DataFieldList.vue'
import MappingTarget from './MappingTarget.vue'

export default {
  name: 'FieldMappingPanel',
  components: {
    LinkIcon,
    InfoCircleIcon,
    DataFieldList,
    MappingTarget
  },
  computed: {
    ...mapState('mapping', ['availableFields', 'mappings']),
    ...mapState('chart', ['chartType']),
    mappingRules() {
      if (!this.chartType) return {}
      const chartConfig = Object.values(CHART_TYPES).find(c => c.id === this.chartType)
      return chartConfig ? chartConfig.mappingRules : {}
    }
  }
}
</script>

<style scoped>
.field-mapping-panel {
  padding: 16px;
  border-bottom: 1px solid var(--td-component-border);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin-bottom: 16px;
}

.panel-header :deep(.t-icon) {
  font-size: 18px;
  color: var(--td-brand-color);
}

.mapping-content {
  flex: 1;
  overflow: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  color: var(--td-text-color-placeholder);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 12px;
  color: var(--td-text-color-disabled);
}

.empty-state p {
  font-size: 14px;
}

.mapping-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--td-text-color-secondary);
  margin-bottom: 12px;
}

.fields-section {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--td-component-border);
}

.targets-section {
  flex: 1;
}

.empty-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  color: var(--td-text-color-placeholder);
  font-size: 13px;
}

.empty-hint :deep(.t-icon) {
  font-size: 16px;
}

.mapping-targets {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
