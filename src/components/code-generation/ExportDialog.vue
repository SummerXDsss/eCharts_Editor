<template>
  <t-dialog
    v-model:visible="visible"
    header="导出代码"
    width="70%"
    :close-on-overlay-click="false"
    :footer="false"
  >
    <div class="export-content">
      <t-tabs v-model="activeTab">
        <t-tab-panel value="html" label="完整 HTML">
          <div class="code-actions">
            <t-space :size="8">
              <t-button size="small" variant="outline" @click="copyCode">
                <template #icon><file-copy-icon /></template>
                复制代码
              </t-button>
              <t-button size="small" theme="primary" @click="downloadHTML">
                <template #icon><download-icon /></template>
                下载 HTML
              </t-button>
            </t-space>
          </div>
          <pre class="code-preview"><code>{{ htmlCode }}</code></pre>
        </t-tab-panel>

        <t-tab-panel value="js" label="JavaScript">
          <div class="code-actions">
            <t-button size="small" variant="outline" @click="copyCode">
              <template #icon><file-copy-icon /></template>
              复制代码
            </t-button>
          </div>
          <pre class="code-preview"><code>{{ jsCode }}</code></pre>
        </t-tab-panel>

        <t-tab-panel value="json" label="JSON 配置">
          <div class="code-actions">
            <t-button size="small" variant="outline" @click="copyCode">
              <template #icon><file-copy-icon /></template>
              复制代码
            </t-button>
          </div>
          <pre class="code-preview"><code>{{ jsonCode }}</code></pre>
        </t-tab-panel>
      </t-tabs>
    </div>
  </t-dialog>
</template>

<script>
import { FileCopyIcon, DownloadIcon } from 'tdesign-icons-vue'
import { mapState } from 'vuex'
import { generateHTML, generateJavaScript, generateJSON } from '@/utils/codeGenerator'

export default {
  name: 'ExportDialog',
  components: {
    FileCopyIcon,
    DownloadIcon
  },
  data() {
    return {
      visible: false,
      activeTab: 'html'
    }
  },
  computed: {
    ...mapState('chart', ['chartOptions']),
    ...mapState('data', ['parsedData']),
    htmlCode() {
      if (!this.chartOptions || Object.keys(this.chartOptions).length === 0) {
        return '// 请先配置图表'
      }
      return generateHTML(this.chartOptions, this.parsedData)
    },
    jsCode() {
      if (!this.chartOptions || Object.keys(this.chartOptions).length === 0) {
        return '// 请先配置图表'
      }
      return generateJavaScript(this.chartOptions)
    },
    jsonCode() {
      if (!this.chartOptions || Object.keys(this.chartOptions).length === 0) {
        return '// 请先配置图表'
      }
      return generateJSON(this.chartOptions)
    }
  },
  methods: {
    show() {
      if (!this.chartOptions || Object.keys(this.chartOptions).length === 0) {
        this.$message.warning('请先配置图表并预览')
        return
      }
      this.visible = true
    },
    copyCode() {
      let code = ''
      switch (this.activeTab) {
        case 'html':
          code = this.htmlCode
          break
        case 'js':
          code = this.jsCode
          break
        case 'json':
          code = this.jsonCode
          break
      }

      const textarea = document.createElement('textarea')
      textarea.value = code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)

      this.$message.success('代码已复制到剪贴板')
    },
    downloadHTML() {
      const blob = new Blob([this.htmlCode], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'echarts-chart.html'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      this.$message.success('HTML 文件已下载')
    }
  }
}
</script>

<style scoped>
.export-content {
  max-height: 600px;
  overflow: auto;
}

.code-actions {
  display: flex;
  margin-bottom: 16px;
}

.code-preview {
  background: var(--td-bg-color-page);
  border: 1px solid var(--td-component-border);
  border-radius: var(--td-radius-default);
  padding: 16px;
  max-height: 500px;
  overflow: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: var(--td-text-color-primary);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.code-preview code {
  font-family: inherit;
}
</style>
