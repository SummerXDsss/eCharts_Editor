<template>
  <div class="workspace">
    <div class="split-container" ref="splitContainer">
      <div class="left-panel" ref="leftPanel">
        <div class="left-split-container">
          <div class="chart-type-section" ref="chartTypeSection">
            <chart-type-selector />
          </div>
          <div class="field-mapping-section" ref="fieldMappingSection">
            <field-mapping-panel />
          </div>
          <div class="chart-config-section" ref="chartConfigSection">
            <chart-config-panel />
          </div>
        </div>
      </div>

      <div class="center-panel" ref="centerPanel">
        <chart-preview />
      </div>

      <div class="right-panel" ref="rightPanel">
        <data-source-panel />
      </div>
    </div>

    <export-dialog ref="exportDialog" />
  </div>
</template>

<script>
import Split from 'split.js'
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
  data() {
    return {
      horizontalSplit: null,
      verticalSplit: null
    }
  },
  mounted() {
    this.initSplit()
  },
  beforeDestroy() {
    if (this.horizontalSplit) {
      this.horizontalSplit.destroy()
    }
    if (this.verticalSplit) {
      this.verticalSplit.destroy()
    }
  },
  methods: {
    initSplit() {
      // 横向分割（左中右三栏）
      this.horizontalSplit = Split([this.$refs.leftPanel, this.$refs.centerPanel, this.$refs.rightPanel], {
        sizes: [25, 45, 30],
        minSize: [320, 400, 350],
        gutterSize: 8,
        cursor: 'col-resize',
        direction: 'horizontal',
        snapOffset: 0
      })

      // 纵向分割（左侧面板内部）
      this.$nextTick(() => {
        this.verticalSplit = Split([
          this.$refs.chartTypeSection,
          this.$refs.fieldMappingSection,
          this.$refs.chartConfigSection
        ], {
          sizes: [20, 50, 30],
          minSize: [150, 300, 200],
          gutterSize: 8,
          cursor: 'row-resize',
          direction: 'vertical',
          snapOffset: 0
        })
      })
    },
    showExportDialog() {
      this.$refs.exportDialog.show()
    },
    showPreview() {
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

.split-container {
  display: flex;
  width: 100%;
  height: 100%;
}

.left-panel {
  background: #fff;
  border-right: 1px solid #e4e7ed;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.left-split-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.chart-type-section,
.field-mapping-section,
.chart-config-section {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.center-panel {
  padding: 20px;
  overflow: auto;
  background: #f5f7fa;
}

.right-panel {
  background: #fff;
  border-left: 1px solid #e4e7ed;
  overflow-y: auto;
}

/* Split.js gutter 样式 */
:deep(.gutter) {
  background-color: #e4e7ed;
  background-repeat: no-repeat;
  background-position: 50%;
  transition: background-color 0.2s;
}

:deep(.gutter:hover) {
  background-color: var(--td-brand-color);
}

:deep(.gutter.gutter-horizontal) {
  cursor: col-resize;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
}

:deep(.gutter.gutter-vertical) {
  cursor: row-resize;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
}
</style>
