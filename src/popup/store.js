import { parseWithGemini } from '../services/index';
// src/popup/store.js
export const store = {
  // Initial state with all fields
  profileData: {
    name: '',
    email: '',
    phone: '',
    location: '',
    resumeUrl: '',
    linkedin: '',
    github: '',
    experience: [],
    resume: null // This will hold our resume data
  },

  // Load data from Chrome storage
  async load() {
    try {
      const result = await chrome.storage.local.get(['profileData']);
      if (result.profileData) {
        // Convert base64 resume back to usable format
        if (result.profileData.resume?.base64Content) {
          this.profileData.resume = {
            name: result.profileData.resume.name,
            type: result.profileData.resume.type,
            size: result.profileData.resume.size,
            lastModified: result.profileData.resume.lastModified || Date.now(),
            content: this.base64ToArrayBuffer(result.profileData.resume.base64Content)
          };
        }
        // Merge other profile data
        this.profileData = { 
          ...this.profileData,
          ...result.profileData,
          resume: this.profileData.resume // Preserve converted resume
        };
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  },

  // Save data to Chrome storage
  async save() {
    try {
      // Convert resume to storable format
      const saveData = {
        ...this.profileData,
        resume: this.profileData.resume ? {
          name: this.profileData.resume.name,
          type: this.profileData.resume.type,
          size: this.profileData.resume.size,
          lastModified: this.profileData.resume.lastModified,
          base64Content: this.arrayBufferToBase64(this.profileData.resume.content)
        } : null
      };

      await chrome.storage.local.set({ profileData: saveData });
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  },

  // Helper methods for file conversion
  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    return btoa(bytes.reduce((data, byte) => data + String.fromCharCode(byte), ''));
  },

  base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  },
  async extractTextFromResume(arrayBuffer) {
    // Simple text extraction (you'll need proper PDF/DOCX parsers)
    if (this.profileData.resume.type.includes('pdf')) {
      // Mock PDF extraction - use pdf-lib or similar in production
      return "PDF CONTENT EXTRACTED";
    } else if (this.profileData.resume.type.includes('word') || 
               this.profileData.resume.type.includes('document')) {
      // Mock DOCX extraction
      return "DOCX CONTENT EXTRACTED";
    }
    return new TextDecoder().decode(arrayBuffer);
  },

    async processResumeWithAI() {
    try {
      const text = await this.extractTextFromResume(this.profileData.resume.content);
      
      // Try Gemini first, fallback to ChatGPT
      let result = await parseWithGemini(text);
      if (!result) {
        console.warn("Gemini processing failed, trying ChatGPT...");
        // Fallback to ChatGPT processing (assuming you have a similar function for ChatGPT)
        // result = await parseWithChatGPT(text);
      }
      // Merge results with existing profile
      this.profileData = {
        ...this.profileData,
        name: result.name || this.profileData.name,
        email: result.email || this.profileData.email,
        phone: result.phone || this.profileData.phone,
        experience: result.experience || this.profileData.experience,
        skills: result.skills || []
      };
      
      await this.save();
      return result;
    } catch (error) {
      console.error("AI Processing Error:", error);
      return null;
    }
  }
};

// Initialize store when loaded
store.load();