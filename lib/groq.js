// Direct Groq API call - fastest possible, no LangChain overhead
export async function askGroq(prompt) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant", // Fastest Groq model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 500,
    }),
  });
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "{}";
  const clean = text.replace(/```json|```/g, "").trim();
  try { return JSON.parse(clean); }
  catch { return { raw: text }; }
}
