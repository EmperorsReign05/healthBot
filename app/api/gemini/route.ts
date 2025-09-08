import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), { status: 500 });
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt || "Say hello");
    const text = result.response.text();
    return new Response(JSON.stringify({ ok: true, text }), { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
}

export async function GET() {
  if (!process.env.GEMINI_API_KEY) {
    return new Response(JSON.stringify({ ok: false, error: "Missing GEMINI_API_KEY" }), { status: 500 });
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent("Ping");
  return new Response(JSON.stringify({ ok: true, text: result.response.text() }), { status: 200 });
}


