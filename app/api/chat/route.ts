import { GoogleGenerativeAI } from "@google/generative-ai";
import { pipeline } from '@xenova/transformers';
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// Note: We use the anon key here as this is a read-only operation from a server component.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Cache the embedding model so it doesn't have to load on every request
let extractor: any = null;

async function getRelevantContext(query: string): Promise<string> {
    if (!extractor) {
        // Load the model if it's not already loaded
        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }

    // Create an embedding for the user's query
    const queryEmbedding = await extractor(query, { pooling: 'mean', normalize: true });
    const queryVector = Array.from(queryEmbedding.data);

    // Call the 'match_documents' function in Supabase
    const { data, error } = await supabase.rpc('match_documents', {
        query_embedding: queryVector,
        match_threshold: 0.7, // Adjust this threshold as needed
        match_count: 3        // Get the top 3 most relevant documents
    });

    if (error) {
        console.error("Error matching documents:", error);
        return "Could not retrieve context from the database.";
    }

    // Combine the content of the top results into a single context string
    const context = data.map((item: any) => item.content).join('\n\n');
    return context;
}


export async function POST(req: Request) {
  const { message, language } = await req.json();

  // Get context from our Supabase-powered RAG system
  const retrievedContext = await getRelevantContext(message);
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are Swasthya Mitra, a public health assistant.
      Based ONLY on the following context, answer the user's question. If the context is empty or not relevant, say you don't have enough information.
      Context: "${retrievedContext}"

      User's question: "${message}"
      
      Always include the disclaimer: "This is not medical advice. Please consult a doctor."
      Respond in ${language === "hi" ? "Hindi" : "English"}.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return new Response(JSON.stringify({ response: text }), { status: 200 });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to get a response from the AI." }), { status: 500 });
  }
}