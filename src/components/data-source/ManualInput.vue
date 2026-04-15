<template>
  <div class="manual-input">
    <t-alert theme="info" :close="false">
      <template #icon><help-circle-icon /></template>
      输入表格数据，每行是一条记录，每列是一个字段（类似 Excel 表格）
    </t-alert>

    <!-- 列定义 -->
    <div class="columns-section">
      <div class="section-header">
        <span class="section-title">定义列</span>
        <t-button size="small" variant="outline" @click="addColumn">
          <template #icon><add-icon /></template>
          添加列
        </t-button>
      </div>

      <div class="columns-list">
        <div v-for="(col, colIndex) in columns" :key="colIndex" class="column-item">
          <t-input
            v-model="col.name"
            placeholder="列名（如：月份）"
            size="small"
            class="column-name"
          />
          <t-select
            v-model="col.type"
            size="small"
            class="column-type"
          >
            <t-option value="string" label="文本" />
            <t-option value="number" label="数字" />
          </t-select>
          <t-button
            theme="danger"
            variant="text"
            size="small"
            @click="deleteColumn(colIndex)"
            :disabled="columns.length === 1"
          >
            <template #icon><delete-icon /></template>
          </t-button>
        </div>
      </div>
    </div>

    <!-- 数据行 -->
    <div class="rows-section">
      <div class="section-header">
        <span class="section-title">数据行</span>
        <t-button size="small" variant="outline" @click="addRow">
          <template #icon><add-icon /></template>
          添加行
        </t-button>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th v-for="(col, colIndex) in columns" :key="colIndex">
                {{ col.name || `列${colIndex + 1}` }}
                <t-tag size="small" variant="light" :theme="col.type === 'number' ? 'success' : 'default'">
                  {{ col.type === 'number' ? '数字' : '文本' }}
                </t-tag>
              </th>
              <th class="action-column">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
              <td v-for="(col, colIndex) in columns" :key="colIndex">
                <t-input
                  v-if="col.type === 'string'"
                  v-model="row.values[colIndex]"
                  size="small"
                  placeholder="输入文本"
                />
                <t-input-number
                  v-else
                  v-model="row.values[colIndex]"
                  size="small"
                  placeholder="输入数字"
                  :style="{ width: '100%' }"
                />
              </td>
              <td class="action-column">
                <t-button
                  theme="danger"
                  variant="text"
                  size="small"
                  @click="deleteRow(rowIndex)"
                  :disabled="rows.length === 1"
                >
                  <template #icon><delete-icon /></template>
                </t-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="toolbar">
      <t-space :size="8">
        <t-button theme="primary" @click="applyData">
          <template #icon><check-icon /></template>
          应用数据
        </t-button>
        <t-button variant="outline" @click="loadExample">
          <template #icon><file-icon /></template>
          加载示例
        </t-button>
        <t-button variant="outline" @click="clearAll">
          <template #icon><close-icon /></template>
          清空
        </t-button>
      </t-space>
    </div>

    <div v-if="previewData.length > 0" class="preview-section">
      <div class="preview-header">数据预览（共 {{ previewData.length }} 条）</div>
      <div class="preview-json">
        <pre>{{ JSON.stringify(previewData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { AddIcon, CheckIcon, DeleteIcon, CloseIcon, FileIcon, HelpCircleIcon } from 'tdesign-icons-vue'
import { detectFields } from '@/utils/dataParser'

export default {
  name: 'ManualInput',
  components: {
    AddIcon,
    CheckIcon,
    DeleteIcon,
    CloseIcon,
    FileIcon,
    HelpCircleIcon
  },
  data() {
    return {
      columns: [
        { name: '列1', type: 'string' },
        { name: '列2', type: 'number' }
      ],
      rows: [
        { values: ['', 0] },
        { values: ['', 0] }
      ],
      previewData: []
    }
  },
  methods: {
    addColumn() {
      const newColName = `列${this.columns.length + 1}`
      this.columns.push({ name: newColName, type: 'string' })
      // 为所有现有行添加新列的默认值
      this.rows.forEach(row => {
        row.values.push('')
      })
    },
    deleteColumn(colIndex) {
      if (this.columns.length === 1) {
        this.$message.warning('至少保留一列')
        return
      }
      this.columns.splice(colIndex, 1)
      // 删除所有行中对应列的值
      this.rows.forEach(row => {
        row.values.splice(colIndex, 1)
      })
    },
    addRow() {
      const newRow = { values: [] }
      this.columns.forEach(col => {
        newRow.values.push(col.type === 'number' ? 0 : '')
      })
      this.rows.push(newRow)
    },
    deleteRow(rowIndex) {
      if (this.rows.length === 1) {
        this.$message.warning('至少保留一行')
        return
      }
      this.rows.splice(rowIndex, 1)
    },
    applyData() {
      // 验证列名
      const columnNames = this.columns.map(col => col.name.trim()).filter(name => name)
      if (columnNames.length !== this.columns.length) {
        this.$message.warning('请为所有列设置名称')
        return
      }

      // 检查列名是否重复
      const uniqueNames = new Set(columnNames)
      if (uniqueNames.size !== columnNames.length) {
        this.$message.warning('列名不能重复')
        return
      }

      // 转换为数据数组
      const data = []
      for (const row of this.rows) {
        const obj = {}
        let hasData = false

        this.columns.forEach((col, index) => {
          const value = row.values[index]
          if (col.type === 'number') {
            obj[col.name.trim()] = Number(value) || 0
            if (value !== '' && value !== 0) hasData = true
          } else {
            obj[col.name.trim()] = String(value || '')
            if (value !== '') hasData = true
          }
        })

        if (hasData) {
          data.push(obj)
        }
      }

      if (data.length === 0) {
        this.$message.warning('请至少输入一行有效数据')
        return
      }

      const fields = detectFields(data)

      this.$store.dispatch('data/updateDataSource', {
        type: 'manual',
        data: data,
        fields
      })

      this.$store.commit('mapping/SET_AVAILABLE_FIELDS', fields)

      this.previewData = data

      this.$message.success(`数据已应用，共 ${data.length} 条记录`)
    },
    loadExample() {
      this.columns = [
        { name: '月份', type: 'string' },
        { name: '销售额', type: 'number' },
        { name: '利润', type: 'number' }
      ]
      this.rows = [
        { values: ['1月', 1200, 300] },
        { values: ['2月', 1500, 400] },
        { values: ['3月', 1800, 500] },
        { values: ['4月', 2000, 600] },
        { values: ['5月', 2200, 700] },
        { values: ['6月', 2500, 800] }
      ]
      this.$message.success('示例数据已加载')
    },
    clearAll() {
      this.columns = [
        { name: '列1', type: 'string' },
        { name: '列2', type: 'number' }
      ]
      this.rows = [
        { values: ['', 0] },
        { values: ['', 0] }
      ]
      this.previewData = []
      this.$message.success('已清空')
    }
  }
}
</script>

<style scoped>
.manual-input {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.columns-section,
.rows-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--td-brand-color);
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.columns-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.column-item {
  display: grid;
  grid-template-columns: 1fr 120px auto;
  gap: 8px;
  align-items: center;
  padding: 8px;
  background: var(--td-bg-color-container);
  border: 1px solid var(--td-component-border);
  border-radius: var(--td-radius-default);
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid var(--td-component-border);
  border-radius: var(--td-radius-default);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--td-bg-color-container);
}

.data-table th,
.data-table td {
  padding: 8px 12px;
  border: 1px solid var(--td-component-border);
  text-align: left;
}

.data-table th {
  background: var(--td-bg-color-page);
  font-weight: 600;
  font-size: 13px;
  color: var(--td-text-color-primary);
  white-space: nowrap;
}

.data-table td {
  font-size: 13px;
}

.action-column {
  width: 80px;
  text-align: center;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid var(--td-component-border);
}

.preview-section {
  margin-top: 8px;
}

.preview-header {
  font-size: 14px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--td-brand-color);
}

.preview-json {
  padding: 12px;
  background: var(--td-bg-color-page);
  border: 1px solid var(--td-component-border);
  border-radius: var(--td-radius-default);
  max-height: 300px;
  overflow: auto;
}

.preview-json pre {
  margin: 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  color: var(--td-text-color-primary);
}
</style>
