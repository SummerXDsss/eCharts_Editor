<template>
  <div class="home">
    <app-header @export="handleExport" @preview="handlePreview" />
    <workspace ref="workspace" />
  </div>
</template>

<script>
import AppHeader from '@/components/layout/Header.vue'
import Workspace from '@/components/layout/Workspace.vue'

export default {
  name: 'Home',
  components: {
    AppHeader,
    Workspace
  },
  methods: {
    handleExport() {
      this.$refs.workspace?.showExportDialog()
    },
    handlePreview() {
      this.$refs.workspace?.showPreview()
    }
  }
}
</script>

<style scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
