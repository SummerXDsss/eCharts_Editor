// 构建图表配置
export function buildChartOption(chartType, mappings, data, customConfig) {
  const builders = {
    line: buildLineChart,
    bar: buildBarChart,
    pie: buildPieChart,
    scatter: buildScatterChart,
    radar: buildRadarChart
  }

  const builder = builders[chartType]
  if (!builder) {
    throw new Error(`不支持的图表类型: ${chartType}`)
  }

  return builder(mappings, data, customConfig)
}

// 折线图配置
function buildLineChart(mappings, data, customConfig) {
  const xAxisData = data.map(row => row[mappings.xAxis])
  const yAxisFields = Array.isArray(mappings.yAxis) ? mappings.yAxis : [mappings.yAxis]

  const series = yAxisFields.map(field => ({
    name: field,
    type: 'line',
    data: data.map(row => row[field]),
    smooth: true
  }))

  return {
    title: {
      text: customConfig.title || '折线图',
      subtext: customConfig.subTitle || ''
    },
    tooltip: {
      trigger: 'axis',
      show: customConfig.showTooltip !== false
    },
    legend: {
      data: yAxisFields,
      show: customConfig.showLegend !== false
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      show: customConfig.showGrid !== false
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      boundaryGap: false
    },
    yAxis: {
      type: 'value'
    },
    series: series,
    color: customConfig.colors && customConfig.colors.length > 0 ? customConfig.colors : undefined
  }
}

// 柱状图配置
function buildBarChart(mappings, data, customConfig) {
  const xAxisData = data.map(row => row[mappings.xAxis])
  const yAxisFields = Array.isArray(mappings.yAxis) ? mappings.yAxis : [mappings.yAxis]

  const series = yAxisFields.map(field => ({
    name: field,
    type: 'bar',
    data: data.map(row => row[field])
  }))

  return {
    title: {
      text: customConfig.title || '柱状图',
      subtext: customConfig.subTitle || ''
    },
    tooltip: {
      trigger: 'axis',
      show: customConfig.showTooltip !== false
    },
    legend: {
      data: yAxisFields,
      show: customConfig.showLegend !== false
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      show: customConfig.showGrid !== false
    },
    xAxis: {
      type: 'category',
      data: xAxisData
    },
    yAxis: {
      type: 'value'
    },
    series: series,
    color: customConfig.colors && customConfig.colors.length > 0 ? customConfig.colors : undefined
  }
}

// 饼图配置
function buildPieChart(mappings, data, customConfig) {
  const pieData = data.map(row => ({
    name: row[mappings.name],
    value: row[mappings.value]
  }))

  return {
    title: {
      text: customConfig.title || '饼图',
      subtext: customConfig.subTitle || '',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      show: customConfig.showTooltip !== false
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      show: customConfig.showLegend !== false
    },
    series: [
      {
        name: customConfig.title || '数据',
        type: 'pie',
        radius: '50%',
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ],
    color: customConfig.colors && customConfig.colors.length > 0 ? customConfig.colors : undefined
  }
}

// 散点图配置
function buildScatterChart(mappings, data, customConfig) {
  const scatterData = data.map(row => [row[mappings.xAxis], row[mappings.yAxis]])

  return {
    title: {
      text: customConfig.title || '散点图',
      subtext: customConfig.subTitle || ''
    },
    tooltip: {
      trigger: 'item',
      show: customConfig.showTooltip !== false
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      show: customConfig.showGrid !== false
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'scatter',
        data: scatterData,
        symbolSize: 10
      }
    ],
    color: customConfig.colors && customConfig.colors.length > 0 ? customConfig.colors : undefined
  }
}

// 雷达图配置
function buildRadarChart(mappings, data, customConfig) {
  const indicators = Array.isArray(mappings.indicator) ? mappings.indicator : [mappings.indicator]
  const valueFields = Array.isArray(mappings.value) ? mappings.value : [mappings.value]

  const indicator = indicators.map(ind => ({
    name: ind,
    max: Math.max(...data.map(row => row[ind] || 0))
  }))

  const seriesData = data.map(row => ({
    value: indicators.map(ind => row[ind] || 0),
    name: row[mappings.series] || '数据'
  }))

  return {
    title: {
      text: customConfig.title || '雷达图',
      subtext: customConfig.subTitle || ''
    },
    tooltip: {
      show: customConfig.showTooltip !== false
    },
    legend: {
      show: customConfig.showLegend !== false
    },
    radar: {
      indicator: indicator
    },
    series: [
      {
        type: 'radar',
        data: seriesData
      }
    ],
    color: customConfig.colors && customConfig.colors.length > 0 ? customConfig.colors : undefined
  }
}
