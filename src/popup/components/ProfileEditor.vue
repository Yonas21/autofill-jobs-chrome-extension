<template>
  <div class="profile-editor">
    <h2>Personal Information</h2>
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
  props:  {
    profile: {
      type: Object,
      required: true,
      default: () => ({
        name: '',
        email: '',
        phone: '',
        resumeUrl: '',
        linkedin: '',
        github: '',
        experience: []  // Ensure experience is always an array
      }),
      validator: (value) => {
        // Optional: Add validation to ensure experience exists and is an array
        return Array.isArray(value.experience)
      }
    }
  },
  emits: ['save'],
  methods: {
      addExperience() {
      // Ensure `experience` exists and is an array
      if (!Array.isArray(this.profile.experience)) {
        this.profile.experience = [];
      }
      this.profile.experience.push({
        title: "",
        company: "",
        duration: "",
        description: "",
      });
    },
    removeExperience(index) {
      if (Array.isArray(this.profile.experience)) {
        this.profile.experience.splice(index, 1);
      }
    },
  }
}
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

h2 {
  margin-top: 16px;
  font-size: 1.2em;
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
}
</style>