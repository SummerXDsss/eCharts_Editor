# ECharts 代码生成器

一个基于 Vue 2 和 TDesign 的可视化 ECharts 图表代码生成工具，支持通过拖拽方式配置图表和映射数据，快速生成可用的图表代码。

![ECharts Code Generator](https://img.shields.io/badge/Vue-2.6-green) ![TDesign](https://img.shields.io/badge/TDesign-1.14-blue) ![ECharts](https://img.shields.io/badge/ECharts-5.4-red)

## ✨ 特性

- 🎨 **多种图表类型** - 支持折线图、柱状图、饼图、散点图、雷达图等常用图表
- 📊 **多种数据源** - 支持手动输入、文件上传（CSV/JSON）、API 获取三种数据导入方式
- 🎯 **拖拽映射** - 直观的拖拽操作，将数据字段映射到图表的不同位置（X轴、Y轴、系列等）
- 👀 **实时预览** - 配置变化时自动更新图表预览
- 💾 **代码导出** - 支持导出完整 HTML、JavaScript 代码片段、JSON 配置三种格式
- 🎭 **现代 UI** - 基于 TDesign 设计系统，界面美观易用

## 🚀 快速开始

### 环境要求

- Node.js >= 14.x
- npm >= 6.x

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run serve
```

访问 http://localhost:8081 查看应用

### 生产构建

```bash
npm run build
```

构建产物将生成在 `dist` 目录

## 📖 使用指南

### 1. 选择图表类型

在左侧面板选择你需要的图表类型（折线图、柱状图、饼图等）

### 2. 配置数据源

在右侧面板选择数据导入方式：

- **手动输入**：通过可编辑表格直接输入数据
- **文件上传**：拖拽或选择 CSV/JSON 文件上传
- **API 获取**：配置 API 地址和参数，从接口获取数据

### 3. 拖拽字段映射

将右侧的数据字段拖拽到左侧的映射目标区域：

- 不同图表类型有不同的映射规则
- 必填字段会有红色标记
- 支持多字段映射的位置会有蓝色标记

### 4. 配置图表样式

在左侧配置面板调整图表的标题、图例、提示框等显示选项

### 5. 预览和导出

- 中间区域实时预览图表效果
- 点击顶部"导出代码"按钮，选择需要的格式导出

## 🛠️ 技术栈

- **前端框架**: Vue 2.6
- **状态管理**: Vuex 3.x
- **UI 组件库**: TDesign Vue 1.14
- **图表库**: ECharts 5.4
- **拖拽功能**: vuedraggable 2.x
- **HTTP 请求**: Axios
- **数据解析**: PapaParse (CSV)

## 📁 项目结构

```
eCharts_Code_generator/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 资源文件
│   ├── components/        # 组件
│   │   ├── chart-config/      # 图表配置组件
│   │   ├── chart-preview/     # 图表预览组件
│   │   ├── code-generation/   # 代码生成组件
│   │   ├── data-source/       # 数据源组件
│   │   ├── field-mapping/     # 字段映射组件
│   │   └── layout/            # 布局组件
│   ├── constants/         # 常量定义
│   ├── router/            # 路由配置
│   ├── store/             # Vuex 状态管理
│   │   └── modules/           # 状态模块
│   ├── utils/             # 工具函数
│   ├── views/             # 页面视图
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── babel.config.js        # Babel 配置
├── vue.config.js          # Vue CLI 配置
└── package.json           # 项目依赖
```

## 🎯 核心功能模块

### 数据源管理 (store/modules/data.js)

管理数据的导入、解析和存储，支持多种数据源类型

### 字段映射 (store/modules/mapping.js)

管理字段到图表元素的映射关系，验证映射规则

### 图表配置 (store/modules/chart.js)

管理图表类型、样式配置和 ECharts 选项

### 图表模板 (utils/chartTemplates.js)

根据图表类型和映射关系构建 ECharts 配置对象

### 代码生成 (utils/codeGenerator.js)

生成完整的 HTML、JavaScript 或 JSON 格式的代码

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Vue.js](https://vuejs.org/)
- [TDesign](https://tdesign.tencent.com/)
- [ECharts](https://echarts.apache.org/)
- [vuedraggable](https://github.com/SortableJS/Vue.Draggable)
