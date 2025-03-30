// File: /api/chat.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { messages, max_tokens } = req.body;
  if (!messages) {
    res.status(400).json({ error: 'Missing messages in request body' });
    return;
  }

  const API_KEY = process.env.OPENAI_API_KEY;
  if (!API_KEY) {
    res.status(500).json({ error: 'Missing OpenAI API key in environment variables' });
    return;
  }

  const payload = {
    model: "gpt-4o",
    messages,
    max_tokens: max_tokens || 500
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      res.status(response.status).json({ error: errorData });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}