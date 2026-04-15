<template>
  <div class="chart-preview">
    <div class="preview-header">
      <chart-line-icon />
      <span>图表预览</span>
    </div>

    <div v-if="!hasData" class="empty-state">
      <image-icon class="empty-icon" />
      <p>暂无数据，请先配置数据源和字段映射</p>
    </div>

    <div v-else-if="!isValidMapping" class="empty-state">
      <error-circle-icon class="empty-icon warning" />
      <p>请完成必填字段的映射</p>
    </div>

    <div v-else class="chart-container">
      <div ref="chart" class="chart"></div>
    </div>
  </div>
</template>

<script>
import { ChartLineIcon, ImageIcon, ErrorCircleIcon } from 'tdesign-icons-vue'
import * as echarts from 'echarts'
import { mapState, mapGetters } from 'vuex'
import { buildChartOption } from '@/utils/chartTemplates'
import { checkMappingComplete } from '@/utils/fieldMapper'
import { CHART_TYPES } from '@/constants/chartTypes'

export default {
  name: 'ChartPreview',
  components: {
    ChartLineIcon,
    ImageIcon,
    ErrorCircleIcon
  },
  data() {
    return {
      chartInstance: null,
      updateTimer: null
    }
  },
  computed: {
    ...mapState('data', ['parsedData']),
    ...mapState('chart', ['chartType', 'customConfig']),
    ...mapState('mapping', ['mappings']),
    ...mapGetters(['isReadyToGenerate']),
    hasData() {
      return this.parsedData && this.parsedData.length > 0
    },
    mappingRules() {
      if (!this.chartType) return {}
      const chartConfig = Object.values(CHART_TYPES).find(c => c.id === this.chartType)
      return chartConfig ? chartConfig.mappingRules : {}
    },
    isValidMapping() {
      const result = checkMappingComplete(this.mappings, this.mappingRules)
      return result.complete
    }
  },
  watch: {
    chartType() {
      this.scheduleUpdate()
    },
    mappings: {
      handler() {
        this.scheduleUpdate()
      },
      deep: true
    },
    customConfig: {
      handler() {
        this.scheduleUpdate()
      },
      deep: true
    },
    parsedData() {
      this.scheduleUpdate()
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
    }
    if (this.updateTimer) {
      clearTimeout(this.updateTimer)
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    initChart() {
      if (this.$refs.chart) {
        this.chartInstance = echarts.init(this.$refs.chart)
      }
    },
    scheduleUpdate() {
      if (this.updateTimer) {
        clearTimeout(this.updateTimer)
      }
      this.updateTimer = setTimeout(() => {
        this.updateChart()
      }, 300)
    },
    updateChart() {
      if (!this.chartInstance || !this.hasData || !this.isValidMapping) {
        return
      }

      try {
        const option = buildChartOption(
          this.chartType,
          this.mappings,
          this.parsedData,
          this.customConfig
        )

        this.chartInstance.setOption(option, true)
        this.$store.dispatch('chart/updateChartOptions', option)
      } catch (error) {
        console.error('图表渲染失败:', error)
        this.$message.error('图表渲染失败: ' + error.message)
      }
    },
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    }
  }
}
</script>

<style scoped>
.chart-preview {
  height: 100%;
  background: var(--td-bg-color-container);
  border-radius: var(--td-radius-large);
  box-shadow: var(--td-shadow-1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--td-component-border);
  font-size: 14px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  background: var(--td-bg-color-container);
}

.preview-header :deep(.t-icon) {
  font-size: 18px;
  color: var(--td-brand-color);
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--td-text-color-placeholder);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 16px;
  color: var(--td-text-color-disabled);
}

.empty-icon.warning {
  color: var(--td-warning-color);
}

.empty-state p {
  font-size: 14px;
}

.chart-container {
  flex: 1;
  padding: 20px;
  overflow: hidden;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
