<template>
  <div class="settings-panel">
    <h2>Extension Settings</h2>
    
    <div class="setting-item">
      <label>
        <input type="checkbox" v-model="settings.autoFill">
        Auto-fill forms on page load
      </label>
    </div>
    
    <div class="setting-item">
      <label>
        <input type="checkbox" v-model="settings.confirmBeforeSubmit">
        Confirm before submitting
      </label>
    </div>
    
    <div class="setting-item">
      <label>
        <input type="checkbox" v-model="settings.highlightFilledFields">
        Highlight filled fields
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  emits: ['update']
}
</script>

<style scoped>
.settings-panel {
  padding: 10px;
}
.setting-item {
  margin: 10px 0;
}
.setting-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
</style>