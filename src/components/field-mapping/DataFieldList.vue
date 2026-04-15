<template>
  <div class="data-field-list">
    <draggable
      :list="fields"
      :group="{ name: 'fields', pull: 'clone', put: false }"
      :clone="cloneField"
      :sort="false"
      class="field-items"
    >
      <div
        v-for="field in fields"
        :key="field.name"
        class="field-item"
      >
        <drag-icon class="drag-handle" />
        <span class="field-name">{{ field.name }}</span>
        <t-tag size="small" :theme="getTypeTheme(field.type)" variant="light">
          {{ field.type }}
        </t-tag>
      </div>
    </draggable>
  </div>
</template>

<script>
import { DragIcon } from 'tdesign-icons-vue'
import draggable from 'vuedraggable'

export default {
  name: 'DataFieldList',
  components: {
    DragIcon,
    draggable
  },
  props: {
    fields: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    cloneField(field) {
      return { ...field, id: Date.now() + Math.random() }
    },
    getTypeTheme(type) {
      const themeMap = {
        number: 'success',
        string: 'default',
        date: 'warning'
      }
      return themeMap[type] || 'default'
    }
  }
}
</script>

<style scoped>
.data-field-list {
  min-height: 100px;
}

.field-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--td-bg-color-container);
  border: 1px solid var(--td-component-border);
  border-radius: var(--td-radius-default);
  cursor: move;
  transition: all 0.2s cubic-bezier(0.38, 0, 0.24, 1);
}

.field-item:hover {
  background: var(--td-brand-color-light);
  border-color: var(--td-brand-color);
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 82, 217, 0.15);
}

.drag-handle {
  color: var(--td-text-color-placeholder);
  font-size: 16px;
  flex-shrink: 0;
}

.field-name {
  flex: 1;
  font-size: 13px;
  color: var(--td-text-color-primary);
  font-weight: 500;
}

.sortable-ghost {
  opacity: 0.5;
  background: var(--td-brand-color-light);
  border-color: var(--td-brand-color);
}
</style>
