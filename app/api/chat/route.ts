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

    // Get vector store and search for relevant context
    const vectorStore = await getVectorStore();
    const retrievedContext = await vectorStore.getRelevantContext(message, 0.15);

    console.log('Retrieved context length:', retrievedContext.length);

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are Swasthya Mitra, a public health assistant for India.

Context from health database:
${retrievedContext}

User's question: ${message}

Instructions:
1. Answer based primarily on the provided context
2. If context is insufficient, provide general health guidance
3. Focus on Indian public health data and conditions
4. Always include appropriate disclaimers
5. Be empathetic and helpful
6. Respond in ${language === "hi" ? "Hindi" : "English"}

Important: If context is present, explicitly cite which conditions/years/sources from the context you used. Always end with "यह चिकित्सा सलाह नहीं है। कृपया डॉक्टर से सलाह लें।" (This is not medical advice. Please consult a doctor.) if responding in Hindi, or "This is not medical advice. Please consult a doctor." if responding in English.`;

    // Generate response using Gemini
    const result = await model.generateContent(prompt);
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