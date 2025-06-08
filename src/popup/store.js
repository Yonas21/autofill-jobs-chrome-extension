export const store = {
  profileData: {},
  settings: {},

  async load() {
    const data = await chrome.storage.local.get(['profileData', 'settings'])
    this.profileData = data.profileData || {}
    this.settings = data.settings || {}
  },

  async save() {
    await chrome.storage.local.set({
      profileData: this.profileData,
      settings: this.settings
    })
  }
}

// Initialize
store.load()