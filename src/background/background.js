// Background script can be minimal for this extension
chrome.runtime.onInstalled.addListener(() => {
  // Set default profile on installation
  chrome.storage.local.get(['profileData'], (result) => {
    if (!result.profileData) {
      const defaultProfile = {
        name: '',
        email: '',
        phone: '',
        resumeUrl: '',
        linkedin: '',
        github: '',
        experience: [],
        education: []
      }
      chrome.storage.local.set({ profileData: defaultProfile })
    }
  })
})