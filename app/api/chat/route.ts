// app/api/chat/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getVectorStore } from '../../../lib/simpleVectorStore';
import { answerFromKeywords } from '../../../lib/keywordQA.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message, language } = await req.json();

    // Validate input
    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: "Invalid message" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Received message:', message);
    console.log('Language:', language);

    // Use original message for retrieval and LLM synthesis
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const retrievalQuery = message;

    // Build context from deterministic keywords AND vector search, then always call LLM
    const keywordContext = await answerFromKeywords(retrievalQuery, { language });
    const vectorStore = await getVectorStore();
    // If Hindi, try translating to English ONLY for retrieval to help vector search
    let vectorQuery = retrievalQuery
    if (language === 'hi') {
      try {
        const tr = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: `Translate to English, minimal, no extra words:\n${retrievalQuery}` }] }],
          generationConfig: { temperature: 0.0, maxOutputTokens: 64 }
        })
        vectorQuery = tr.response.text().trim() || retrievalQuery
      } catch {}
    }
    const vectorContext = await vectorStore.getRelevantContext(vectorQuery, 0.12);
    const retrievedContext = [keywordContext, vectorContext].filter(Boolean).join('\n\n');

    console.log('Retrieved context length:', retrievedContext?.length || 0);

    // Initialize Gemini model

    const prompt = `System:
You are Swasthya Mitra, a helpful public health assistant. Use ONLY the context below. If the answer is missing, reply exactly with ${language === "hi" ? '"डेटासेट में यह जानकारी उपलब्ध नहीं है।"' : '"Not found in dataset."'}. Otherwise, compose a clear, single paragraph in ${language === "hi" ? 'Hindi' : 'English'} for laypersons, integrating relevant fields (Symptoms, Prevention, Treatment, Year, Region, Source). If the question asks for symptoms and prevention, include both when available.

Context (multiple records):
${retrievedContext}

User question:
${message}`;

    // Generate response using Gemini
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt.slice(0, 12000) }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 768 }
    });
    const response = await result.response;
    const text = response.text();

    console.log('Generated response length:', text.length);

    return new Response(JSON.stringify({ 
      response: text,
      contextUsed: retrievedContext.length > 0 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    
    // Return appropriate error message
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

// Handle GET request for testing
export async function GET() {
  try {
    // Test if Gemini API is working
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent("Say hello");
    const response = await result.response;
    
    return new Response(JSON.stringify({ 
      status: "API is working",
      gemini: "Connected",
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      status: "API Error",
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}