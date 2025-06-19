// Listen for fill form command
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillForm') {
    fillForm(request.profile, request.settings)
  }
})

async function fillForm(profile, settings) {
  // Create a reactive proxy of the profile for tracking changes
  const reactiveProfile = new Proxy(profile, {
    get(target, prop) {
      return target[prop]
    },
    set(target, prop, value) {
      target[prop] = value
      return true
    }
  })

  // Field detection and filling logic
  const fieldDetectors = {
    name: ['name', 'full-name', 'full_name', 'applicant_name'],
    email: ['email', 'e-mail', 'applicant_email'],
    phone: ['phone', 'telephone', 'mobile', 'phone_number'],
    location: ['location', 'address', 'city', 'state', 'country'],
    resumeUrl: ['resume', 'cv', 'curriculum_vitae'],
    linkedin: ['linkedin', 'linked_in', 'linkedin_profile'],
    github: ['github', 'git_hub', 'github_profile'],
    experience: ['experience', 'work_experience', 'professional_experience'],
    education: ['education', 'academic_background', 'qualifications']
    // Add more field mappings
  }

  // Fill each field type
  for (const [field, selectors] of Object.entries(fieldDetectors)) {
    if (reactiveProfile[field]) {
      fillFieldsBySelectors(selectors, reactiveProfile[field])
    }
  }

  // Special handling for complex fields
  fillExperienceFields(reactiveProfile.experience)
  fillEducationFields(reactiveProfile.education)
}

function fillFieldsBySelectors(selectors, value) {
  for (const selector of selectors) {
    const inputs = [
      ...document.querySelectorAll(`input[name*="${selector}" i]`),
      ...document.querySelectorAll(`input[id*="${selector}" i]`),
      ...document.querySelectorAll(`input[placeholder*="${selector}" i]`)
    ]

    inputs.forEach(input => {
      input.value = value
      triggerChangeEvent(input)
    })
  }
}

function fillExperienceFields(experience) {
  // Implementation for experience fields
}

function fillEducationFields(education) {
  // Implementation for education fields
}

function triggerChangeEvent(element) {
  const event = new Event('change', { bubbles: true })
  element.dispatchEvent(event)
}