// scripts/gemini-smoke.mjs
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

function loadEnv() {
  try {
    const txt = fs.readFileSync('.env.local', 'utf8');
    for (const line of txt.split('\n')) {
      const [k, v] = line.split('=');
      if (k && v) process.env[k.trim()] = v.trim();
    }
  } catch {}
}

loadEnv();

async function main() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error('Missing GEMINI_API_KEY');
    process.exit(1);
  }
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = process.argv.slice(2).join(' ') || 'Say hello';
  const res = await model.generateContent(prompt);
  console.log(res.response.text());
}

main().catch(e => { console.error(e?.message || e); process.exit(1); });


