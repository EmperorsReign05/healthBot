// scripts/build-embeddings.mjs
import fs from 'fs';
import { getVectorStore } from '../lib/simpleVectorStore.js';

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

console.log('Prewarming embeddings cache...');
try {
  const vs = await getVectorStore();
  // Access to ensure embeddings generated and cached inside loadHealthData
  await vs.getRelevantContext('health', 0.01);
  console.log('Done. Cache ready.');
} catch (e) {
  console.error('Failed building embeddings:', e?.message || e);
  process.exit(1);
}


