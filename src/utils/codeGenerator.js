// 生成完整的 HTML 代码
export function generateHTML(chartOptions, data) {
  const optionStr = JSON.stringify(chartOptions, null, 2)
  const dataStr = JSON.stringify(data, null, 2)

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${chartOptions.title?.text || 'ECharts 图表'}</title>
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
    }
    #chart {
      width: 100%;
      height: 600px;
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
  <div id="chart"></div>

  <script>
    // 初始化图表
    var chartDom = document.getElementById('chart');
    var myChart = echarts.init(chartDom);

    // 图表配置
    var option = ${optionStr};

    // 设置配置项
    myChart.setOption(option);

    // 响应式调整
    window.addEventListener('resize', function() {
      myChart.resize();
    });

    // 数据源（用于参考）
    var sourceData = ${dataStr};
  </script>
</body>
</html>`
}

// 生成 JavaScript 代码片段
export function generateJavaScript(chartOptions) {
  const optionStr = JSON.stringify(chartOptions, null, 2)

  return `// 初始化 ECharts 实例
var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);

// 配置项
var option = ${optionStr};

// 使用配置项显示图表
myChart.setOption(option);

// 响应式调整
window.addEventListener('resize', function() {
  myChart.resize();
});`
}

// 生成 JSON 配置
export function generateJSON(chartOptions) {
  return JSON.stringify(chartOptions, null, 2)
}
