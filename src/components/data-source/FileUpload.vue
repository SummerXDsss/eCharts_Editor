<template>
  <div class="file-upload">
    <t-upload
      v-model="files"
      theme="file-flow"
      :auto-upload="false"
      :on-change="handleFileChange"
      accept=".csv,.json"
      :max="1"
      draggable
    >
      <template #drag-content>
        <div class="upload-content">
          <cloud-upload-icon class="upload-icon" />
          <div class="upload-text">
            <div class="main-text">点击或拖拽文件到此处上传</div>
            <div class="sub-text">支持 CSV 和 JSON 格式文件</div>
          </div>
        </div>
      </template>
    </t-upload>

    <div v-if="previewData.length > 0" class="preview">
      <div class="preview-header">数据预览</div>
      <t-table
        :data="previewData.slice(0, 5)"
        :columns="previewColumns"
        bordered
        size="small"
        max-height="300"
      />
      <div class="preview-footer">
        共 {{ previewData.length }} 条数据
      </div>
    </div>
  </div>
</template>

<script>
import { CloudUploadIcon } from 'tdesign-icons-vue'
import { parseCSV, parseJSON } from '@/utils/dataParser'

export default {
  name: 'FileUpload',
  components: {
    CloudUploadIcon
  },
  data() {
    return {
      files: [],
      previewData: [],
      fields: []
    }
  },
  computed: {
    previewColumns() {
      return this.fields.map(field => ({
        colKey: field.name,
        title: `${field.name} (${field.type})`,
        ellipsis: true
      }))
    }
  },
  methods: {
    async handleFileChange(files) {
      if (!files || files.length === 0) return

      const file = files[0]
      const fileType = file.name.split('.').pop().toLowerCase()

      try {
        let result
        if (fileType === 'csv') {
          result = await parseCSV(file.raw)
        } else if (fileType === 'json') {
          result = await parseJSON(file.raw)
        } else {
          this.$message.error('不支持的文件格式')
          return
        }

        this.previewData = result.data
        this.fields = result.fields

        this.$store.dispatch('data/updateDataSource', {
          type: 'file',
          data: result.data,
          fields: result.fields
        })

        this.$store.commit('mapping/SET_AVAILABLE_FIELDS', result.fields)
        this.$message.success('文件解析成功')
      } catch (error) {
        this.$message.error('文件解析失败: ' + error.message)
      }
    }
  }
}
</script>

<style scoped>
.file-upload {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
}

.upload-icon {
  font-size: 48px;
  color: var(--td-brand-color);
  margin-bottom: 16px;
}

.upload-text {
  text-align: center;
}

.main-text {
  font-size: 14px;
  color: var(--td-text-color-primary);
  margin-bottom: 4px;
}

.sub-text {
  font-size: 12px;
  color: var(--td-text-color-placeholder);
}

.preview {
  margin-top: 16px;
}

.preview-header {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--td-text-color-primary);
}

.preview-footer {
  margin-top: 12px;
  font-size: 12px;
  color: var(--td-text-color-secondary);
  text-align: right;
}
</style>
