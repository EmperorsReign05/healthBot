// scripts/populate-database.mjs
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadHealthRecords, recordToDocument } from '../lib/dataLoader.js';
import fs from 'fs';
import crypto from 'crypto';

// IMPORTANT: Make sure you have your service_role key in a .env.local file
// SUPABASE_SERVICE_KEY=your_supabase_service_role_key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function buildContentFromRecord(item, idx) {
  // If symptom-specific CSV schema
  const symptom = item.Symptom || item.symptom;
  const description = item.Description || item.description;
  const precautions = [
    item.Precaution_1 || item.precaution_1,
    item.Precaution_2 || item.precaution_2,
    item.Precaution_3 || item.precaution_3,
    item.Precaution_4 || item.precaution_4,
  ].filter(Boolean);

  if (symptom || description || precautions.length) {
    const textPrec = precautions.length ? ` Precautions: ${precautions.join('; ')}.` : '';
    return {
      id: idx,
      content: `Symptom: ${symptom || 'Unknown'}. Description: ${description || ''}.${textPrec}`,
      metadata: { type: 'symptom', symptom, description, precautions },
    };
  }

  // Fallback to disease-style record
  return recordToDocument(item, idx);
}

async function populateDatabase() {
  console.log('Loading data (JSON + CSV)...');
  const records = await loadHealthRecords();

  const documents = records.map((item, idx) => buildContentFromRecord(item, idx));

  console.log(`Preparing ${documents.length} documents...`);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY missing');
  const genAI = new GoogleGenerativeAI(apiKey);
  const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });

  // Batch-embed
  const embeddings = [];
  const batchSize = 96;
  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);
    if (typeof embeddingModel.batchEmbedContents === 'function') {
      const res = await embeddingModel.batchEmbedContents({
        requests: batch.map(doc => ({ content: { parts: [{ text: doc.content }] } })),
      });
      embeddings.push(...(res.embeddings || []).map(e => Array.from(e.values || [])));
    } else {
      for (const doc of batch) {
        const res = await embeddingModel.embedContent({ content: { parts: [{ text: doc.content }] } });
        embeddings.push(Array.from(res.embedding?.values || []));
      }
    }
    console.log(`Embedded ${Math.min(i + batch.length, documents.length)} / ${documents.length}`);
  }

  // Ensure vector length matches DB column dimension (defaults to 384 for legacy schemas)
  const targetDim = Number(process.env.SUPABASE_VECTOR_DIM || 384);
  const resize = (vec) => {
    if (!Array.isArray(vec)) return new Array(targetDim).fill(0);
    if (vec.length === targetDim) return vec;
    if (vec.length > targetDim) return vec.slice(0, targetDim);
    // pad with zeros
    return vec.concat(new Array(targetDim - vec.length).fill(0));
  };

  const rowsToInsert = documents.map((doc, i) => ({
    content: doc.content,
    category: 'Public Health',
    embedding: resize(embeddings[i]),
    content_hash: crypto.createHash('md5').update(doc.content).digest('hex'),
  }));

  console.log(`Upserting ${rowsToInsert.length} documents to Supabase...`);
  // Chunk to avoid PostgREST statement timeouts
  const chunkSize = 250;
  for (let i = 0; i < rowsToInsert.length; i += chunkSize) {
    const chunk = rowsToInsert.slice(i, i + chunkSize);
    let attempt = 0;
    while (attempt < 3) {
      try {
        const { error } = await supabaseAdmin
          .from('documents')
          .upsert(chunk, { onConflict: 'content_hash', ignoreDuplicates: true, returning: 'minimal' });
        if (!error) {
          console.log(`Upserted ${Math.min(i + chunk.length, rowsToInsert.length)} / ${rowsToInsert.length}`);
          break;
        }
        if (error.code === '57014') {
          console.warn(`Timeout on batch ${i}-${i + chunk.length}, retrying (${attempt + 1}/3)...`);
          attempt++;
          await new Promise(r => setTimeout(r, 1000 * attempt));
          continue;
        }
        throw error;
      } catch (error) {
        console.error('Error upserting data:', error);
        throw error;
      }
    }
  }
  console.log("Successfully populated the database!");
}

populateDatabase();