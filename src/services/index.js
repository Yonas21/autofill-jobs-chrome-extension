// For Gemini API
const apiKey = import.meta.env.VITE_GEMINI_API_KEY
// For ChatGPT API
export async function parseWithGemini(resumeText) {
  const prompt = `
  Extract the following from this resume in JSON format:
  {
    "name": "",
    "email": "",
    "phone": "",
    "experience": [{
      "title": "",
      "company": "",
      "duration": "",
      "description": ""
    }],
    "skills": []
  }
  
  Resume: ${resumeText.substring(0, 15000)} // Limit to ~15k chars
  `;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    })
  });

  const data = await response.json();
  return JSON.parse(data.candidates[0].content.parts[0].text);
}
