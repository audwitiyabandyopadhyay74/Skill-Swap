const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const callGemini = async (prompt) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured in Backend environment.');
  }

  const isVertexExpress = GEMINI_API_KEY.startsWith('AQ.');

  const models = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-pro',
  ];

  let lastError = null;

  for (const model of models) {
    try {
      let url, headers;

      if (isVertexExpress) {
        url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GEMINI_API_KEY}`,
        };
      } else {
        url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        headers = { 'Content-Type': 'application/json' };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      const data = await res.json();
      if (res.ok && data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      if (data.error?.message) {
        lastError = new Error(data.error.message);
        console.error(`Gemini [${model}] error:`, data.error.message);
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to generate AI response from Gemini.');
};


export const generatePostContent = async (req, res) => {
  try {
    const { topic, skillOffered, skillNeeded } = req.body;
    if (!topic && !skillOffered && !skillNeeded) {
      return res.status(400).json({ message: 'Skill details or topic required' });
    }

    const prompt = `You are an AI assistant for SkillSwap, a peer-to-peer skill exchange platform.
A user wants to create a skill exchange post with the following details:
- Topic/Title idea: "${topic || ''}"
- Skill Offered: "${skillOffered || ''}"
- Skill Needed: "${skillNeeded || ''}"

Please generate a compelling, professional, and friendly skill exchange post in JSON format with exactly 3 keys:
1. "title": A catchy headline for the exchange (max 10 words).
2. "description": A clear 2-3 sentence overview of what the user is offering and what they hope to learn in return.
3. "tags": An array of 3-4 relevant skill tags (lowercase single words).

Return ONLY valid raw JSON without any markdown code blocks or additional text.`;

    const rawResult = await callGemini(prompt);
    let parsed;
    try {
      const cleanedJson = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanedJson);
    } catch (e) {
      parsed = {
        title: topic || `Exchange ${skillOffered} for ${skillNeeded}`,
        description: rawResult.trim(),
        tags: [skillOffered, skillNeeded].filter(Boolean),
      };
    }

    return res.json({ result: parsed });
  } catch (err) {
    console.error('Gemini post generator error:', err);
    return res.status(500).json({ message: err.message || 'AI generation failed' });
  }
};

export const generateRoadmap = async (req, res) => {
  try {
    const { skill } = req.body;
    if (!skill) {
      return res.status(400).json({ message: 'Skill name is required' });
    }

    const prompt = `You are a master mentor for SkillSwap. Create a 4-week structured peer-learning roadmap for someone wanting to learn or master: "${skill}".

Format your response in structured JSON with:
1. "skill": "${skill}"
2. "overview": A 2-sentence summary of what learning ${skill} entails.
3. "weeks": An array of 4 objects, each containing:
   - "weekNumber": 1 to 4
   - "title": Week focus title
   - "goals": Array of 2 actionable learning goals
   - "practiceSession": A suggested 1-on-1 peer exchange session activity.

Return ONLY raw JSON without markdown tags.`;

    const rawResult = await callGemini(prompt);
    let parsed;
    try {
      const cleanedJson = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanedJson);
    } catch (e) {
      parsed = {
        skill,
        overview: rawResult.trim(),
        weeks: [],
      };
    }

    return res.json({ roadmap: parsed });
  } catch (err) {
    console.error('Gemini roadmap error:', err);
    return res.status(500).json({ message: err.message || 'AI roadmap generation failed' });
  }
};

export const generateSwapIdeas = async (req, res) => {
  try {
    const { userSkills, interests } = req.body;
    const prompt = `You are the master SkillSwap Gemini AI Co-Pilot.
A user has skills in: "${userSkills || 'general technology and creative arts'}"
and interests in: "${interests || 'new skills, languages, or hobbies'}".

Generate 3 creative, high-value peer-to-peer skill swap ideas.
Format your response in structured JSON with:
1. "ideas": An array of 3 objects, each containing:
   - "title": Catchy title for the exchange
   - "offering": What they teach
   - "learning": What they learn in return
   - "icebreaker": A fun discussion question for their first 1-on-1 meeting
   - "whyItWorks": 1 sentence explaining why this exchange is beneficial.

Return ONLY raw JSON without markdown formatting.`;

    const rawResult = await callGemini(prompt);
    let parsed;
    try {
      const cleanedJson = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanedJson);
    } catch (e) {
      parsed = { ideas: [] };
    }

    return res.json({ ideas: parsed.ideas || [] });
  } catch (err) {
    console.error('Gemini swap ideas error:', err);
    return res.status(500).json({ message: err.message || 'AI swap ideas generation failed' });
  }
};
