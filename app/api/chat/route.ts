// app/api/chat/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getVectorStore } from '../../../lib/simpleVectorStore';

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

    // Fallback: use original message for retrieval to restore previous behavior
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const retrievalQuery = message;

    // Get vector store and search for relevant context
    const vectorStore = await getVectorStore();
    const retrievedContext = await vectorStore.getRelevantContext(retrievalQuery, 0.15);

    console.log('Retrieved context length:', retrievedContext.length);

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