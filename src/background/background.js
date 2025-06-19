// Background script can be minimal for this extension
chrome.runtime.onInstalled.addListener(() => {
  // Set default profile on installation
  chrome.storage.local.get(['profileData'], (result) => {
    if (!result.profileData) {
      const defaultProfile = {
        name: '',
        email: '',
        phone: '',
        location: '',
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

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === 'showUploadNotification') {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Resume Upload Required',
        message: `Please manually upload your resume file: ${request.filename}`
      });
    }
  }
);
