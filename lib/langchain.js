import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// LangChain LLM — Groq fastest model
export const llm = new ChatGroq({
  apiKey:      process.env.GROQ_API_KEY,
  model:       "llama-3.1-8b-instant",
  temperature: 0.1,
  maxTokens:   500,
});

/**
 * LangChain chain: PromptTemplate → Groq LLM → StringOutputParser → JSON.parse
 * Using StringOutputParser instead of StructuredOutputParser for speed
 */
export async function runChain(promptText, variables) {
  const prompt = PromptTemplate.fromTemplate(
    promptText + "\n\nRespond ONLY with valid JSON. No markdown, no explanation."
  );

  const chain = RunnableSequence.from([
    prompt,
    llm,
    new StringOutputParser(),
  ]);

  const text  = await chain.invoke(variables);
  const clean = text.replace(/```json|```/g, "").trim();

  try { return JSON.parse(clean); }
  catch { return { raw: clean, parse_error: true }; }
}

// Vision chain kept for interview fraud check
export async function runVisionChain(promptText, base64Image, mimeType) {
  const { ChatGoogleGenerativeAI } = await import("@langchain/google-genai");
  const visionLlm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash", apiKey: process.env.GEMINI_API_KEY, temperature: 0.1,
  });

  const message = {
    role: "user",
    content: [
      { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } },
      { type: "text", text: promptText + "\n\nRespond ONLY with valid JSON." },
    ],
  };

  const response = await visionLlm.invoke([message]);
  const text     = typeof response.content === "string" ? response.content : "";
  const clean    = text.replace(/```json|```/g, "").trim();
  try { return JSON.parse(clean); } catch { return { raw: clean }; }
}
