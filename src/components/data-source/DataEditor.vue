<template>
  <div class="data-editor">
    <t-alert theme="info" :close="false" style="margin-bottom: 16px;">
      <template #icon><help-circle-icon /></template>
      编辑数据表格，支持添加/删除行列，数据格式：[{"月份": "1月", "销售额": 1200}, ...]
    </t-alert>

    <!-- 工具栏 -->
    <div class="toolbar">
      <t-space :size="8">
        <t-button size="small" variant="outline" @click="addColumn">
          <template #icon><add-icon /></template>
          添加列
        </t-button>
        <t-button size="small" variant="outline" @click="addRow">
          <template #icon><add-icon /></template>
          添加行
        </t-button>
        <t-button size="small" theme="primary" @click="applyData">
          <template #icon><check-icon /></template>
          应用数据
        </t-button>
        <t-button size="small" variant="outline" @click="importJSON">
          <template #icon><file-icon /></template>
          导入JSON
        </t-button>
      </t-space>
    </div>

    <!-- 数据表格 -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="(col, colIndex) in columns" :key="colIndex" class="column-header">
              <div class="header-content">
                <t-input
                  v-model="col.name"
                  size="small"
                  placeholder="列名"
                  class="column-name-input"
                />
                <t-select
                  v-model="col.type"
                  size="small"
                  class="column-type-select"
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

    <!-- JSON 导入对话框 -->
    <t-dialog
      :visible.sync="jsonDialogVisible"
      header="导入 JSON 数据"
      width="600px"
      @confirm="confirmImportJSON"
    >
      <t-textarea
        v-model="jsonInput"
        placeholder='粘贴 JSON 数据，例如：
[
  {"月份": "1月", "销售额": 1200, "利润": 300},
  {"月份": "2月", "销售额": 1500, "利润": 400}
]'
        :autosize="{ minRows: 10, maxRows: 20 }"
        style="font-family: monospace;"
      />
    </t-dialog>
  </div>
</template>

<script>
import { AddIcon, CheckIcon, DeleteIcon, FileIcon, HelpCircleIcon } from 'tdesign-icons-vue'
import { detectFields } from '@/utils/dataParser'

export default {
  name: 'DataEditor',
  components: {
    AddIcon,
    CheckIcon,
    DeleteIcon,
    FileIcon,
    HelpCircleIcon
  },
  props: {
    initialData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns: [
        { name: '月份', type: 'string' },
        { name: '销售额', type: 'number' },
        { name: '利润', type: 'number' }
      ],
      rows: [
        { values: ['1月', 1200, 300] },
        { values: ['2月', 1500, 400] },
        { values: ['3月', 1800, 500] }
      ],
      jsonDialogVisible: false,
      jsonInput: ''
    }
  },
  watch: {
    initialData: {
      handler(data) {
        if (data && data.length > 0) {
          this.loadFromData(data)
        }
      },
      immediate: true
    }
  },
  methods: {
    addColumn() {
      const newColName = `列${this.columns.length + 1}`
      this.columns.push({ name: newColName, type: 'string' })
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
      const columnNames = this.columns.map(col => col.name.trim()).filter(name => name)
      if (columnNames.length !== this.columns.length) {
        this.$message.warning('请为所有列设置名称')
        return
      }

      const uniqueNames = new Set(columnNames)
      if (uniqueNames.size !== columnNames.length) {
        this.$message.warning('列名不能重复')
        return
      }

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

      this.$message.success(`数据已应用，共 ${data.length} 条记录`)
    },
    importJSON() {
      this.jsonDialogVisible = true
    },
    confirmImportJSON() {
      if (!this.jsonInput.trim()) {
        this.$message.warning('请输入 JSON 数据')
        return
      }

      try {
        const data = JSON.parse(this.jsonInput)

        if (!Array.isArray(data)) {
          this.$message.error('数据格式错误：必须是数组格式')
          return
        }

        if (data.length === 0) {
          this.$message.warning('数据不能为空')
          return
        }

        if (typeof data[0] !== 'object') {
          this.$message.error('数据格式错误：数组元素必须是对象')
          return
        }

        this.loadFromData(data)
        this.jsonDialogVisible = false
        this.jsonInput = ''
        this.$message.success('JSON 数据导入成功')
      } catch (error) {
        this.$message.error('JSON 格式错误：' + error.message)
      }
    },
    loadFromData(data) {
      if (!data || data.length === 0) return

      const firstRow = data[0]
      const keys = Object.keys(firstRow)

      this.columns = keys.map(key => ({
        name: key,
        type: typeof firstRow[key] === 'number' ? 'number' : 'string'
      }))

      this.rows = data.map(item => ({
        values: keys.map(key => item[key])
      }))
    }
  }
}
</script>

<style scoped>
.data-editor {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
}

.table-wrapper {
  flex: 1;
  overflow: auto;
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
  padding: 8px;
  border: 1px solid var(--td-component-border);
  text-align: left;
}

.data-table th {
  background: var(--td-bg-color-page);
  font-weight: 600;
  font-size: 13px;
  color: var(--td-text-color-primary);
}

.column-header {
  min-width: 200px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.column-name-input {
  flex: 1;
  min-width: 80px;
}

.column-type-select {
  width: 80px;
}

.data-table td {
  font-size: 13px;
  min-width: 120px;
}

.action-column {
  width: 60px;
  text-align: center;
}
</style>
