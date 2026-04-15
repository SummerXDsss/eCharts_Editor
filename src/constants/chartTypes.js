// 图表类型定义和映射规则
export const CHART_TYPES = {
  LINE: {
    id: 'line',
    name: '折线图',
    icon: 'el-icon-data-line',
    mappingRules: {
      xAxis: { required: true, multiple: false, type: ['string', 'number', 'date'], label: 'X轴' },
      yAxis: { required: true, multiple: true, type: ['number'], label: 'Y轴' },
      series: { required: false, multiple: false, type: ['string'], label: '系列' }
    }
  },
  BAR: {
    id: 'bar',
    name: '柱状图',
    icon: 'el-icon-data-analysis',
    mappingRules: {
      xAxis: { required: true, multiple: false, type: ['string', 'number', 'date'], label: 'X轴' },
      yAxis: { required: true, multiple: true, type: ['number'], label: 'Y轴' },
      series: { required: false, multiple: false, type: ['string'], label: '系列' }
    }
  },
  PIE: {
    id: 'pie',
    name: '饼图',
    icon: 'el-icon-pie-chart',
    mappingRules: {
      name: { required: true, multiple: false, type: ['string'], label: '名称' },
      value: { required: true, multiple: false, type: ['number'], label: '数值' }
    }
  },
  SCATTER: {
    id: 'scatter',
    name: '散点图',
    icon: 'el-icon-s-data',
    mappingRules: {
      xAxis: { required: true, multiple: false, type: ['number'], label: 'X轴' },
      yAxis: { required: true, multiple: false, type: ['number'], label: 'Y轴' },
      series: { required: false, multiple: false, type: ['string'], label: '系列' }
    }
  },
  RADAR: {
    id: 'radar',
    name: '雷达图',
    icon: 'el-icon-s-marketing',
    mappingRules: {
      indicator: { required: true, multiple: true, type: ['string'], label: '指标' },
      value: { required: true, multiple: true, type: ['number'], label: '数值' },
      series: { required: false, multiple: false, type: ['string'], label: '系列' }
    }
  }
}

export const CHART_TYPE_LIST = Object.values(CHART_TYPES)
