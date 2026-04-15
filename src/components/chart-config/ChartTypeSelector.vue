<template>
  <div class="chart-type-selector">
    <div class="panel-header">
      <view-module-icon />
      <span>图表类型</span>
    </div>
    <div class="chart-types">
      <div
        v-for="chart in chartTypes"
        :key="chart.id"
        :class="['chart-type-item', { active: currentType === chart.id }]"
        @click="selectChartType(chart.id)"
      >
        <component :is="getChartIcon(chart.id)" class="chart-icon" />
        <span>{{ chart.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ViewModuleIcon, ChartLineIcon, ChartBarIcon, ChartPieIcon, ChartScatterIcon, ChartRadarIcon } from 'tdesign-icons-vue'
import { CHART_TYPE_LIST } from '@/constants/chartTypes'
import { mapState } from 'vuex'

export default {
  name: 'ChartTypeSelector',
  components: {
    ViewModuleIcon,
    ChartLineIcon,
    ChartBarIcon,
    ChartPieIcon,
    ChartScatterIcon,
    ChartRadarIcon
  },
  computed: {
    ...mapState('chart', ['chartType']),
    chartTypes() {
      return CHART_TYPE_LIST
    },
    currentType() {
      return this.chartType
    }
  },
  methods: {
    selectChartType(type) {
      this.$store.dispatch('chart/changeChartType', type)
      this.$store.dispatch('mapping/clearMappings')
    },
    getChartIcon(type) {
      const iconMap = {
        line: 'ChartLineIcon',
        bar: 'ChartBarIcon',
        pie: 'ChartPieIcon',
        scatter: 'ChartScatterIcon',
        radar: 'ChartRadarIcon'
      }
      return iconMap[type] || 'ChartLineIcon'
    }
  }
}
</script>

<style scoped>
.chart-type-selector {
  padding: 16px;
  border-bottom: 1px solid var(--td-component-border);
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

.chart-types {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.chart-type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;
  border: 1px solid var(--td-component-border);
  border-radius: var(--td-radius-default);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.38, 0, 0.24, 1);
  background: var(--td-bg-color-container);
}

.chart-type-item:hover {
  border-color: var(--td-brand-color);
  background: var(--td-brand-color-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.15);
}

.chart-type-item.active {
  border-color: var(--td-brand-color);
  background: var(--td-brand-color);
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.25);
}

.chart-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.chart-type-item.active .chart-icon {
  color: #fff;
}

.chart-type-item span {
  font-size: 13px;
  font-weight: 500;
}
</style>
