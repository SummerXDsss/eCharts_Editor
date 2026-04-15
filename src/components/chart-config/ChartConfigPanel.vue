<template>
  <div class="chart-config-panel">
    <div class="panel-header">
      <setting-icon />
      <span>图表配置</span>
    </div>
    <div class="config-content">
      <t-form label-width="80px" label-align="left">
        <t-form-item label="标题">
          <t-input
            v-model="config.title"
            placeholder="请输入图表标题"
            @change="updateConfig"
          />
        </t-form-item>

        <t-form-item label="副标题">
          <t-input
            v-model="config.subTitle"
            placeholder="请输入副标题"
            @change="updateConfig"
          />
        </t-form-item>

        <t-form-item label="显示图例">
          <t-switch v-model="config.showLegend" @change="updateConfig" />
        </t-form-item>

        <t-form-item label="显示提示">
          <t-switch v-model="config.showTooltip" @change="updateConfig" />
        </t-form-item>

        <t-form-item label="显示网格">
          <t-switch v-model="config.showGrid" @change="updateConfig" />
        </t-form-item>
      </t-form>
    </div>
  </div>
</template>

<script>
import { SettingIcon } from 'tdesign-icons-vue'
import { mapState } from 'vuex'

export default {
  name: 'ChartConfigPanel',
  components: {
    SettingIcon
  },
  data() {
    return {
      config: {
        title: '',
        subTitle: '',
        showLegend: true,
        showTooltip: true,
        showGrid: true
      }
    }
  },
  computed: {
    ...mapState('chart', ['customConfig'])
  },
  watch: {
    customConfig: {
      handler(val) {
        this.config = { ...this.config, ...val }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    updateConfig() {
      this.$store.dispatch('chart/updateCustomConfig', this.config)
    }
  }
}
</script>

<style scoped>
.chart-config-panel {
  padding: 16px;
  border-bottom: 1px solid var(--td-component-border);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin-bottom: 16px;
}

.panel-header :deep(.t-icon) {
  font-size: 18px;
  color: var(--td-brand-color);
}

.config-content {
  max-height: 400px;
  overflow-y: auto;
}
</style>
