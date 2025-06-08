<template>
  <div class="popup-container">
    <h1>Job Application Auto-Filler</h1>
    
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="{ active: activeTab === tab.id }"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <div v-if="activeTab === 'profile'">
      <ProfileEditor 
        v-model:profile="profileData" 
        @save="saveProfile"
      />
    </div>
    
    <div v-else-if="activeTab === 'settings'">
      <SettingsPanel 
        :settings="settings" 
        @update="updateSettings"
      />
    </div>
    
    <button class="fill-btn" @click="fillCurrentForm">
      Fill Current Form
    </button>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import ProfileEditor from './components/ProfileEditor.vue'
import SettingsPanel from './components/SettingsPanel.vue'

export default {
  components: { ProfileEditor, SettingsPanel },
  setup() {
    const tabs = [
      { id: 'profile', label: 'Profile' },
      { id: 'settings', label: 'Settings' }
    ]
    const activeTab = ref('profile')
    
    const profileData = ref({
      name: '',
      email: '',
      phone: '',
      resumeUrl: '',
      linkedin: '',
      github: '',
      experience: [{ title: '', company: '', duration: '', description: '' }],
      education: [{ degree: '', school: '', year: '' }],
      skills: []
    })
    
    const settings = reactive({
      autoFill: true,
      confirmBeforeSubmit: true,
      highlightFilledFields: true
    })
    
    const loadProfile = async () => {
      const data = await chrome.storage.local.get(['profileData', 'settings'])
      if (data.profileData) profileData.value = data.profileData
      if (data.settings) Object.assign(settings, data.settings)
    }
    
    const saveProfile = async () => {
      await chrome.storage.local.set({ 
        profileData: profileData.value,
        settings 
      })
    }
    
    const fillCurrentForm = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'fillForm',
          profile: profileData.value,
          settings 
        })
      })
    }
    
    loadProfile()
    
    return { 
      tabs, 
      activeTab, 
      profileData, 
      settings, 
      saveProfile, 
      fillCurrentForm 
    }
  }
}
</script>

<style>
.popup-container {
  width: 400px;
  padding: 16px;
  font-family: Arial, sans-serif;
}

.tabs {
  display: flex;
  margin-bottom: 16px;
  border-bottom: 1px solid #ddd;
}

.tabs button {
  padding: 8px 16px;
  background: none;
  border: none;
  cursor: pointer;
}

.tabs button.active {
  border-bottom: 2px solid #42b983;
  font-weight: bold;
}

.fill-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.fill-btn:hover {
  background-color: #3aa876;
}
</style>