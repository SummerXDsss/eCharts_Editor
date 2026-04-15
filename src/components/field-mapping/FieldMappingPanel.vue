<template>
  <div class="field-mapping-panel">
    <div class="panel-header">
      <link-icon />
      <span>字段映射</span>
      <t-button
        v-if="availableFields.length > 0 && chartType"
        size="small"
        theme="primary"
        @click="openMappingDialog"
        style="margin-left: auto;"
      >
        <template #icon><edit-icon /></template>
        配置映射
      </t-button>
    </div>

    <div class="mapping-content">
      <div v-if="availableFields.length === 0" class="empty-state">
        <info-circle-icon class="empty-icon" />
        <p>请先在右侧添加数据源</p>
      </div>

      <div v-else-if="!chartType" class="empty-state">
        <info-circle-icon class="empty-icon" />
        <p>请先选择图表类型</p>
      </div>

      <div v-else class="mapping-summary">
        <t-alert theme="info" :closable="false">
          <template #icon><help-circle-icon /></template>
          点击"配置映射"按钮，通过拖拽方式将数据字段映射到图表元素
        </t-alert>

        <div class="mapping-status">
          <div class="status-item" v-for="(rule, key) in mappingRules" :key="key">
            <div class="status-label">
              <span>{{ rule.label }}</span>
              <t-tag v-if="rule.required" size="small" theme="danger" variant="light">必填</t-tag>
            </div>
            <div class="status-value">
              <t-tag v-if="mappings[key]" theme="success" variant="light">
                {{ Array.isArray(mappings[key]) ? mappings[key].join(', ') : mappings[key] }}
              </t-tag>
              <span v-else class="not-mapped">未映射</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 映射配置弹窗 -->
    <t-dialog
      :visible.sync="dialogVisible"
      header="字段映射配置"
      width="900px"
      :footer="false"
      :close-on-overlay-click="false"
    >
      <div class="mapping-dialog-content">
        <div class="dialog-help">
          <t-steps :current="0" theme="dot">
            <t-step-item title="选择字段" content="从左侧可用字段中选择" />
            <t-step-item title="拖拽映射" content="拖拽到右侧对应的映射目标" />
            <t-step-item title="完成配置" content="点击确定保存映射关系" />
          </t-steps>
        </div>

        <div class="dialog-mapping-container">
          <div class="dialog-fields-section">
            <div class="section-title">可用字段</div>
            <data-field-list :fields="availableFields" />
          </div>

          <div class="dialog-targets-section">
            <div class="section-title">映射目标</div>
            <div class="mapping-targets">
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

        <div class="dialog-footer">
          <t-space>
            <t-button theme="default" @click="dialogVisible = false">取消</t-button>
            <t-button theme="primary" @click="confirmMapping">
              <template #icon><check-icon /></template>
              确定
            </t-button>
          </t-space>
        </div>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import { LinkIcon, InfoCircleIcon, EditIcon, HelpCircleIcon, CheckIcon } from 'tdesign-icons-vue'
import { mapState } from 'vuex'
import { CHART_TYPES } from '@/constants/chartTypes'
import DataFieldList from './DataFieldList.vue'
import MappingTarget from './MappingTarget.vue'

export default {
  name: 'FieldMappingPanel',
  components: {
    LinkIcon,
    InfoCircleIcon,
    EditIcon,
    HelpCircleIcon,
    CheckIcon,
    DataFieldList,
    MappingTarget
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    ...mapState('mapping', ['availableFields', 'mappings']),
    ...mapState('chart', ['chartType']),
    mappingRules() {
      if (!this.chartType) return {}
      const chartConfig = Object.values(CHART_TYPES).find(c => c.id === this.chartType)
      return chartConfig ? chartConfig.mappingRules : {}
    }
  },
  methods: {
    openMappingDialog() {
      console.log('openMappingDialog called')
      this.dialogVisible = true
      console.log('dialogVisible set to:', this.dialogVisible)
    },
    confirmMapping() {
      // 验证必填字段
      const missingRequired = []
      Object.entries(this.mappingRules).forEach(([key, rule]) => {
        if (rule.required && !this.mappings[key]) {
          missingRequired.push(rule.label)
        }
      })

      if (missingRequired.length > 0) {
        this.$message.warning(`请完成必填字段的映射: ${missingRequired.join(', ')}`)
        return
      }

      this.dialogVisible = false
      this.$message.success('字段映射配置成功')
    }
  }
}
</script>

<style scoped>
.field-mapping-panel {
  padding: 20px;
  border-bottom: 1px solid var(--td-component-border);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 400px;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin-bottom: 20px;
}

.panel-header :deep(.t-icon) {
  font-size: 20px;
  color: var(--td-brand-color);
}

.mapping-content {
  flex: 1;
  overflow: auto;
  min-height: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--td-text-color-placeholder);
}

.empty-icon {
  font-size: 72px;
  margin-bottom: 16px;
  color: var(--td-text-color-disabled);
}

.empty-state p {
  font-size: 14px;
}

.mapping-summary {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mapping-status {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-item {
  padding: 12px;
  background: var(--td-bg-color-container);
  border: 1px solid var(--td-component-border);
  border-radius: var(--td-radius-default);
}

.status-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.status-value {
  font-size: 13px;
}

.not-mapped {
  color: var(--td-text-color-placeholder);
}

/* 弹窗样式 */
.mapping-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dialog-help {
  padding: 16px;
  background: var(--td-bg-color-container);
  border-radius: var(--td-radius-default);
}

.dialog-mapping-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  min-height: 400px;
  max-height: 500px;
}

.dialog-fields-section,
.dialog-targets-section {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--td-text-color-secondary);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--td-brand-color);
}

.dialog-fields-section {
  padding-right: 12px;
  border-right: 1px solid var(--td-component-border);
  overflow-y: auto;
}

.dialog-targets-section {
  overflow-y: auto;
}

.mapping-targets {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid var(--td-component-border);
}
</style>
