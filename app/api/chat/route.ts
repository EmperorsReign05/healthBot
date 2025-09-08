// app/api/chat/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getVectorStore } from '../../../lib/simpleVectorStore';
import { answerFromKeywords } from '../../../lib/keywordQA.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message, language } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: "Invalid message" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const retrievalQuery = message;

    // --- Step 1: Retrieve Context ---
    // We still search our local data first to see if we have a specific, high-quality answer.
    const keywordContext = await answerFromKeywords(retrievalQuery, { language });
    const vectorStore = await getVectorStore();
    
    let vectorQuery = retrievalQuery;
    if (language === 'hi') {
      try {
        const tr = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: `Translate to English, minimal, no extra words:\n${retrievalQuery}` }] }],
          generationConfig: { temperature: 0.0, maxOutputTokens: 64 }
        });
        vectorQuery = tr.response.text().trim() || retrievalQuery;
      } catch {}
    }
    
    const vectorContext = await vectorStore.getRelevantContext(vectorQuery, 0.12);
    const retrievedContext = [keywordContext, vectorContext].filter(Boolean).join('\n\n');

    // --- Step 2: Generate a Flexible Prompt ---
    // This new prompt tells the AI how to behave. It prioritizes local data but allows general knowledge.
    const prompt = `System:
You are Swasthya Mitra, a helpful public health assistant. Your goal is to answer the user's question.
- First, check if the "CONTEXT" section below contains the answer. If it does, use that information to form your response.
- If the context is empty or does not answer the question (especially for general health queries or symptom analysis), use your general knowledge to provide a helpful, safe, and informative answer.
- Respond in a clear, single paragraph in ${language === "hi" ? 'Hindi' : 'English'}.

CONTEXT:
${retrievedContext || "No specific context found."}

User question:
${message}`;

    // --- Step 3: Call the AI and Return the Response ---
    // We now only need one call to the AI, making the process cleaner and more efficient.
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt.slice(0, 12000) }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 768 } // Temperature slightly increased for more creative answers
    });

    const text = result.response.text();
    
    return new Response(JSON.stringify({ response: text }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ 
      error: "Failed to process your request",
      details: errorMessage 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}