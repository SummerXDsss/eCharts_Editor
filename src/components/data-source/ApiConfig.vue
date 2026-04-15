<template>
  <div class="api-config">
    <t-form label-width="80px" label-align="left">
      <t-form-item label="API URL">
        <t-input
          v-model="apiConfig.url"
          placeholder="https://api.example.com/data"
        />
      </t-form-item>

      <t-form-item label="请求方法">
        <t-select v-model="apiConfig.method" style="width: 100%">
          <t-option value="GET" label="GET" />
          <t-option value="POST" label="POST" />
        </t-select>
      </t-form-item>

      <t-form-item label="请求头">
        <t-textarea
          v-model="headersText"
          :autosize="{ minRows: 3, maxRows: 5 }"
          placeholder='{"Content-Type": "application/json"}'
        />
      </t-form-item>

      <t-form-item label="请求参数">
        <t-textarea
          v-model="paramsText"
          :autosize="{ minRows: 3, maxRows: 5 }"
          placeholder='{"key": "value"}'
        />
      </t-form-item>

      <t-form-item>
        <t-button
          theme="primary"
          :loading="loading"
          @click="fetchData"
        >
          <template #icon><refresh-icon /></template>
          获取数据
        </t-button>
      </t-form-item>
    </t-form>

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
import { RefreshIcon } from 'tdesign-icons-vue'
import axios from 'axios'
import { detectFields } from '@/utils/dataParser'

export default {
  name: 'ApiConfig',
  components: {
    RefreshIcon
  },
  data() {
    return {
      apiConfig: {
        url: '',
        method: 'GET',
        headers: {},
        params: {}
      },
      headersText: '',
      paramsText: '',
      loading: false,
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
    async fetchData() {
      if (!this.apiConfig.url) {
        this.$message.warning('请输入 API URL')
        return
      }

      try {
        if (this.headersText) {
          this.apiConfig.headers = JSON.parse(this.headersText)
        }
        if (this.paramsText) {
          this.apiConfig.params = JSON.parse(this.paramsText)
        }
      } catch (error) {
        this.$message.error('请求头或参数格式错误，请使用 JSON 格式')
        return
      }

      this.loading = true

      try {
        const response = await axios({
          url: this.apiConfig.url,
          method: this.apiConfig.method,
          headers: this.apiConfig.headers,
          params: this.apiConfig.method === 'GET' ? this.apiConfig.params : undefined,
          data: this.apiConfig.method === 'POST' ? this.apiConfig.params : undefined
        })

        let data = response.data

        if (!Array.isArray(data)) {
          if (data.data && Array.isArray(data.data)) {
            data = data.data
          } else if (data.list && Array.isArray(data.list)) {
            data = data.list
          } else {
            data = [data]
          }
        }

        this.previewData = data
        this.fields = detectFields(data)

        this.$store.dispatch('data/updateDataSource', {
          type: 'api',
          data: data,
          fields: this.fields
        })

        this.$store.commit('mapping/SET_AVAILABLE_FIELDS', this.fields)
        this.$message.success('数据获取成功')
      } catch (error) {
        this.$message.error('数据获取失败: ' + error.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.api-config {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
