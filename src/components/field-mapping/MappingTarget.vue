<template>
  <div class="mapping-target">
    <div class="target-header">
      <span class="target-label">{{ rule.label }}</span>
      <t-space :size="4">
        <t-tag v-if="rule.required" size="small" theme="danger" variant="light">必填</t-tag>
        <t-tag v-if="rule.multiple" size="small" theme="primary" variant="light">多个</t-tag>
      </t-space>
    </div>

    <draggable
      :list="localMappedFields"
      :group="{ name: 'fields', pull: false, put: canPut }"
      class="drop-zone"
      :class="{ 'has-items': localMappedFields.length > 0, 'is-error': !!error }"
      @change="handleChange"
    >
      <div
        v-for="field in localMappedFields"
        :key="field.id"
        class="mapped-field"
      >
        <span>{{ field.name }}</span>
        <close-icon class="remove-icon" @click="removeField(field)" />
      </div>

      <div v-if="localMappedFields.length === 0" class="drop-placeholder">
        <add-icon class="placeholder-icon" />
        <span>拖拽字段到此处</span>
      </div>
    </draggable>

    <t-alert v-if="error" theme="error" :message="error" class="error-alert" />
  </div>
</template>

<script>
import { AddIcon, CloseIcon } from 'tdesign-icons-vue'
import draggable from 'vuedraggable'
import { validateFieldMapping } from '@/utils/fieldMapper'

export default {
  name: 'MappingTarget',
  components: {
    AddIcon,
    CloseIcon,
    draggable
  },
  props: {
    targetKey: {
      type: String,
      required: true
    },
    rule: {
      type: Object,
      required: true
    },
    mappedFields: {
      type: [Array, String, Object],
      default: null
    }
  },
  data() {
    return {
      localMappedFields: [],
      error: ''
    }
  },
  watch: {
    mappedFields: {
      handler(val) {
        if (!val) {
          this.localMappedFields = []
        } else if (Array.isArray(val)) {
          this.localMappedFields = val
        } else {
          this.localMappedFields = [val]
        }
      },
      immediate: true
    }
  },
  methods: {
    canPut(to, from, dragEl, event) {
      if (!this.rule.multiple && this.localMappedFields.length >= 1) {
        return false
      }
      return true
    },
    handleChange(evt) {
      if (evt.added) {
        const field = evt.added.element
        const validation = validateFieldMapping(field, this.rule, this.localMappedFields)

        if (!validation.valid) {
          this.error = validation.error
          this.localMappedFields = this.localMappedFields.filter(f => f.id !== field.id)
          this.$message.warning(validation.error)
          return
        }

        this.error = ''
      }

      this.updateMapping()
    },
    removeField(field) {
      this.localMappedFields = this.localMappedFields.filter(f => f.id !== field.id)
      this.updateMapping()
    },
    updateMapping() {
      let value
      if (this.rule.multiple) {
        value = this.localMappedFields.map(f => f.name)
      } else {
        value = this.localMappedFields.length > 0 ? this.localMappedFields[0].name : null
      }

      this.$store.dispatch('mapping/updateMapping', {
        key: this.targetKey,
        value
      })
    }
  }
}
</script>

<style scoped>
.mapping-target {
  padding: 12px;
  background: var(--td-bg-color-container);
  border: 1px solid var(--td-component-border);
  border-radius: var(--td-radius-default);
  transition: all 0.2s;
}

.mapping-target:hover {
  border-color: var(--td-brand-color-light);
}

.target-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.target-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.drop-zone {
  min-height: 64px;
  padding: 8px;
  background: var(--td-bg-color-page);
  border: 2px dashed var(--td-component-border);
  border-radius: var(--td-radius-default);
  transition: all 0.2s cubic-bezier(0.38, 0, 0.24, 1);
}

.drop-zone:hover {
  border-color: var(--td-brand-color-light);
  background: var(--td-brand-color-light);
}

.drop-zone.has-items {
  background: var(--td-bg-color-container);
  border-style: solid;
  border-color: var(--td-brand-color);
}

.drop-zone.is-error {
  border-color: var(--td-error-color);
  background: var(--td-error-color-1);
}

.drop-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: var(--td-text-color-placeholder);
  font-size: 12px;
}

.placeholder-icon {
  font-size: 28px;
  margin-bottom: 6px;
}

.mapped-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin-bottom: 6px;
  background: var(--td-brand-color-light);
  border: 1px solid var(--td-brand-color);
  border-radius: var(--td-radius-default);
  font-size: 13px;
  color: var(--td-brand-color);
  font-weight: 500;
  transition: all 0.2s;
}

.mapped-field:last-child {
  margin-bottom: 0;
}

.mapped-field:hover {
  background: var(--td-brand-color);
  color: #fff;
}

.remove-icon {
  cursor: pointer;
  font-size: 14px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.remove-icon:hover {
  opacity: 1;
}

.error-alert {
  margin-top: 8px;
}
</style>
