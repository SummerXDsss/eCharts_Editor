<template>
  <div class="manual-input">
    <div class="toolbar">
      <t-space :size="8">
        <t-button size="small" variant="outline" @click="addRow">
          <template #icon><add-icon /></template>
          添加行
        </t-button>
        <t-button size="small" variant="outline" @click="addColumn">
          <template #icon><add-icon /></template>
          添加列
        </t-button>
        <t-button size="small" theme="primary" @click="applyData">
          <template #icon><check-icon /></template>
          应用数据
        </t-button>
      </t-space>
    </div>

    <div class="table-container">
      <t-table
        :data="tableData"
        :columns="tableColumns"
        bordered
        size="small"
        max-height="400"
        row-key="index"
      >
        <template #operation="{ rowIndex }">
          <t-button
            theme="danger"
            variant="text"
            size="small"
            @click="deleteRow(rowIndex)"
          >
            <template #icon><delete-icon /></template>
          </t-button>
        </template>
      </t-table>
    </div>
  </div>
</template>

<script>
import { AddIcon, CheckIcon, DeleteIcon } from 'tdesign-icons-vue'
import { detectFields } from '@/utils/dataParser'

export default {
  name: 'ManualInput',
  components: {
    AddIcon,
    CheckIcon,
    DeleteIcon
  },
  data() {
    return {
      columns: ['列1', '列2', '列3'],
      tableData: [
        { index: 0, '列1': '', '列2': '', '列3': '' },
        { index: 1, '列1': '', '列2': '', '列3': '' }
      ]
    }
  },
  computed: {
    tableColumns() {
      const cols = this.columns.map(col => ({
        colKey: col,
        title: col,
        edit: {
          component: 'input',
          props: {
            clearable: true,
            placeholder: '输入值'
          },
          on: (editContext) => {
            this.tableData[editContext.rowIndex][col] = editContext.value
          }
        }
      }))

      cols.push({
        colKey: 'operation',
        title: '操作',
        width: 80,
        fixed: 'right'
      })

      return cols
    }
  },
  methods: {
    addRow() {
      const newRow = { index: this.tableData.length }
      this.columns.forEach(col => {
        newRow[col] = ''
      })
      this.tableData.push(newRow)
    },
    addColumn() {
      const newColName = `列${this.columns.length + 1}`
      this.columns.push(newColName)
      this.tableData.forEach(row => {
        row[newColName] = ''
      })
    },
    deleteRow(index) {
      this.tableData.splice(index, 1)
      this.tableData.forEach((row, idx) => {
        row.index = idx
      })
    },
    applyData() {
      const validData = this.tableData.map(row => {
        const data = {}
        this.columns.forEach(col => {
          data[col] = row[col]
        })
        return data
      }).filter(row => {
        return Object.values(row).some(val => val !== '')
      })

      if (validData.length === 0) {
        this.$message.warning('请输入数据')
        return
      }

      const fields = detectFields(validData)

      this.$store.dispatch('data/updateDataSource', {
        type: 'manual',
        data: validData,
        fields
      })

      this.$store.commit('mapping/SET_AVAILABLE_FIELDS', fields)
      this.$message.success('数据已应用')
    }
  }
}
</script>

<style scoped>
.manual-input {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
}

.table-container {
  overflow: auto;
}
</style>
