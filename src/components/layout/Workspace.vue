<template>
  <div class="workspace">
    <div class="left-panel">
      <chart-type-selector />
      <field-mapping-panel />
      <chart-config-panel />
    </div>

    <div class="center-panel">
      <chart-preview />
    </div>

    <div class="right-panel">
      <data-source-panel />
    </div>

    <export-dialog ref="exportDialog" />
  </div>
</template>

<script>
import ChartTypeSelector from '@/components/chart-config/ChartTypeSelector.vue'
import ChartConfigPanel from '@/components/chart-config/ChartConfigPanel.vue'
import FieldMappingPanel from '@/components/field-mapping/FieldMappingPanel.vue'
import ChartPreview from '@/components/chart-preview/ChartPreview.vue'
import DataSourcePanel from '@/components/data-source/DataSourcePanel.vue'
import ExportDialog from '@/components/code-generation/ExportDialog.vue'

export default {
  name: 'Workspace',
  components: {
    ChartTypeSelector,
    ChartConfigPanel,
    FieldMappingPanel,
    ChartPreview,
    DataSourcePanel,
    ExportDialog
  },
  methods: {
    showExportDialog() {
      this.$refs.exportDialog.show()
    },
    showPreview() {
      // 预览功能已在中间面板实时显示
      this.$message.success('图表预览已在中间区域显示')
    }
  }
}
</script>

<style scoped>
.workspace {
  flex: 1;
  display: flex;
  overflow: hidden;
  background: #f5f7fa;
}

.left-panel {
  width: 300px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.center-panel {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.right-panel {
  width: 350px;
  background: #fff;
  border-left: 1px solid #e4e7ed;
  overflow-y: auto;
}
</style>
