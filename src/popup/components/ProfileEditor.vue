<template>
  <div class="profile-editor">
    <h2>Personal Information</h2>
     <div v-if="isLoading" class="loading-state">
      Loading your profile...
    </div>
     <div v-if="error" class="error-state">
      {{ error }}
    </div>
    <div class="form-group">
      <label>Full Name</label>
      <input v-model="profile.name" type="text">
    </div>
    
    <div class="form-group">
      <label>Email</label>
      <input v-model="profile.email" type="email">
    </div>
    
    <div class="form-group">
      <label>Phone</label>
      <input v-model="profile.phone" type="tel">
    </div>
    <div class="form-group">
      <label>Location</label>
      <input v-model="profile.location" type="text">
    </div>

    <div class="form-group">
      <label>Resume Upload</label>
      <input 
        type="file" 
        ref="resumeInput"
        accept=".pdf,.doc,.docx,.txt"
        @change="handleResumeUpload"
      >
      <div v-if="resumeFile" class="upload-status success">
        ✔ Uploaded: {{ resumeFile.name }} ({{ formatFileSize(resumeFile.size) }})
        <button @click="removeResume">Remove</button>
      </div>
      
      <div v-if="error" class="upload-status error">
        {{ error }}
      </div>
    </div>

      <div class="ai-processing">
    <button @click="parseResume" :disabled="isParsing">
      {{ isParsing ? 'Parsing with AI...' : 'Extract Info with AI' }}
    </button>
    
    <div v-if="aiResult" class="ai-result">
      <h4>AI Extracted:</h4>
      <div>Name: {{ aiResult.name }}</div>
      <div>Email: {{ aiResult.email }}</div>
      <div v-for="(exp, i) in aiResult.experience" :key="i">
        Experience: {{ exp.title }} at {{ exp.company }}
      </div>
    </div>
  </div>
    
    <h2>Professional Links</h2>
    <div class="form-group">
      <label>Resume URL</label>
      <input v-model="profile.resumeUrl" type="url">
    </div>
    
    <div class="form-group">
      <label>LinkedIn</label>
      <input v-model="profile.linkedin" type="url">
    </div>
    
    <div class="form-group">
      <label>GitHub/Portfolio</label>
      <input v-model="profile.github" type="url">
    </div>
    
    <h2>Experience</h2>
    <div v-for="(exp, index) in profile.experience" :key="index" class="experience-item">
      <div class="form-group">
        <label>Job Title</label>
        <input v-model="exp.title" type="text">
      </div>
      <div class="form-group">
        <label>Company</label>
        <input v-model="exp.company" type="text">
      </div>
      <div class="form-group">
        <label>Duration</label>
        <input v-model="exp.duration" type="text">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea v-model="exp.description"></textarea>
      </div>
      <button @click="removeExperience(index)" class="remove-btn">Remove</button>
    </div>
    <button @click="addExperience" class="add-btn">Add Experience</button>
    
    <button @click="$emit('save')" class="save-btn">Save Profile</button>
  </div>
</template>

<script>
export default {
  inject: ['store'],
  props: {
    profile: {
      type: Object,
      required: true,
      default: () => ({
        name: '',
        email: '',
        phone: '',
        location: '',
        resumeUrl: '',
        linkedin: '',
        github: '',
        experience: []
      })
    }
  },
  emits: ['save'],
  data() {
    return {
      isLoading: false,
      error: null,
      uploadMessage: '',
      uploadStatus: '',
      isParsing: false,
      aiResult: null

    };
  },
  computed: {
    resumeFile() {
      // Always show resume from store if it exists
      return this.store.profileData.resume 
        ? {
            name: this.store.profileData.resume.name,
            size: this.store.profileData.resume.size,
            type: this.store.profileData.resume.type
          }
        : null;
    }
  },
  async created() {
    await this.loadProfileData();
  },
  methods: {
    async loadProfileData() {
      this.isLoading = true;
      try {
        await this.store.load();
        if (this.store.profileData.resume) {
          this.showMessage('success', 'Resume loaded');
        }
      } catch (err) {
        this.showMessage('error', 'Failed to load profile data');
      } finally {
        this.isLoading = false;
      }
    },

    async parseResume() {
      this.isParsing = true;
      try {
        this.aiResult = await this.store.processResumeWithAI();
        this.showMessage('success', 'AI parsing completed');
      } catch (error) {
        this.showMessage('error', 'AI parsing failed');
      } finally {
        this.isParsing = false;
      }
    },


    async handleResumeUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.isLoading = true;
      this.error = null;
      
      try {
        // Validate file
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('File must be smaller than 5MB');
        }

        // Read file
        const arrayBuffer = await this.readFile(file);
        
        // Update store
        this.store.profileData.resume = {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          content: arrayBuffer
        };

        // Save to storage
        await this.store.save();
        this.showMessage('success', 'Resume uploaded successfully');
        this.$emit('save');
      } catch (error) {
        console.error('Upload failed:', error);
        this.showMessage('error', error.message || 'Failed to upload resume');
        this.$refs.resumeInput.value = '';
      } finally {
        this.isLoading = false;
      }
    },
    async parseResume() {
      this.isParsing = true;
      this.parseResult = null;
      
      try {
        const result = await this.store.processResumeWithAI();
        if (result) {
          this.parseResult = "Found: " + 
            [result.name, result.email, result.phone].filter(Boolean).join(", ");
          this.showMessage('success', 'Resume parsed successfully');
          this.$emit('save');
        }
      } catch (error) {
        this.showMessage('error', 'Failed to parse resume');
      } finally {
        this.isParsing = false;
      }
    },

    async removeResume() {
      this.isLoading = true;
      try {
        this.store.profileData.resume = null;
        await this.store.save();
        this.$refs.resumeInput.value = '';
        this.showMessage('info', 'Resume removed');
        this.$emit('save');
      } catch (error) {
        console.error('Failed to remove resume:', error);
        this.showMessage('error', 'Failed to remove resume');
      } finally {
        this.isLoading = false;
      }
    },

    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
      });
    },

    showMessage(type, message) {
      this.uploadStatus = type;
      this.uploadMessage = message;
      setTimeout(() => {
        this.uploadMessage = '';
      }, 3000);
    },

    formatFileSize(bytes) {
      if (!bytes) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    addExperience() {
      if (!Array.isArray(this.profile.experience)) {
        this.profile.experience = [];
      }
      this.profile.experience.push({
        title: '',
        company: '',
        duration: '',
        description: ''
      });
    },
    
    removeExperience(index) {
      if (Array.isArray(this.profile.experience)) {
        this.profile.experience.splice(index, 1);
      }
    }
  }
};
</script>

<style scoped>
.profile-editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-weight: bold;
  font-size: 0.9em;
}

input, textarea {
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

textarea {
  min-height: 80px;
}

.add-btn, .remove-btn, .save-btn {
  padding: 6px 12px;
  margin-top: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-btn {
  background-color: #f0f0f0;
}

.remove-btn {
  background-color: #ffebee;
}

.save-btn {
  background-color: #42b983;
  color: white;
}
.file-info {
  margin-top: 8px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}


.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 8px;
  border-radius: 4px;
  margin-top: 8px;
  font-size: 0.9em;
}

.upload-status {
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;
}

.upload-status.success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.upload-status.error {
  background-color: #ffebee;
  color: #c62828;
}


h2 {
  margin-top: 16px;
  font-size: 1.2em;
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
}

.ai-processing {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #eee;
}

.ai-result {
  margin-top: 1rem;
  padding: 1rem;
  background: #f9f9f9;
}
</style>